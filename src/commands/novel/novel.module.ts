import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command, Module } from '../../decorator';
import { HEIGHTS, WIDTHS } from '../../invokeai';
import NovelController from './novel.controller';

@Module()
export default class NovelModule {
  private static readonly controller = new NovelController();

  @Command(
    new SlashCommandBuilder()
      .setName('novel')
      .setDescription('NovelAI를 이용해 그림을 생성하는 명령어입니다.')
      .addSubcommand((subcommand) =>
        subcommand.setName('invoke').setDescription('이미지를 생성합니다.')
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('config')
          .setDescription('옵션을 설정합니다.')
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
          .addBooleanOption((option) =>
            option
              .setName('highres')
              .setDescription(
                '저해상도에서 먼저 생성한 뒤 고해상도 이미지를 생성합니다.'
              )
              .setRequired(false)
          )
          .addBooleanOption((option) =>
            option
              .setName('gui')
              .setDescription('GUI를 사용합니다.')
              .setRequired(false)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('live')
          .setDescription('생성된 이미지를 실시간으로 보여줍니다.')
      )
      .toJSON()
  )
  async novel(interaction: ChatInputCommandInteraction) {
    try {
      switch (interaction.options.getSubcommand()) {
        case 'invoke':
          await NovelModule.controller.invoke(interaction);
          break;
        case 'config':
          await NovelModule.controller.config(interaction);
          break;
        case 'live':
          await NovelModule.controller.live(interaction);
          break;
      }
    } catch (err) {
      console.error(err);
      await interaction.reply({
        content: '오류가 발생했습니다.',
        ephemeral: true,
      });
    }
  }
}
