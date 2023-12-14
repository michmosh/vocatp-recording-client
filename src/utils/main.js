'use strict';
import { lexiconServerAddress, resultServerAddress,sttServerAddress} from './config'
import {MicrophoneStreamer} from './mic-streamer';
import {LexiconServer} from './lexicon-server';
import {SpeechToTextServer} from './stt-server';
import {ResultServer} from './result-server'

let streamer = new MicrophoneStreamer();
let lexiconServer = new LexiconServer();
let sttServer = new SpeechToTextServer();
let resultServer = new ResultServer();

// HTML elements
let statusCircle;
let statusLine;
let startStopButton;
let muteButton;
let audioClipButton;
let mute;

// Note: Missed code that fill the form !
// Can be variable number of recipients.
let metaData = {
    metadata: {
        id: "", // will be filled automatically in guiStart();
        topic: "Topic",
        leader: "Mosh Haliwa",
        purpose: "Purpose of the recording",
        recipients: [
            {
                name: "אריאל",
                email: "arielp@gmail.com"
            },
            {
                name: "שרון",
                email: "sharon.biniashvili@audiocodes.com"
            },
            {
                name: "Igor",
                email: "igor.kolosov@audiocodes.com"
            }
        ],
        clips: [] // will be filled by function saveClip()
    }
};


// onload();

// Called on HTML page load
export function onload() {
    
    // statusCircle = document.getElementById('status_circle');
    // statusLine = document.getElementById('status_line');
    // startStopButton = document.getElementById('start_stop_btn');
    // muteButton = document.getElementById('audio_clip_btn');
    // audioClipButton = document.getElementById('mute_btn');

    // startStopButton.textContent = 'start';
    // startStopButton.onclick = guiStart;

    // muteButton.textContent = 'mute';
    // muteButton.onclick = guiToggleMute;

    // audioClipButton.textContent = 'start summary';
    // audioClipButton.onclick = guiSaveClip;

    // setStatus('red', 'to start press "start" button');
}

// Called when pressed start button
export async function guiStart(data) {
    console.log('guiStart()');

    mute = false;
    metaData.metadata = data
    // hide "start" button, show stop" button
    // startStopButton.textContent = 'stop';
    // startStopButton.onclick = guiStop;

    metaData.metadata.id = crypto.randomUUID();

    // If result server in on-line ?
    // setStatus('red', `Check connection to result server: ${resultServerAddress}`);
    if (!await resultServer.options(resultServerAddress)) {
        // setStatus('red', `Cannot connect to result server: ${resultServerAddress}`);
        return;
    }

    // Download optional lexicon and glossary
    try {
        let data = await lexiconServer.get(lexiconServerAddress);
        if (data?.lexicon)
            sttServer.setLexicon(data.lexicon);
        if (data?.glossary)
            sttServer.setGlossary(data.glossary);
    } catch (e) {
        console.log('Warning: Cannot load glossary/lexicon', e);
    }
    // Wait connect to STT server
    setStatus('red', `Connecting to STT server: ${sttServerAddress}`);

    try {
        await sttServer.connect(sttServerAddress)
    } catch (e) {
        setStatus('red', `Cannot connect to STT server: ${sttServerAddress}`, e);
        return;
    }

    // Send to STT server { action: "start" }
    await sttServer.start(onSttTerminated);

    // Wait when user enable microphone and start recording.
    await streamer.start((pcmChunk) => {
        console.log("STREAMER START -> " , pcmChunk.length)
        sttServer.send(pcmChunk);
    });

    setStatus('LightGreen', 'recording introduction');
}

export function setStatus(color, text) {
    // statusCircle.style.color = `${color}`;
    // statusLine.textContent = text;
}

// Called when pressed mute/un-mute button
export function guiToggleMute() {
    mute = !mute;
    console.log(`guiToggleMute() mute=${mute}`);
    muteButton.textContent = mute ? 'un-mute' : 'mute';
    streamer.mute(mute);
}

// Called when pressed stop button
export async function guiStop() {

    console.log(`guiStop()`);

    // startStopButton.onclick = guiStart;
    // startStopButton.textContent = 'start';
    // muteButton.textContent = 'mute';
    // audioClipButton.textContent = 'start summary';

    saveClip();

    // Streamer will send to STT empty data to stop.
    streamer.stop();
}

// STT receive empty data to stop and called the event.
export async function onSttTerminated() {
    console.log("ON STT TERMINATED")
    streamer.close();

    setStatus('yellow', `Uploaded data... Please do not close the HTML page`);

    let strMetadata = JSON.stringify(metaData);
    let isOK = await resultServer.post(resultServerAddress,
        {
            metadata: strMetadata,
            recognized: sttServer.recognizedJSON,
            waveUrl: sttServer.waveUrl
        });
    if (isOK) {
        setStatus('red', `Data successfully sent. You can close the page`);

    } else {
        setStatus('red', `Cannot send to result server. Save to download files...`);

        // Add wave url to metadata (to allow download it manually)
        metaData.url = sttServer.waveUrl;
        strMetadata = JSON.stringify(metaData);

        resultServer.saveToFile(strMetadata, "metadata.json");
        resultServer.saveToFile(sttServer.recognizedJSON, "recognized.json");
    }
}

// Add clip to metadata and modify GUI:
// - currently recording audio clip (recName)
// - and next recording audio clip (nextName)
export function guiSaveClip() {
    console.log('guiSaveClip()');
    saveClip();

    let index = metaData.metadata.clips.length - 1;
    let recName = index === 0 ? 'summary' : `task ${index}`;
    let nextName = `task ${index + 1}`;

    setStatus('LightGreen', `recording ${recName}`);
    audioClipButton.textContent = `press to start recording ${nextName}`;
}

// Add clip to metaData.metadata.clips array
export function saveClip() {
    let index = metaData.metadata.clips.length;
    let end = streamer.getDuration();
    let begin = (index === 0) ? 0 : metaData.metadata.clips[index - 1].end;
    let name;
    switch (index) {
        case 0:
            name = 'introduction';
            break;
        case 1:
            name = 'summary';
            break;
        default:
            name = `task ${index - 1}`;
            break;
    }
    metaData.metadata.clips.push({ begin, end, name });
}