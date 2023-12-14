export class pcmProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        const samplesPerFrame = 128; // constant for AudioContext
        const sampleSize = 2;        // for PCM
        this.frameSize = samplesPerFrame * sampleSize;
        const frames = 25;
        this.size = this.frameSize * frames;
        this.frameDuration = 8;    // for frequency 16000, a sample duration is 0.0625ms, for 128 samples frame 8ms
        this.offset = 0;
        this.duration = 0;
        this.buffer = new ArrayBuffer(this.size);
        this.view = new DataView(this.buffer);
        this.stop = false;
        this.mute = false;

        this.port.onmessage = (msg) => {
            let { stop, mute } = msg.data;
            console.log(`processor on message`, msg.data);
            if (stop) {
                this.stop = true;
                this.send();
            } else if (mute !== undefined) {
                this.mute = mute;
            }
        }
    }

    send() {
        this.port.postMessage({
            buffer: new DataView(this.buffer, 0, this.offset),
            duration: this.duration,
            stop: this.stop
        });
    }

    process(inputs, outputs, parameters) {
        if (this.stop)
            return false;

        const data = inputs[0][0];

        this.floatTo16BitPCM(this.view, this.offset, data, this.mute);
        this.offset += this.frameSize;
        this.duration += this.frameDuration;
        
        if (this.offset >= this.size) {
            this.send();
            this.offset = 0;
            this.duration = 0;
        }
        return true;
    }

    floatTo16BitPCM(view, offset, input, mute) {
        for (let i = 0; i < input.length; i++, offset += 2) {
            let sample;
            if (mute) {
                sample = 0;
            } else {
                sample = Math.max(-1, Math.min(1, input[i]));
            }
            view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
        }
    }
}

registerProcessor("pcm-processor", pcmProcessor);