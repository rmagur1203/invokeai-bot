import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  ModalBuilder,
  ModalSubmitInteraction,
  TextBasedChannel,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import EventEmitter from 'events';
import ms from 'ms';
import { Inject } from '../../decorator';
import {
  GenerationConfig,
  GenerationResult,
  HEIGHTS,
  IntermediateResult,
  ProgressUpdate,
  WIDTHS,
} from '../../invokeai';
import SocketIOApiWrapper, {
  DefaultGenerationConfig,
} from '../../invokeai/wrapper';
import { PredefinedConfig } from './novel.controller';

import novel from '../../config/novel.json';
import { MemoryCache } from 'cache-manager';

export default class NovelService extends EventEmitter {
  private readonly api = this.wrapper.api;
  public options: Partial<GenerationConfig> = {};
  public isProcessing = false;
  public progress?: ProgressUpdate;
  public intermediate?: IntermediateResult;

  @Inject('CACHE_MANAGER')
  public readonly $store!: MemoryCache;

  @Inject('DISCORD_CLIENT')
  private readonly $client!: Client;

  constructor(private readonly wrapper: SocketIOApiWrapper) {
    super();
    this.api.onConnect(() => {
      this.isProcessing = false;
    });
    this.api.onProgressUpdate((progress) => {
      if (this.progress?.currentStatus !== progress.currentStatus) {
        this.$client.user?.setActivity(
          `${progress.currentStatus} ${progress.currentIteration}/${progress.totalIterations}`
        );
      }
      this.progress = progress;
      this.isProcessing = progress.isProcessing;
    });
    this.api.onIntermediateResult((result) => {
      this.intermediate = result;
    });
    this.api.socket.on('error', (error) => {
      console.log('error: ', error);
    });
    this.api.onProcessingCanceled(() => {
      this.isProcessing = false;
    });
  }

  private progressUpdate(progress: ProgressUpdate) {
    this.progress = progress;
    this.isProcessing = progress.isProcessing;
  }

  private progressCanceled() {
    this.isProcessing = false;
    this.emit('canceled');
  }

  public configEmbed() {
    return new EmbedBuilder().addFields(
      {
        name: 'Images',
        value: (
          this.options.images ?? DefaultGenerationConfig.images
        ).toString(),
        inline: true,
      },
      {
        name: 'Steps',
        value: (this.options.steps ?? DefaultGenerationConfig.steps).toString(),
        inline: true,
      },
      {
        name: 'CFG Scale',
        value: (
          this.options.cfg_scale ?? DefaultGenerationConfig.cfg_scale
        ).toString(),
        inline: true,
      },
      {
        name: 'Width',
        value: (this.options.width ?? DefaultGenerationConfig.width).toString(),
        inline: true,
      },
      {
        name: 'Height',
        value: (
          this.options.height ?? DefaultGenerationConfig.height
        ).toString(),
        inline: true,
      },
      {
        name: 'Sampler',
        value: this.options.sampler ?? DefaultGenerationConfig.sampler,
        inline: true,
      },
      {
        name: 'Seed',
        value: (this.options.seed || 'auto').toString(),
      },
      {
        name: 'High Res Optimization',
        value: (
          this.options.hires_fix ?? DefaultGenerationConfig.hires_fix
        ).toString(),
      }
    );
  }

  public stateEmbed() {
    if (!this.progress) return null;
    return new EmbedBuilder().addFields(
      Object.entries(this.progress).map(([key, value]) => ({
        name: key,
        value: value.toString(),
        inline: true,
      }))
    );
  }

  private randomString() {
    return Math.random().toString(36).slice(2);
  }

  private async showModal(
    interaction: CommandInteraction,
    modal: ModalBuilder,
    options: { timeout: number } = { timeout: ms('5m') }
  ) {
    await interaction.showModal(modal);
    return interaction
      .awaitModalSubmit({
        filter: (i) =>
          i.customId === modal.data.custom_id &&
          i.user.id === interaction.user.id,
        time: options.timeout,
      })
      .catch(() => void interaction.reply('시간이 초과되었습니다.'));
  }

  public generationResultEmbed(result: GenerationResult) {
    return new EmbedBuilder()
      .setTitle('Novel')
      .setDescription(result.metadata.image.prompt[0].prompt)
      .setFields(
        {
          name: 'App ID',
          value: result.metadata.app_id,
          inline: true,
        },
        {
          name: 'App Version',
          value: result.metadata.app_version,
          inline: true,
        },
        {
          name: '\u200b',
          value: '\u200b',
          inline: true,
        },
        {
          name: 'Model',
          value: result.metadata.model,
          inline: true,
        },
        {
          name: 'Model Hash',
          value: result.metadata.model_hash,
          inline: true,
        },
        {
          name: 'Model Weight',
          value: result.metadata.model_weights,
          inline: true,
        },
        {
          name: 'Seed',
          value: result.metadata.image.seed.toString(),
          inline: true,
        },
        {
          name: 'Steps',
          value: result.metadata.image.steps.toString(),
          inline: true,
        },
        {
          name: 'CFG Scale',
          value: result.metadata.image.cfg_scale.toString(),
          inline: true,
        },
        {
          name: 'Width',
          value: result.metadata.image.width.toString(),
          inline: true,
        },
        {
          name: 'Height',
          value: result.metadata.image.height.toString(),
          inline: true,
        },
        {
          name: 'Sampler',
          value: result.metadata.image.sampler,
          inline: true,
        },
        {
          name: 'High Res Optimization',
          value: result.metadata.image.hires_fix.toString(),
          inline: true,
        },
        {
          name: 'Type',
          value: result.metadata.image.type,
          inline: true,
        },
        {
          name: 'mtime',
          value: result.mtime.toString(),
          inline: true,
        }
      )
      .setURL(this.wrapper.getImage(result.url));
  }

