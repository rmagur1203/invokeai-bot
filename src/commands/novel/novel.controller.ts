import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ComponentType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import ms from 'ms';
import { HEIGHTS, WIDTHS } from '../../invokeai';
import SocketIOApiWrapper, { GenerationConfig } from '../../invokeai/wrapper';

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

    await interaction.showModal(
      new ModalBuilder()
        .setCustomId('novel_modal')
        .setTitle('Novel')
        .addComponents(promptRow)
    );

    const modal = await interaction
      .awaitModalSubmit({
        filter: (modal) => modal.customId === 'novel_modal',
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
        const result = await this.api.onceGenerationResultAsync();
        images.push({
          name: `image${i}.png`,
          attachment: result.url,
        });
      }
      await modal.editReply({
        content: '',
        files: images,
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

    await interaction.reply({
      content: '옵션을 설정했습니다.',
      ephemeral: true,
    });
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
}
