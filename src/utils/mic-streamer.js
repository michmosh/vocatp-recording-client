export class MicrophoneStreamer {
    constructor() {
        this.context = null;
        this.stream = null;
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

        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

        let ts = this.stream.getAudioTracks()[0].getSettings();
        let { channelCount, sampleRate } = ts;
        console.log(`Streamer: Microphone audio: channels=${channelCount}, sampleRate=${sampleRate}`);

        const source = this.context.createMediaStreamSource(this.stream);
        try {
            const process = await this.context.audioWorklet.addModule("worklet/processor.js");
        } catch (error) {
            console.error("ERROR IN ADD MODULE- > ",error)
        }
       
        this.processor = new AudioWorkletNode(this.context, "pcm-processor");
        this.processor.port.onmessage = (msg) => {
            let { buffer, duration, stop } = msg.data;

            console.log(`on PCM data length: ${buffer.byteLength} ${stop ? 'stop':''}`);

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

        source.connect(this.processor).connect(this.context.destination);
    }

    mute(value) {
        this.processor?.port.postMessage({ mute: value });
    }

    stop() {
        this.processor?.port.postMessage({ stop: true });
    }

    // Returns duration in decisecond (one tenth of a second)
    getDuration() {
        return Math.trunc(this.duration / 100);
    }
}