import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import ms from 'ms';
import { HEIGHTS, WIDTHS } from '../../invokeai';
import SocketIOApiWrapper, {
  DefaultGenerationConfig,
  GenerationConfig,
} from '../../invokeai/wrapper';

export default class NovelController {
  private readonly wrapper = new SocketIOApiWrapper('http://plebea.com:9090/');
  private readonly api = this.wrapper.api;
  private options: Partial<GenerationConfig> = {};
  private isProcessing = false;

  constructor() {
    this.api.onProgressUpdate((progress) => {
      this.isProcessing = progress.isProcessing;
    });
    this.api.onProcessingCanceled(() => {
      this.isProcessing = false;
    });
  }

  public async invoke(interaction: ChatInputCommandInteraction) {
    if (this.isProcessing)
      return interaction.reply(
        '이미 생성 중입니다. 잠시 후 다시 시도해주세요.'
      );

    const prompt = new TextInputBuilder()
      .setCustomId('novel_modal_prompt')
      .setLabel('프롬프트')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const promptRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
      prompt
    );

    const id = Math.random().toString(36).substring(7);

    await interaction.showModal(
      new ModalBuilder()
        .setCustomId(`novel_modal_${id}`)
        .setTitle('Novel')
        .addComponents(promptRow)
    );

    const modal = await interaction
      .awaitModalSubmit({
        filter: (modal) =>
          modal.customId === `novel_modal_${id}` &&
          modal.user.id === interaction.user.id,
        time: ms('5m'),
      })
      .catch(() => void interaction.reply('시간이 초과되었습니다.'));

    if (!modal) return;

    const promptValue = modal.fields.getField('novel_modal_prompt');

    if (promptValue.type !== ComponentType.TextInput) return;

    await modal.deferReply();

    if (this.isProcessing)
      return modal.editReply('이미 생성 중입니다. 잠시 후 다시 시도해주세요.');

    await this.wrapper.generate({
      ...this.options,
      prompt: promptValue.value,
    });

    if (this.options.images && this.options.images > 1) {
      const images = [];
      for (let i = 0; i < this.options.images; i++) {
        await modal.editReply({
          content: `이미지 ${i + 1} / ${this.options.images} 생성 중...`,
          files: [...images].slice(0, 10),
        });
        const result = await this.api.onceGenerationResultAsync();
        images.push({
          name: `image${i}.png`,
          attachment: this.wrapper.getImage(result.url),
        });
      }
      await modal.editReply({
        content:
          images.length > 10 ? '이미지가 너무 많아 10개만 표시합니다.' : '',
        files: images.slice(0, 10),
      });
    } else {
      const result = await this.api.onceGenerationResultAsync();

      await modal.editReply({
        files: [
          {
            name: 'result.png',
            attachment: this.wrapper.getImage(result.url),
          },
        ],
      });
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
    let modal = null;

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

      const id = Math.random().toString(36).substring(7);

      await interaction.showModal(
        new ModalBuilder()
          .setCustomId(`novel_config_${id}`)
          .setTitle('Novel Config')
          .addComponents(widthRow, heightRow, stepsRow, cfgScaleRow, seedRow)
      );

      modal = await interaction
        .awaitModalSubmit({
          filter: (m) =>
            m.customId === `novel_config_${id}` &&
            m.user.id === interaction.user.id,
          time: ms('1m'),
        })
        .catch(() => void interaction.reply('시간이 초과되었습니다.'));
      if (!modal) return;

      const widthValue = Number(
        modal.fields.getTextInputValue('novel_modal_width')
      );
      const heightValue = Number(
        modal.fields.getTextInputValue('novel_modal_height')
      );
      const stepsValue = Number(
        modal.fields.getTextInputValue('novel_modal_steps')
      );
      const cfgScaleValue = Number(
        modal.fields.getTextInputValue('novel_modal_cfg_scale')
      );
      const seedValue = Number(
        modal.fields.getTextInputValue('novel_modal_seed')
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

    const embed = new EmbedBuilder().addFields(
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

    if (gui && modal) {
      await modal.reply({
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

  public async live(interaction: ChatInputCommandInteraction) {
    await interaction.reply('생성 중입니다...');

    this.api.onIntermediateResult((result) => {
      if (!interaction.isRepliable()) return;
      interaction.editReply({
        content: '',
        files: [
          {
            name: `intermediate.png`,
            attachment: result.isBase64
              ? Buffer.from(result.url.split(',')[1], 'base64')
              : this.wrapper.getImage(result.url),
          },
        ],
      });
    });
  }

  public async gallery(interaction: ChatInputCommandInteraction) {
    try {
      const mtime = interaction.options.getNumber('mtime', false);
      const count = interaction.options.getNumber('count', false) ?? 10;

      await interaction.deferReply({ ephemeral: true });

      const images = await this.wrapper.getImages('result', mtime ?? undefined);
      const embed = new EmbedBuilder()
        .setTitle('Gallery')
        .setDescription(`이미지를 클릭하면 원본 이미지를 볼 수 있습니다.`)
        .setFooter({
          text: `mtime ${images.images.slice(count - 1, count)[0].mtime}`,
        });

      const id = Math.random().toString(36).substring(7);
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
          files: images.images.slice(0, count).map((image) => ({
            name:
              image.metadata.image.prompt
                .splice(0, 5)
                .map((p) => p.prompt)
                .join(' ') + '.png',
            attachment: this.wrapper.getImage(image.url),
          })),
        })
        .catch(
          () =>
            void interaction.editReply(
              '이미지를 업로드하기에 크기가 너무 큽니다. 이미지 수를 줄여주세요.'
            )
        );

      message
        ?.createMessageComponentCollector({
          filter: (i) =>
            i.customId === `gallery_next_${id}` &&
            i.user.id === interaction.user.id,
          time: ms('10s'),
        })
        .on('collect', async (i) => {
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
              name:
                image.metadata.image.prompt
                  .splice(0, 5)
                  .map((p) => p.prompt)
                  .join(' ') + '.png',
              attachment: this.wrapper.getImage(image.url),
            })),
          });
        })
        .on('end', async (i) => {
          next.components[0].setDisabled(true);
          if (!interaction.isRepliable()) return;
          await interaction.editReply({
            components: [next],
          });
        });
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: '오류가 발생했습니다.',
      });
    }
  }
}
