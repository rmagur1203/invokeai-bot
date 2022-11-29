import io, { Socket } from 'socket.io-client';

export default class SocketIOApi {
  public readonly socket: Socket;

  constructor(url: string) {
    this.socket = io(url);
  }

  protected send(message: any) {
    this.socket.send(JSON.stringify(message));
  }

  protected emit(event: string, ...params: any) {
    this.socket.emit(event, ...params);
  }

  protected on(event: string, callback: (payload: any) => void) {
    this.socket.on(event, callback);
  }

  protected once(event: string, callback: (payload: any) => void) {
    this.socket.once(event, callback);
  }

  protected onMessage(callback: (message: any) => void) {
    this.socket.on('message', (message) => {
      callback(JSON.parse(message));
    });
  }

  public onConnect(callback: () => void) {
    this.socket.on('connect', callback);
  }

  public onDisconnect(callback: () => void) {
    this.socket.on('disconnect', callback);
  }

  public onProgressUpdate(callback: (progress: ProgressUpdate) => void) {
    this.on('progressUpdate', callback);
  }

  public onIntermediateResult(callback: (result: IntermediateResult) => void) {
    this.on('intermediateResult', callback);
  }

  public onGenerationResult(callback: (result: GenerationResult) => void) {
    this.on('generationResult', callback);
  }

  public onceGenerationResult(callback: (result: GenerationResult) => void) {
    this.once('generationResult', callback);
  }

  public async onceGenerationResultAsync(): Promise<GenerationResult> {
    return new Promise<GenerationResult>((resolve) => {
      this.onceGenerationResult(resolve);
    });
  }

  public onProcessingCanceled(callback: () => void) {
    this.on('processingCanceled', callback);
  }

  public requestSystemConfig(): Promise<SystemConfig> {
    return new Promise((resolve, reject) => {
      this.socket.emit('requestSystemConfig');

      this.socket.on('systemConfig', (config) => {
        resolve(config);
      });
    });
  }

  public requestImages(type: 'user' | 'result'): Promise<GalleryImages> {
    return new Promise((resolve, reject) => {
      this.emit('requestImages', type);

      this.on('galleryImages', (images) => {
        if (images.category == type) {
          resolve(images);
        }
      });
    });
  }

  public generateImage(
    generation: GenerationParameters,
    esrgan: any,
    facetool: any
  ) {
    this.emit('generateImage', generation, esrgan, facetool);
  }

  public cancel() {
    this.emit('cancel');
  }
}

export interface Image {
  url: string;
  mtime: number;
  metadata: Metadata;
  width: number;
  height: number;
  category: string;
}

export interface GalleryImages {
  areMoreImagesAvailable: boolean;
  category: string;
  images: Image[];
}

export interface ProgressUpdate {
  currentStep: number;
  totalSteps: number;
  currentIteration: number;
  totalIterations: number;
  currentStatus: string;
  isProcessing: boolean;
  currentStatusHasSteps: boolean;
  hasError: boolean;
}

export interface Metadata extends SystemConfig {
  image: {
    prompt: { prompt: string; weight: number }[];
    steps: number;
    cfg_scale: number;
    threshold: number;
    perlin: number;
    height: number;
    width: number;
    seed: number;
    seamless: boolean;
    hires_fix: boolean;
    postprocessing?: any;
    sampler: string;
    variations: any[];
    type: string;
  };
}

export interface IntermediateResult {
  url: string;
  isBase64: boolean;
  mtime: number;
  metadata: Metadata;
  width: number;
  height: number;
}

export interface GenerationResult {
  url: string;
  mtime: number;
  metadata: Metadata;
  width: number;
  height: number;
}

export interface GenerationParameters {
  prompt: string;
  iterations: number;
  steps: number;
  cfg_scale: number;
  threshold: number;
  perlin: number;
  height: number;
  width: number;
  sampler_name: string;
  seed: number;
  progress_images: boolean;
  progress_latents: boolean;
  save_intermediates: number;
  seamless: boolean;
  hires_fix: boolean;
  variation_amount: number;
}

export interface SystemConfig {
  model: string;
  model_id?: any;
  model_hash: string;
  app_id: string;
  app_version: string;
  model_list: { [x: string]: Model };
}

export interface Model {
  status: string;
  description: string;
}
