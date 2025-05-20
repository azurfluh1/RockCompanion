class PitchProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
      this.buffer = [];
      this.bufferSize = 4096;
    }
  
    process(inputs) {
      const input = inputs[0][0];
      if (!input) return true;
  
      this.buffer.push(...input);
  
      if (this.buffer.length >= this.bufferSize) {
        this.port.postMessage(this.buffer.slice(0, this.bufferSize));
        this.buffer = this.buffer.slice(this.bufferSize);
      }
  
      return true;
    }
  }
  
  registerProcessor("pitch-processor", PitchProcessor);