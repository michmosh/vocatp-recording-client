export class MicrophoneStreamer extends EventTarget {
    constructor() {
        super();
        this.context = null;
        this.stream = null;
        this.source = null;
        this.processor = null;
        this.duration = 0;
    }

    close() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.context) {
            this.context.close();
            this.context = null;
        }
        this.processor = null;
    }

    // Argument is callback: void onDataChunk(pcmChunk: ArrayBuffer)
    async start(onDataChunk) {
        console.log('Streamer: start');
        this.duration = 0; // duration of sent data
        this.context = new AudioContext({ sampleRate: 16000 });

        if ('setSinkId' in AudioContext.prototype) {
            await this.context.setSinkId({ type: 'none' });
        } else {
            console.log('Streamer: AudioContext.setSinkId is not implemented');
        }

        await this.context.audioWorklet.addModule("worklet/processor.js");

        this.processor = new AudioWorkletNode(this.context, "pcm-processor");

        this.processor.port.onmessage = (msg) => {
            let { buffer, duration, stop } = msg.data;
            // console.log(`on PCM data length: ${buffer.byteLength} ${stop ? 'stop':''}`);
            if (stop)
                console.log(`Streamer: Stop. The last buffer length=${buffer.byteLength}`);

            if (buffer.byteLength > 0) {
                this.duration += duration;
                onDataChunk(buffer);
            }

            if (stop) {
                console.log('Streamer: provide empty binary data to stop STT');
                onDataChunk(new ArrayBuffer(0));
            }
        }

        this.processor.connect(this.context.destination);
        this.startMicrophone();
    }

    mute(value) {
        this.processor?.port.postMessage({ mute: value });
    }

    stop() {
        this.processor?.port.postMessage({ stop: true });
    }

    async startMicrophone() {
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

            let track = this.stream.getAudioTracks()[0];
            track.addEventListener('ended', () => {
                this.source?.disconnect(this.processor);
                this.source = null;
                this.dispatchEvent(new CustomEvent('ended'));
            });

            this.source = this.context.createMediaStreamSource(this.stream);
            this.source.connect(this.processor);
            this.dispatchEvent(new CustomEvent('started'));
        } catch (e) {
            console.log('Streamer: cannot start microphone');
            this.dispatchEvent(new CustomEvent('ended'));
        }
    }

    // Returns duration in decisecond (one tenth of a second)
    getDuration() {
        return Math.trunc(this.duration / 100);
    }
}
