import axios from 'axios';
import { MemoryCache } from 'cache-manager';
import { Client, TextBasedChannel, ThreadChannel } from 'discord.js';
import { io } from 'socket.io-client';
import { createBrotliDecompress } from 'zlib';
import { Inject } from '../../decorator';
import { generationResultEmbed, streamToString } from './v2.tools';

export default class V2Service {
  @Inject('CACHE_MANAGER')
  public readonly $store!: MemoryCache;

  @Inject('DISCORD_CLIENT')
  private readonly $client!: Client;

  public readonly serverSocket = io('http://plebea.com:2200');

  public threads: ThreadChannel[] = [];

  constructor() {
    this.$store.get;
    this.serverSocket.on('generateEnd', async (uuid, result) => {
      const embed = generationResultEmbed(result);
      const thread = this.threads.find((thread) => thread.name === uuid);
      if (!thread) return;
      if (thread.archived) await thread.setArchived(false);
      await thread.send({
        embeds: [embed],
        files: [
          {
            name: 'novel.png',
            attachment: result.url,
          },
        ],
      });
      await thread.setArchived(true);
    });
  }

  async generate(
    prompt: string,
    images?: number,
    steps?: number,
    width?: number,
    height?: number,
    cfgScale?: number,
    sampler?: string,
    seed?: number,
    highres?: boolean
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
      highres,
    });
    return data as string[];
  }

  private randomPromptData?: string[][];

  public async updateRandomPrompt() {
    const id = Math.floor(Math.random() * 4995) + 1;
    const data = await axios
      .get(`https://tlnd.cc/tags/${id}.json`, {
        decompress: false,
        responseType: 'stream',
        transformResponse(data) {
          return data.pipe(createBrotliDecompress());
        },
      })
      .then(({ data }) => streamToString(data))
      .then((data) => JSON.parse(data));
    this.randomPromptData = data as string[][];
  }

  public async getRandomPrompt() {
    if (this.randomPromptData === undefined) {
      await this.updateRandomPrompt();
    }
    const index = Math.floor(Math.random() * this.randomPromptData!.length);
    return this.randomPromptData![index].join(', ');
  }

  public async registDebugChannel(channel: TextBasedChannel) {
    console.log('registDebugChannel', channel.id);
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
