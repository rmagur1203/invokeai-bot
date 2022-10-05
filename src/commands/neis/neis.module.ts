import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command, Module } from '../../decorator';
import NeisController from './neis.controller';

@Module()
export default class NeisModule {
  private readonly controller = new NeisController();

  @Command(
    new SlashCommandBuilder()
      .setName('school')
      .setDescription('commands for school')
      .addSubcommand((subcommand) =>
        subcommand
          .setName('info')
          .setDescription('Get school info')
          .setDescriptionLocalization('ko', '학교 정보를 가져옵니다.')
          .addStringOption((option) =>
            option
              .setName('name')
              .setDescription('School name')
              .setDescriptionLocalization('ko', '학교 이름')
              .setRequired(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('meal')
          .setDescription('Get school meal information.')
          .setDescriptionLocalization('ko', '학교 급식 정보를 가져옵니다.')
          .addStringOption((option) =>
            option
              .setName('name')
              .setDescription('School name')
              .setDescriptionLocalization('ko', '학교 이름')
              .setRequired(true)
          )
      )
      .toJSON()
  )
  async school(interaction: ChatInputCommandInteraction) {
    switch (interaction.options.getSubcommand()) {
      case 'info':
        await this.controller.schoolInfo(interaction);
        break;
      case 'meal':
        // await this.controller.schoolMeal(interaction);
        break;
    }
  }
}
