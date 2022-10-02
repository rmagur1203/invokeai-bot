import { SlashCommandBuilder } from 'discord.js';
import { Command, Interaction, Module } from '../decorator';

@Module()
export default class PingModule {
  @Command(
    new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Replies with Pong!')
      .toJSON()
  )
  ping(interaction: Interaction) {
    interaction.reply('Pong!');
  }
}
