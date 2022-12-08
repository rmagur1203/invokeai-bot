import axios from 'axios';
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js';
import { Command, Module } from '../../decorator';
import { WIDTHS, HEIGHTS, GenerationConfig } from '../../invokeai';
import V2Controller from './v2.controller';
import { Server } from './v2.interfaces';

@Module()
export default class V2Module {
  private static controller: V2Controller;

  constructor() {
    if (!V2Module.controller) {
      V2Module.controller = new V2Controller();
    }
  }

  @Command(
    new SlashCommandBuilder()
      .setName('servers')
      .setDescription('서버 목록을 가져옵니다.')
      .toJSON()
  )
  async getServers(interaction: ChatInputCommandInteraction) {
    const data = (await axios.get('http://plebea.com:2200/')).data as Server[];

    const embed = new EmbedBuilder()
      .setTitle('서버 목록')
      .addFields(
        data.map((server) => ({ name: server.name, value: server.status }))
      );

    interaction.reply({ embeds: [embed] });
  }

  @Command(
    new SlashCommandBuilder()
      .setName('queue')
      .setDescription('대기열을 확인합니다.')
      .addSubcommand((subcommand) =>
        subcommand.setName('list').setDescription('대기열을 확인합니다.')
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('count')
          .setDescription('대기열의 길이를 확인합니다.')
      )
      .toJSON()
  )
  async getQueue(interaction: ChatInputCommandInteraction) {
    const data = (await axios.get('http://plebea.com:2200/queue')).data as [
      string,
      GenerationConfig
    ][];

    switch (interaction.options.getSubcommand()) {
      case 'list':
        const content =
          '```\n' +
          data
            .map(([server, config], index) => `${index}. ${server}`)
            .join('\n') +
          '\n```';

        interaction.reply(content);
        break;
      case 'count':
        interaction.reply(`대기열의 길이는 ${data.length}입니다.`);
        break;
    }
  }

  @Command(
    new SlashCommandBuilder()
      .setName('generate')
      .setDescription('이미지를 생성합니다.')
      .addNumberOption((option) =>
        option
          .setName('images')
          .setDescription('생성할 이미지의 개수입니다.')
          .setRequired(false)
      )
      .addNumberOption((option) =>
        option
          .setName('steps')
          .setDescription('노이즈 제거를 몇번 수행할 지 설정합니다.')
          .setRequired(false)
      )
      .addNumberOption((option) =>
        option
          .setName('width')
          .setDescription('이미지의 가로 크기입니다.')
          .setChoices(
            ...WIDTHS.map((width) => ({
              name: width.toString(),
              value: width,
            })).slice(0, 25)
          )
          .setRequired(false)
      )
      .addNumberOption((option) =>
        option
          .setName('height')
          .setDescription('이미지의 세로 크기입니다.')
          .setChoices(
            ...HEIGHTS.map((width) => ({
              name: width.toString(),
              value: width,
            })).slice(0, 25)
          )
          .setRequired(false)
      )
      .addNumberOption((option) =>
        option
          .setName('cfg_scale')
          .setDescription('CFG 크기입니다.')
          .setRequired(false)
      )
      .addNumberOption((option) =>
        option
          .setName('seed')
          .setDescription('시드를 설정합니다. (0은 랜덤)')
          .setRequired(false)
      )
      .toJSON()
  )
  async generate(interaction: ChatInputCommandInteraction) {
    this.controller.generate(interaction);
  }
}
