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

      const threadTasks: Promise<ThreadChannel>[] = [];
      let uuids: string[] = [];

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

        const channel = interaction.channel;
        if (
          !channel ||
          channel.isDMBased() ||
          channel.isThread() ||
          channel.isVoiceBased()
        )
          return;
        for (const uuid of generated)
          threadTasks.push(
            (async () => {
              const thread = await channel.threads.create({
                name: uuid,
              });
              thread.send(`Prompt: \`${prompt}\``);
              return thread;
            })()
          );

        if (i % 100) await this.service.updateRandomPrompt();

        uuids = uuids.concat(generated);
        this.threads = this.threads.concat(await Promise.all(threadTasks));
      }

      uuids = Array.from(new Set(uuids));

      const content =
        '```md\n' + uuids.map((x, i) => `${i}. ${x}`).join('\n') + '\n```';

      if (content.length > 2000)
        return interaction.editReply(content.slice(0, 2000 - 3) + '...');
      else await interaction.editReply(content);
    } else {
      const promptModal = generatePromptModal();
      const modalSubmit = await showModal(interaction, promptModal);
      if (!modalSubmit) return;
      const prompt = modalSubmit.fields.getField(
        promptModal.components[0].components[0].data.custom_id!
      );
      if (prompt.type !== ComponentType.TextInput) return;

      const uuids = await this.service.generate(
        prompt.value,
        options.images,
        options.steps,
        options.width,
        options.height,
        options.cfg_scale,
        options.sampler,
        options.seed,
        options.hires_fix
      );

      const channel = interaction.channel;
      if (
        !channel ||
        channel.isDMBased() ||
        channel.isThread() ||
        channel.isVoiceBased()
      )
        return;
      for (const uuid of uuids) {
        const thread = await channel.threads.create({
          name: uuid,
        });
        thread.send(`Prompt: \`${prompt.value}\``);
        this.threads.push(thread);
      }

      const content =
        '```md\n' + uuids.map((x, i) => `${i}. ${x}`).join('\n') + '\n```';

      await modalSubmit.reply(content);
    }
  }
}
