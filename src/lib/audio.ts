export class AudioController {
  context: AudioContext | null = null;
  private loadedData: Record<string, ArrayBuffer> = {};
  private loadedAudio: Record<string, AudioBuffer> = {};

  async setupContext() {
    this.context = this.context || new AudioContext();
    await this.update();
  }

  async load(key: string, url: string) {
    if (this.loadedData[key]) {
      return;
    }

    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    this.loadedData[key] = buffer;
    await this.update();
  }

  async play(key: string) {
    const ctx = this.context;
    if (!ctx) {
      console.warn("AudioContext is not initialized");
      return;
    }

    const buffer = this.loadedAudio[key];
    if (!buffer) {
      return;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
  }

  private async update() {
    const ctx = this.context;
    if (!ctx) {
      return;
    }

    const tasks: Promise<unknown>[] = [];

    for (const key in this.loadedData) {
      if (this.loadedAudio[key]) {
        continue;
      }

      const decodingTask = ctx
        .decodeAudioData(this.loadedData[key])
        .then((buffer) => (this.loadedAudio[key] = buffer));
      tasks.push(decodingTask);
    }

    return Promise.all(tasks);
  }
}
