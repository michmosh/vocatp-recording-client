'use strict';

import {MicrophoneStreamer} from './mic-streamer';
import {LexiconServer} from './lexicon-server';
import {SpeechToTextServer} from './stt-server';
import {ResultServer} from './result-server'
const { lexiconServerAddress, resultServerAddress,sttServerAddress} = window.BASE_CONFIG
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
        const event = new CustomEvent('onSTTServerError', {detail:"connection-failed"});
        window.dispatchEvent(event)
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
        const connected = await sttServer.connect(sttServerAddress)
        console.log("STT SERVER CONNECT ->" , connected)
        const event = new CustomEvent('onSTTServerConnect', {detail:connected});
        window.dispatchEvent(event)

    } catch (e) {
        setStatus('red', `Cannot connect to STT server: ${sttServerAddress}`, e);
        const event = new CustomEvent('onSTTServerError', {detail:e});
        window.dispatchEvent(event)
        return;
    }

    // Send to STT server { action: "start" }
    await sttServer.start(onSttTerminated);

    streamer.addEventListener('started', () => {
        let index = metaData.metadata.clips.length;
        let recName = getClipName(index);
        setStatus('LightGreen', `recording ${recName}`);
        console.log('microphone started');
        const event = new CustomEvent('onMicrophonConnect', {detail:{}});
        window.dispatchEvent(event)
    });

    streamer.addEventListener('ended', () => {
        console.log('Used microphone disconnected.');
        setStatus('red', 'Microphone stop works. You may reconnect or connect new microphone and/or configure system default microphone.');
        const event = new CustomEvent('onMicrophneDisconect', {detail:{status:'Microphone Disconnect'}});
        window.dispatchEvent(event)
        // Show microphone ready button
        // let microphoneReadyButton = document.getElementById('microphone_ready_btn');
        // microphoneReadyButton.style = "display:block";
        // microphoneReadyButton.onclick = () => {
        //     console.log('trying restart microphone');

        //     // hide the button
        //     microphoneReadyButton.style = "display:none";

        //     streamer.startMicrophone();
        // };
    });

    try {
        await streamer.start((pcmChunk) => {
            console.log("STREAMER START -> " , pcmChunk.byteLength)
            sttServer.send(pcmChunk);
        });
        const event = new CustomEvent('onMicrophonConnect', {detail:{}});
        window.dispatchEvent(event)
    } catch (error) {
        const event = new CustomEvent('onMicrophonError', {detail:error});
        window.dispatchEvent(event)
    }
    // Wait when user enable microphone and start recording.
   

    setStatus('LightGreen', 'recording introduction');
}

export function startMicrophone(){
    streamer.startMicrophone();
}

export function setStatus(color, text) {
    // statusCircle.style.color = `${color}`;
    // statusLine.textContent = text;
}

// Called when pressed mute/un-mute button
export function guiToggleMute() {
    mute = !mute;
    console.log(`guiToggleMute() mute=${mute}`);
    // muteButton.textContent = mute ? 'un-mute' : 'mute';
    streamer.mute(mute);
    return mute
}

// Called when pressed stop button
export async function guiStop(name) {

    console.log(`guiStop()`);

    // startStopButton.onclick = guiStart;
    // startStopButton.textContent = 'start';
    // muteButton.textContent = 'mute';
    // audioClipButton.textContent = 'start summary';

    saveClip(name);

    // Streamer will send to STT empty data to stop.
    streamer.stop();
    console.log("FINAL METADATA -> " , metaData.metadata)
    const event = new CustomEvent('onRecordingEnd', {detail: "SUCCESS"});
    window.dispatchEvent(event)
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
        const event = new CustomEvent('onPostResultServerSuccess', {detail:{status:"success"}});
        window.dispatchEvent(event)

    } else {
        setStatus('red', `Cannot send to result server. Save to download files...`);

        // Add wave url to metadata (to allow download it manually)
        metaData.url = sttServer.waveUrl;
        strMetadata = JSON.stringify(metaData);

        resultServer.saveToFile(strMetadata, "metadata.json");
        resultServer.saveToFile(sttServer.recognizedJSON, "recognized.json");
        const event = new CustomEvent('onPostResultServerError', {detail:{status:"error"}});
        window.dispatchEvent(event)
    }
}

function getClipName(index, isLocale = true) {
    switch (index) {
        case 0: return isLocale ? 'מבוא' : 'introduction';
        case 1: return isLocale ? 'סיכום' : 'summary';
        default: return isLocale ? `מטלה ${index - 1}` : `task ${index - 1}`;
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
export function saveClip(name) {
    let index = metaData.metadata.clips.length;
    let end = streamer.getDuration();
    let begin = (index === 0) ? 0 : metaData.metadata.clips[index - 1].end;
    // let name;
    // switch (index) {
    //     case 0:
    //         name = 'introduction';
    //         break;
    //     case 1:
    //         name = 'summary';
    //         break;
    //     default:
    //         name = `task ${index - 1}`;
    //         break;
    // }
    metaData.metadata.clips.push({ begin, end, name, type: name });
    console.log("METADATA -> ",metaData.metadata)
    return metaData.metadata.clips
}