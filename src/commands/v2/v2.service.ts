import axios from 'axios';
import { MemoryCache } from 'cache-manager';
import { Client, TextBasedChannel, ThreadChannel } from 'discord.js';
import { io } from 'socket.io-client';
import { createBrotliDecompress } from 'zlib';
import { Inject } from '../../decorator';
import { generationResultEmbed, streamToString } from './v2.tools';
import { SERVER_URL } from './v2.constant';

export default class V2Service {
  @Inject('CACHE_MANAGER')
  public readonly $store!: MemoryCache;

  @Inject('DISCORD_CLIENT')
  private readonly $client!: Client;

  public readonly serverSocket = io(SERVER_URL);

  public threads: ThreadChannel[] = [];

  constructor() {
    this.InitializeEvents();
  }

  async InitializeEvents() {
    this.serverSocket.on('connect', () => {
      console.log(`Connected to server ${SERVER_URL}`);
    });
    this.serverSocket.on('generateStart', async (server, uuid) => {
      const thread = this.threads.find((thread) => thread.name === uuid);
      if (!thread) return;
      if (thread.archived) thread.setArchived(false);
      await thread.send(`${server.name}에서 생성을 시작했습니다.`);
    });
    this.serverSocket.on('generateEnd', async (server, uuid, result) => {
      const embed = generationResultEmbed(result);
      const thread = this.threads.find((thread) => thread.name === uuid);
      if (!thread) return;
      if (thread.archived) await thread.setArchived(false);
      await thread.send(`${server.name}에서 생성을 완료했습니다.`);
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
    this.serverSocket.on('disconnect', () => {
      console.log(`Disconnected from server ${SERVER_URL}`);
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
    const { data } = await axios.post(`${SERVER_URL}/generate`, {
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
