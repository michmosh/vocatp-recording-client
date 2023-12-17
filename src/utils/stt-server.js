import {sttServerAddress} from './config'
export class SpeechToTextServer {
    constructor() {
        this.websocket = null;
        this.isFirstWord = null;
        this.recognizedTotal = 0;
        this.recognizedJSON = '';
        this.waveUrl = '';
        this.onTerminatedCallback = null;
        this.lexicon = null;
        this.glossary = null;
    }

    async connect(sttServerAddress) {
        const url = `wss://${sttServerAddress}/api/v1/speech:recognizeLVCSR`;
        console.log(`STT: connecting ${url}`);
        this.isFirstWord = true;
        this.recognizedTotal = 0;
        this.recognizedJSON = '{"words":[\n';
        this.waveUrl = '';

        return new Promise((resolve, reject) => {
            this.websocket = new WebSocket(url);
            this.websocket.onopen = () => {
                console.log(`STT: connected`);
                resolve();
            }
            this.websocket.onerror = (e) => {
                console.log(`STT: websocket error`, e);
                reject(e)
            };
            this.websocket.onclose = () => {
                console.log('STT: websocket closed');
            }
        });
    }

    // Send action: "start"
    async start(onStopped) {
        this.onStoppedCallback = onStopped;
        let actionStart = {
            "action": "start",
            "content-type": "audio/l16;rate=16000",
            "cookie": "STT Demo",
            "accept-language": "he-il",
            "context": "sttg",
            "confidence-threshold": "0",
            "n-best-list-length": "1",
            "recognition-timeout": "15000",
            "speech-complete-timeout": "500",
            "speech-incomplete-timeout": "1500",
            "no-input-timeout": "5000",
            "speed-vs-accuracy": "50",
            "save-waveform": "1"
        };

        // Optional parts.
        if (this.glossary)
            actionStart['adhoc-glossary'] = this.glossary;
        if (this.lexicon)
            actionStart['adhoc-glossary-lexicon'] = this.lexicon;

        // Send "action start" and await "error READY"
        return new Promise((resolve, reject) => {
            this.websocket.onmessage = ((e) => {
                let msg = JSON.parse(e.data);
                console.log(`STT: receive: ${e.data}`);
                if (msg.error && msg.status === 'READY')
                    resolve();
                this.websocket.onmessage = this.onMessage.bind(this);
            }).bind(this);

            console.log(`STT: send ${JSON.stringify(actionStart, null, 2)}`);
            this.websocket.send(JSON.stringify(actionStart));
            const event = new CustomEvent('onRecordingStart', {detail: "START RECORDING"});
            window.dispatchEvent(event)
        });
    }

    onMessage(e) {
        let data = e.data;
        let msg = JSON.parse(data);
        if (msg.events) {
            // console.log('STT events: ', JSON.stringify(msg, null, 2));
            let words = msg.events[0].alternatives[0].words;

            // filter words array
            for (let word of words) {
                // remove "final" and "index" if need.
                if (word.location > 0 && word.final > 0) {
                    let { final, index, ...rest } = word;
                    let json = JSON.stringify(rest);

                    console.log('STT Rec: ' + rest.word);
                    this.recognizedTotal++;

                    if (this.isFirstWord) {
                        this.isFirstWord = false;
                        this.recognizedJSON += json;
                    } else {
                        this.recognizedJSON += ',\n' + json;
                    }
                }
            }
        } else if (msg.error) {
            console.log('STT: message', JSON.stringify(msg, null, 2));
            if (msg?.status === 'ABORTED') {
                let waveformTag = msg['waveform-tag'];
                this.waveUrl = `https://${sttServerAddress}/v1/${waveformTag}`;
                this.recognizedJSON += '\n]}';
                console.log(`STT: Aborted. Recognized: ${this.recognizedTotal}\nWave: ${this.waveUrl}`);
                this.onStoppedCallback();
            }
        } else {
            console.log('STT: Unknown message', JSON.stringify(msg, null, 2));
        }
    }

    send(pcmChunk) {
        if (this.websocket?.readyState == WebSocket.OPEN)
            this.websocket.send(pcmChunk);
    }

    setLexicon(lexicon) {
        this.lexicon = lexicon;
    }

    setGlossary(glossary) {
        this.glossary = glossary;
    }
}