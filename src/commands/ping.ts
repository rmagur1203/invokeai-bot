import { Command, Interaction, Module } from '../decorator';

@Module()
export default class PingModule {
  @Command({
    command: 'ping',
    description: 'Replies with Pong!',
  })
  ping(interaction: Interaction) {
    interaction.reply('Pong!');
  }
}
