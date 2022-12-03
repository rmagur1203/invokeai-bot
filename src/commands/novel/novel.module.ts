import {
  ChannelType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from 'discord.js';
import { Command, Module } from '../../decorator';
import { HEIGHTS, WIDTHS } from '../../invokeai';
import NovelController from './novel.controller';

@Module()
export default class NovelModule {
  private static controller: NovelController;

  constructor() {
    if (!NovelModule.controller) {
      NovelModule.controller = new NovelController();
    }
  }

  @Command(
    new SlashCommandBuilder()
      .setName('novel')
      .setDescription('NovelAI를 이용해 그림을 생성하는 명령어입니다.')
      .addSubcommand((subcommand) =>
        subcommand
          .setName('invoke')
          .setDescription('이미지를 생성합니다.')
          .addBooleanOption((option) =>
            option
              .setName('spoiler')
              .setDescription('이미지를 스포일러로 전송합니다.')
              .setRequired(false)
          )
          .addBooleanOption((option) =>
            option
              .setName('save')
              .setDescription('이미지를 서버에 저장합니다. (기본값: true)')
              .setRequired(false)
          )
          .addBooleanOption((option) =>
            option
              .setName('embed')
              .setDescription('이미지의 자세한 정보를 표시합니다.')
              .setRequired(false)
          )
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
          .setName('gallery')
          .setDescription('이미지 갤러리를 보여줍니다.')
          .addNumberOption((option) =>
            option
              .setName('mtime')
              .setDescription('다음 이미지를 가져 올 기준 시간입니다.')
              .setRequired(false)
          )
          .addNumberOption((option) =>
            option
              .setName('count')
              .setDescription('이미지의 개수입니다.')
              .setRequired(false)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('state')
          .setDescription('상태를 확인합니다.')
          .addBooleanOption((option) =>
            option
              .setName('ephemeral')
              .setDescription('응답을 숨깁니다. (기본값: true)')
              .setRequired(false)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand.setName('cancel').setDescription('생성을 중지합니다.')
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('load')
          .setDescription('미리 정의된 설정을 불러옵니다.')
          .addStringOption((option) =>
            option
              .setName('name')
              .setDescription('설정 이름입니다.')
              .setChoices(
                {
                  name: 'default',
                  value: 'default',
                },
                {
                  name: 'highres',
                  value: 'highres',
                },
                {
                  name: 'wallpaper_medium',
                  value: 'wallpaper_medium',
                },
                {
                  name: 'wallpaper_large',
                  value: 'wallpaper_large',
                }
              )
              .setRequired(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('debug')
          .setDescription('디버깅용 채널을 설정합니다.')
          .addChannelOption((option) =>
            option
              .setName('channel')
              .setDescription('디버깅용 채널입니다.')
              .addChannelTypes(ChannelType.GuildText)
              .setRequired(true)
          )
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
        case 'gallery':
          await NovelModule.controller.gallery(interaction);
          break;
        case 'state':
          await NovelModule.controller.state(interaction);
          break;
        case 'cancel':
          await NovelModule.controller.cancel(interaction);
          break;
        case 'load':
          await NovelModule.controller.load(interaction);
          break;
        case 'debug':
          await NovelModule.controller.debug(interaction);
          break;
      }
    } catch (err) {
      console.log('error', err);
      if (!interaction.replied) {
        await interaction.reply({
          content: '오류가 발생했습니다.',
          ephemeral: true,
        });
      } else {
        await interaction.followUp({
          content: '오류가 발생했습니다.',
          ephemeral: true,
        });
      }
    }
  }
}
