import { MemoryCache } from 'cache-manager';
import {
  ChatInputCommandInteraction,
  Client,
  ComponentType,
  TextChannel,
  ThreadChannel,
} from 'discord.js';
import { Inject } from '../../decorator';
import { GenerationConfig, WIDTHS, HEIGHTS } from '../../invokeai';
import V2Service from './v2.service';
import { generatePromptModal, showModal } from './v2.tools';

export default class V2Controller {
  @Inject('CACHE_MANAGER')
  public readonly $store!: MemoryCache;

  @Inject('DISCORD_CLIENT')
  private readonly $client!: Client;

  private readonly service = new V2Service();

  private get threads(): ThreadChannel[] {
    return this.service.threads;
  }

  private set threads(value: ThreadChannel[]) {
    this.service.threads = value;
  }

  constructor() {
    this.initialize();
  }

  private async initialize() {
    const debugChannelIds =
      (await this.$store.get<string[]>('novel_debug_channel_ids')) ?? [];

    for (const channelId of debugChannelIds) {
      const channel = await this.$client.channels.fetch(channelId);
      if (channel instanceof TextChannel) {
        this.service.registDebugChannel(channel);
        channel.send('디버그 채널로 연결되었습니다.');
      }
    }
  }

  async generate(interaction: ChatInputCommandInteraction) {
    const width = interaction.options.getNumber('width');
    const height = interaction.options.getNumber('height');
    const steps = interaction.options.getNumber('steps');
    const images = interaction.options.getNumber('images');
    const cfgScale = interaction.options.getNumber('cfg_scale');
    const seed = interaction.options.getNumber('seed');
    const highres = interaction.options.getBoolean('highres') ?? true;
    const randomPrompt =
      interaction.options.getBoolean('random_prompt') ?? false;

    const options: Partial<GenerationConfig> = {};
    if (width && WIDTHS.includes(width as any)) options.width = width as any;
    if (height && HEIGHTS.includes(height as any))
      options.height = height as any;
    if (steps) options.steps = steps;
    if (images) options.images = images;
    if (cfgScale) options.cfg_scale = cfgScale;
    if (seed && seed !== 0) options.seed = seed;
    if (highres) options.hires_fix = highres;

    if (randomPrompt) {
      interaction.deferReply();

      await this.service.updateRandomPrompt();

      let uuids: string[] = [];

      for (let i = 0; i < (options.images ?? 1); i++) {
        const prompt = await this.service.getRandomPrompt();

        uuids = uuids.concat(
          await this.generateUUID(
            interaction,
            {
              ...options,
              prompt,
              images: 1,
            },
            true
          )
        );

        if (i % 100) await this.service.updateRandomPrompt();
      }

      uuids = Array.from(new Set(uuids));

      let content =
        '```md\n' + uuids.map((x, i) => `${i}. ${x}`).join('\n') + '\n```';

      if (content.length > 2000)
        content = content.slice(0, 2000 - 7) + '...\n```';
      await interaction.editReply(content);
    } else {
      const promptModal = generatePromptModal();
      const modalSubmit = await showModal(interaction, promptModal);
      if (!modalSubmit) return;
      const prompt = modalSubmit.fields.getField(
        promptModal.components[0].components[0].data.custom_id!
      );
      if (prompt.type !== ComponentType.TextInput) return;
      options.prompt = prompt.value;

      const uuids = await this.generateUUID(interaction, options);

      let content =
        '```md\n' + uuids.map((x, i) => `${i}. ${x}`).join('\n') + '\n```';

      if (content.length > 2000)
        content = content.slice(0, 2000 - 7) + '...\n```';
      await modalSubmit.reply(content);
    }
  }

  async generateUUID(
    interaction: ChatInputCommandInteraction,
    options: Partial<GenerationConfig>,
    randomPrompt = false
  ) {
    let uuids: string[] = [];
    if (randomPrompt) {
      for (let i = 0; i < (options.images ?? 1); i++) {
        const prompt = await this.service.getRandomPrompt();
        const generated = await this.service.generate(
          prompt,
          1,
          options.steps,
          options.width,
          options.height,
          options.cfg_scale,
          options.sampler,
          options.seed,
          options.hires_fix
        );
        const threads = await this.generateThread(
          interaction,
          prompt,
          generated
        );

        if (i % 100) await this.service.updateRandomPrompt();

        uuids = uuids.concat(generated);
        this.threads = this.threads.concat(threads);
      }
    } else {
      if (!options.prompt) return [];
      uuids = await this.service.generate(
        options.prompt,
        options.images,
        options.steps,
        options.width,
        options.height,
        options.cfg_scale,
        options.sampler,
        options.seed,
        options.hires_fix
      );
      this.threads = await this.generateThread(
        interaction,
        options.prompt,
        uuids
      );
    }
    return uuids;
  }

  async generateThread(
    interaction: ChatInputCommandInteraction,
    prompt: string,
    uuids: string[]
  ) {
    const channel = interaction.channel;
    if (
      !channel ||
      channel.isDMBased() ||
      channel.isThread() ||
      channel.isVoiceBased()
    )
      return [];
    const threadTasks: Promise<ThreadChannel>[] = [];
    for (const uuid of uuids)
      threadTasks.push(
        (async () => {
          const thread = await channel.threads.create({
            name: uuid,
          });
          await thread.send(`프롬프트: \`${prompt}\``);
          await thread.send(`큐에 추가되었습니다.`);
          return thread;
        })()
      );
    return await Promise.all(threadTasks);
  }
}
