import io, { Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

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

  public onModelChanged(callback: (model: ModelChanged) => void) {
    this.on('modelChanged', callback);
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

  public requestModelChange(model: string) {
    this.emit('requestModelChange', model);
  }

  public requestImages(
    type: 'user' | 'result',
    mtime?: number
  ): Promise<GalleryImages> {
    return new Promise((resolve, reject) => {
      this.emit('requestImages', type, mtime);

      this.on('galleryImages', (images) => {
        if (images.category == type) {
          resolve(images);
        }
      });
    });
  }

  public generateImage(
    generation: GenerationParameters,
    esrgan?: EsrganParameters,
    facetool?: FacetoolParameters
  ) {
    this.emit('generateImage', generation, esrgan, facetool);
  }

  // public uploadImage(filename: string) {

  // }

  public deleteImage(
    url: string,
    thumbnail: string,
    category: 'user' | 'result'
  ): Promise<any> {
    const uuid = uuidv4();
    return new Promise((resolve, reject) => {
      this.emit('deleteImage', url, thumbnail, uuid, category);
      this.on('imageDeleted', (data) => {
        if (data.uuid == uuid) {
          resolve(data);
        }
      });
    });
  }

  public cancel() {
    this.emit('cancel');
  }
}

export type GenerationMode = 'txt2img';

export interface EsrganParameters {
  level: number;
  strength: number;
}

export interface FacetoolParameters {
  codeformer_fidelity?: number;
  strength: number;
  type: 'gfpgan' | 'codeformer';
}

export interface PostProcessing {
  scale?: number;
  fidelity?: number;
  strength: number;
  type: 'esrgan' | 'gfpgan' | 'codeformer';
}

export interface Image {
  url: string;
  thumbnail: string;
  mtime: number;
  metadata: Metadata;
  dreamPrompt: string;
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
    postprocessing?: PostProcessing[];
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
  generationMode: GenerationMode;
  boundingBox?: any;
}

export interface GenerationResult {
  url: string;
  thumbnail: string;
  mtime: number;
  metadata: Metadata;
  dreamPrompt: string;
  width: number;
  height: number;
  boundingBox?: any;
  generationMode: GenerationMode;
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
  generation_mode: GenerationMode;
  init_mask: string;
  seamless: boolean;
  hires_fix: boolean;
  variation_amount: number;
}

export interface ModelChanged {
  model_list: { [x: string]: Model };
  model_name: string;
}

export interface SystemConfig {
  model: string;
  model_weights: string;
  model_hash: string;
  app_id: string;
  app_version: string;
  model_list: { [x: string]: Model };
  infill_methods: string[];
}

export interface Model {
  status: string;
  description: string;
}
