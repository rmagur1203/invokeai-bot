import { ChatInputCommandInteraction } from 'discord.js';
import SocketIOApiWrapper, { GenerationConfig } from '../../invokeai/wrapper';
import novel from '../../config/novel.json';
import NovelService from './novel.service';

export default class NovelController {
  private readonly wrapper = new SocketIOApiWrapper('http://plebea.com:9090/');
  private readonly api = this.wrapper.api;

  private readonly service = new NovelService(this.wrapper);

  public get isProcessing() {
    return this.service.isProcessing;
  }

  public get progress() {
    return this.service.progress;
  }

  public get options() {
    return this.options;
  }

  public set options(options: Partial<GenerationConfig>) {
    this.options = options;
  }

  public async invoke(interaction: ChatInputCommandInteraction) {
    if (!this.api.socket.connected)
      return interaction.reply('서버에 연결할 수 없습니다.');
    if (this.isProcessing)
      return interaction.reply(
        '이미 생성 중입니다. 잠시 후 다시 시도해주세요.'
      );

    return this.service.invoke(interaction);
  }

  public async config(interaction: ChatInputCommandInteraction) {
    if (!this.api.socket.connected)
      return interaction.reply('서버에 연결할 수 없습니다.');
    this.service.config(interaction);
  }

  public async gallery(interaction: ChatInputCommandInteraction) {
    if (!this.api.socket.connected)
      return interaction.reply('서버에 연결할 수 없습니다.');
    this.service.gallery(interaction);
  }

  public async state(interaction: ChatInputCommandInteraction) {
    if (!this.api.socket.connected)
      return interaction.reply('서버에 연결할 수 없습니다.');

    const ephemeral =
      interaction.options.getBoolean('ephemeral', false) ?? false;

    const embed = this.service.stateEmbed();

    if (!embed) return interaction.reply('정보가 없습니다.');

    await interaction.reply({
      embeds: [embed],
      ephemeral,
    });
  }

  public async cancel(interaction: ChatInputCommandInteraction) {
    if (!this.api.socket.connected)
      return interaction.reply('서버에 연결할 수 없습니다.');

    if (!this.isProcessing) return interaction.reply('생성 중이 아닙니다.');
    this.service.cancel(interaction);
  }

  public async load(interaction: ChatInputCommandInteraction) {
    if (!this.api.socket.connected)
      return interaction.reply('서버에 연결할 수 없습니다.');

    const name = interaction.options.getString('name', true);

    if (!Object.keys(novel.predefined.config).includes(name))
      return await interaction.reply('존재하지 않는 설정입니다.');

    this.service.loadConfig(name);

    await interaction.reply({
      content: '옵션을 설정했습니다.',
      embeds: [this.service.configEmbed()],
      ephemeral: true,
    });
  }
}

export interface PredefinedConfig {
  images: number;
  steps: number;
  cfg_scale: number;
  width: number;
  height: number;
  seed?: number;
  hires_fix: boolean;
}
