import axios from 'axios';

export default class V2Service {
  async generate(
    prompt: string,
    images?: number,
    steps?: number,
    width?: number,
    height?: number,
    cfgScale?: number,
    sampler?: string,
    seed?: number
  ) {
    const { data } = await axios.post('http://plebea.com:2200/generate', {
      prompt,
      images,
      steps,
      width,
      height,
      cfg_scale: cfgScale,
      sampler,
      seed,
    });
    return data as string[];
  }
}
