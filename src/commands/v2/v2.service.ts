import axios from 'axios';
import { MemoryCache } from 'cache-manager';
import { Client, TextBasedChannel } from 'discord.js';
import { io } from 'socket.io-client';
import { Inject } from '../../decorator';
import { generationResultEmbed } from './v2.tools';

export default class V2Service {
  @Inject('CACHE_MANAGER')
  public readonly $store!: MemoryCache;

  @Inject('DISCORD_CLIENT')
  private readonly $client!: Client;

  public readonly serverSocket = io('http://plebea.com:2200');

  constructor() {
    this.$store.get;
  }

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

  public async registDebugChannel(channel: TextBasedChannel) {
    this.serverSocket.on('generateResult', (result) => {
      const embed = generationResultEmbed(result);
      channel.send({
        embeds: [embed],
        files: [
          {
            name: 'novel.png',
            attachment: result.url,
          },
        ],
      });
    });
  }
}