  public generatePromptModal() {
    const prompt = new TextInputBuilder()
      .setCustomId('novel_modal_prompt')
      .setLabel('프롬프트')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const promptRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
      prompt
    );
    const id = Math.random().toString(36).substring(7);

    return new ModalBuilder()
      .setCustomId(`novel_modal_${id}`)
      .setTitle('Novel')
      .addComponents(promptRow);
  }

  public async sendImageAsFollowUp(
    interaction: CommandInteraction | ModalSubmitInteraction,
    useEmbed: boolean = false,
    spoiler: boolean = false
  ) {
    const image = await this.api.onceGenerationResultAsync();
    const embed = this.generationResultEmbed(image);
    const message = await interaction.followUp({
      embeds: useEmbed ? [embed] : [],
      files: [
        {
          name: spoiler ? 'SPOILER_novel.png' : 'novel.png',
          attachment: this.wrapper.getImage(image.url),
        },
      ],
    });
    return { image, message };
  }

  public async loadConfig(name: string) {
    const config = (novel.predefined.config as any)[name] as PredefinedConfig;
    this.options = { ...this.options, ...config } as any;
  }

  public async invoke(interaction: ChatInputCommandInteraction) {
    const spoiler = interaction.options.getBoolean('spoiler', false) ?? false;
    const save = interaction.options.getBoolean('save', false) ?? true;

    const promptModal = this.generatePromptModal();
    const modalSubmit = await this.showModal(interaction, promptModal);
    if (!modalSubmit) return;
    const prompt = modalSubmit.fields.getField(
      promptModal.components[0].components[0].data.custom_id!
    );
    if (prompt.type !== ComponentType.TextInput) return;
    await modalSubmit.deferReply();
    if (this.isProcessing)
      return modalSubmit.editReply(
        '이미 생성 중입니다. 잠시 후 다시 시도해주세요.'
      );
    await this.wrapper.generate({
      ...this.options,
      prompt: prompt.value,
    });
    for (let i = 0; i < (this.options.images ?? 1); i++) {
      const { image } = await this.sendImageAsFollowUp(
        modalSubmit,
        true,
        spoiler
      );
      if (!save)
        setTimeout(
          () =>
            this.api
              .deleteImage(image.url, image.thumbnail, 'result')
              .then(console.log),
          ms('1m')
        );
    }
  }

  public async config(interaction: ChatInputCommandInteraction) {
    const width = interaction.options.getNumber('width');
    const height = interaction.options.getNumber('height');
    const steps = interaction.options.getNumber('steps');
    const images = interaction.options.getNumber('images');
    const cfgScale = interaction.options.getNumber('cfg_scale');
    const seed = interaction.options.getNumber('seed');
    const highres = interaction.options.getBoolean('highres');
    const gui = interaction.options.getBoolean('gui');
    let modalSubmit = null;

    if (gui) {
      const width = new TextInputBuilder()
        .setCustomId('novel_modal_width')
        .setLabel('너비')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setPlaceholder('기본값: 512');
      const widthRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
        width
      );

      const height = new TextInputBuilder()
        .setCustomId('novel_modal_height')
        .setLabel('높이')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setPlaceholder('기본값: 512');
      const heightRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
        height
      );

      const steps = new TextInputBuilder()
        .setCustomId('novel_modal_steps')
        .setLabel('스텝')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setPlaceholder('기본값: 50');
      const stepsRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
        steps
      );

      const cfgScale = new TextInputBuilder()
        .setCustomId('novel_modal_cfg_scale')
        .setLabel('cfg_scale')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setPlaceholder('기본값: 7.5');
      const cfgScaleRow =
        new ActionRowBuilder<TextInputBuilder>().addComponents(cfgScale);

      const seed = new TextInputBuilder()
        .setCustomId('novel_modal_seed')
        .setLabel('시드')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)
        .setPlaceholder('기본값: 랜덤');
      const seedRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
        seed
      );

      const id = this.randomString();

      const modal = new ModalBuilder()
        .setCustomId(`novel_config_${id}`)
        .setTitle('Novel Config')
        .addComponents(widthRow, heightRow, stepsRow, cfgScaleRow, seedRow);

      modalSubmit = await this.showModal(interaction, modal, {
        timeout: ms('10m'),
      });
      if (!modalSubmit) return;

      const widthValue = Number(
        modalSubmit.fields.getTextInputValue('novel_modal_width')
      );
      const heightValue = Number(
        modalSubmit.fields.getTextInputValue('novel_modal_height')
      );
      const stepsValue = Number(
        modalSubmit.fields.getTextInputValue('novel_modal_steps')
      );
      const cfgScaleValue = Number(
        modalSubmit.fields.getTextInputValue('novel_modal_cfg_scale')
      );
      const seedValue = Number(
        modalSubmit.fields.getTextInputValue('novel_modal_seed')
      );

      if (widthValue && WIDTHS.includes(widthValue as any))
        this.options.width = widthValue as any;
      if (heightValue && HEIGHTS.includes(heightValue as any))
        this.options.height = heightValue as any;
      if (stepsValue) this.options.steps = stepsValue;
      if (cfgScaleValue) this.options.cfg_scale = cfgScaleValue;
      if (seedValue) this.options.seed = seedValue;
    } else {
      if (width && WIDTHS.includes(width as any))
        this.options.width = width as any;
      if (height && HEIGHTS.includes(height as any))
        this.options.height = height as any;
      if (steps) this.options.steps = steps;
      if (images) this.options.images = images;
      if (cfgScale) this.options.cfg_scale = cfgScale;
      if (seed) {
        if (seed == 0) this.options.seed = undefined;
        else this.options.seed = seed;
      }
      if (highres) this.options.hires_fix = highres;
    }

    const embed = this.configEmbed();

    if (modalSubmit) {
      await modalSubmit.reply({
        content: '옵션을 설정했습니다.',
        embeds: [embed],
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: '옵션을 설정했습니다.',
        embeds: [embed],
        ephemeral: true,
      });
    }
  }

  public async gallery(interaction: ChatInputCommandInteraction) {
    const mtime = interaction.options.getNumber('mtime', false);
    const count = interaction.options.getNumber('count', false) ?? 10;

    await interaction.deferReply();

    const images = await this.wrapper.getImages('result', mtime ?? undefined);
    const files = images.images.slice(0, count).map((image) => ({
      name: image.metadata.image.seed + 'image.png',
      attachment: this.wrapper.getImage(image.url),
    }));
    const embed = new EmbedBuilder()
      .setTitle('Gallery')
      .setDescription(`이미지를 클릭하면 원본 이미지를 볼 수 있습니다.`)
      .setFooter({
        text: `mtime ${images.images.slice(count - 1, count)[0].mtime}`,
      });
    const id = this.randomString();
    const next = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`gallery_next_${id}`)
        .setLabel('다음')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('➡️')
    );

    const message = await interaction
      .editReply({
        embeds: [embed],
        components: [next],
        files,
      })
      .catch(
        () =>
          void interaction.editReply(
            '이미지를 업로드하기에 크기가 너무 큽니다. 이미지 수를 줄여주세요.'
          )
      );
    if (!message) return;

    const collector = message.createMessageComponentCollector({
      filter: (i) =>
        i.customId === `gallery_next_${id}` &&
        i.user.id === interaction.user.id,
      time: ms('1h'),
    });

    collector.on('collect', async (i) => {
      await i.deferUpdate();
      const images = await this.wrapper.getImages(
        'result',
        Number(i.message.embeds[0].footer?.text?.split(' ')[1]) || undefined
      );
      embed.setFooter({
        text: `mtime ${images.images.slice(count - 1, count)[0].mtime}`,
      });
      if (!interaction.isRepliable()) return;
      await interaction.editReply({
        embeds: [embed],
        files: images.images.slice(0, count).map((image) => ({
          name: image.metadata.image.seed + 'image.png',
          attachment: this.wrapper.getImage(image.url),
        })),
      });
    });

    collector.on('end', async (i) => {
      next.components[0].setDisabled(true);
      if (!interaction.isRepliable()) return;
      await interaction.editReply({
        components: [next],
      });
    });
  }

  public async cancel(interaction: CommandInteraction) {
    this.api.cancel();
    await interaction.reply('생성을 취소했습니다.');
  }

  public async registDebugChannel(channel: TextBasedChannel) {
    this.api.onConnect(() => {
      channel.send('서버에 연결되었습니다.');
    });

    this.api.onGenerationResult((result) => {
      const embed = this.generationResultEmbed(result);
      channel.send({
        embeds: [embed],
        files: [
          {
            name: 'novel.png',
            attachment: this.wrapper.getImage(result.url),
          },
        ],
      });
    });

    this.api.onModelChanged((model) => {
      const embed = new EmbedBuilder()
        .setTitle('모델 변경됨')
        .setDescription(model.model_name)
        .addFields(
          Object.entries(model.model_list).map(([key, value]) => ({
            name: key,
            value: value.description,
          }))
        );
      channel.send({ embeds: [embed] });
    });

    this.api.onProcessingCanceled(() => {
      channel.send('생성이 취소되었습니다.');
    });

    this.api.onDisconnect(() => {
      channel.send('서버와 연결이 끊겼습니다.');
    });
  }
}
