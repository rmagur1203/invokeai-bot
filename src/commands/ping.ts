import { MemoryCache } from 'cache-manager';
import { SlashCommandBuilder } from 'discord.js';
import { Command, Inject, Interaction, Module } from '../decorator';

@Module()
export default class PingModule {
  @Inject('CACHE_MANAGER') public readonly $store!: MemoryCache;

  @Command(
    new SlashCommandBuilder()
      .setName('ping')
      .setDescription('Replies with Pong!')
      .toJSON()
  )
  async ping(interaction: Interaction) {
    interaction.reply(`Pong! ${(await this.$store.get('ping')) || 'no cache'}`);
    await this.$store.set('ping', new Date().getTime());
  }
}
