import * as gRPC from '@grpc/grpc-js';
import { SlashCommandBuilder } from 'discord.js';
import { Command, Interaction, Module } from '../decorator';
import { HelloServiceClient } from '../grpc/hello.proto';

@Module()
export default class HelloModule {
  @Command(
    new SlashCommandBuilder()
      .setName('hello')
      .setDescription('Replies with Hello World!')
      .toJSON()
  )
  async ping(interaction: Interaction) {
    const client = new HelloServiceClient(
      'localhost:10001',
      gRPC.credentials.createInsecure()
    );
    client.getHello({}, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        interaction.reply(res.message);
      }
    });
  }
}
