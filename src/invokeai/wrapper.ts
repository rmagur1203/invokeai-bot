import SocketIOApi, { GenerationParameters, SystemConfig } from './api';
import {
  FACETOOL_TYPES,
  HEIGHTS,
  IN_PROGRESS_IMAGE_TYPES,
  NUMPY_RAND_MAX,
  NUMPY_RAND_MIN,
  SAMPLERS,
  WIDTHS,
} from './constants';

export default class SocketIOApiWrapper {
  public readonly api: SocketIOApi;
  private systemConfig?: SystemConfig;

  constructor(private readonly url: string) {
    this.api = new SocketIOApi(url);
  }

  public async getSystemConfig(): Promise<SystemConfig> {
    return await this.api.requestSystemConfig();
  }

  public async getImages(type: 'user' | 'result'): Promise<any> {
    return await this.api.requestImages(type);
  }

  public getImage(path: string): string {
    return `${this.url}/${path}`;
  }

  public async generate(_config: Partial<GenerationConfig>): Promise<any> {
    if (!this.systemConfig) {
      this.systemConfig = await this.getSystemConfig();
    }
    const config = { ...DefaultGenerationConfig, ..._config };
    const parameter: GenerationParameters = {
      prompt: config.prompt,
      iterations: config.images,
      steps: config.steps,
      cfg_scale: config.cfg_scale,
      threshold: config.threshold,
      perlin: config.perlin_noise,
      height: config.height,
      width: config.width,
      sampler_name: config.sampler,
      seed: _config.seed ?? generateSeed(),
      progress_images: config.display_inprogress.type.value === 'full-res',
      progress_latents: config.display_inprogress.type.value === 'latents',
      save_intermediates: config.display_inprogress.interval,
      seamless: config.seamless_tiling,
      hires_fix: config.hires_fix,
      variation_amount: config.variation_amount,
    };
    return this.api.generateImage(
      parameter,
      config.upscale,
      config.restore_face
    );
  }

  public cancelGeneration(): void {
    this.api.cancel();
  }
}

export type valueOf<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

export interface GenerationConfig {
  prompt: string;
  images: number;
  steps: number;
  cfg_scale: number;
  width: valueOf<typeof WIDTHS>;
  height: valueOf<typeof HEIGHTS>;
  sampler: valueOf<typeof SAMPLERS>;
  seed: number;
  threshold: number;
  perlin_noise: number;
  variation_amount: number;
  seamless_tiling: boolean;
  hires_fix: boolean;
  display_inprogress: {
    type: valueOf<typeof IN_PROGRESS_IMAGE_TYPES>;
    interval: number;
  };
  upscale?: {
    level: number;
    strength: number;
  };
  restore_face?: {
    strength: number;
    type: valueOf<typeof FACETOOL_TYPES>;
  };
}

export const DefaultGenerationConfig: GenerationConfig = {
  prompt: '',
  images: 1,
  steps: 50,
  cfg_scale: 7.5,
  width: 512,
  height: 512,
  sampler: 'k_lms',
  seed: Math.floor(
    Math.random() * (NUMPY_RAND_MAX - NUMPY_RAND_MIN + 1) + NUMPY_RAND_MIN
  ),
  threshold: 0,
  perlin_noise: 0,
  variation_amount: 0,
  seamless_tiling: false,
  hires_fix: true,
  display_inprogress: {
    type: IN_PROGRESS_IMAGE_TYPES[1],
    interval: 5,
  },
  upscale: undefined,
  restore_face: undefined,
};

function generateSeed() {
  return Math.floor(
    Math.random() * (NUMPY_RAND_MAX - NUMPY_RAND_MIN + 1) + NUMPY_RAND_MIN
  );
}
