import * as gRPC from '@grpc/grpc-js';
import { SlashCommandBuilder } from 'discord.js';
import { Command, Interaction, Module } from '../decorator';
import {
  GetSchoolListRequest,
  InformationServiceClient,
} from '../grpc/gen/neis.proto';

@Module()
export default class NeisModule {
  @Command(
    new SlashCommandBuilder()
      .setName('school')
      .addSubcommand((subcommand) =>
        subcommand
          .setName('info')
          .setDescription('학교 정보를 가져옵니다.')
          .addStringOption((option) =>
            option.setName('name').setDescription('학교 이름').setRequired(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('meal')
          .setDescription('학교 급식 정보를 가져옵니다.')
          .addStringOption((option) =>
            option.setName('name').setDescription('학교 이름').setRequired(true)
          )
      )
      .toJSON()
  )
  async ping(interaction: Interaction) {
    const client = new InformationServiceClient(
      'localhost:10001',
      gRPC.credentials.createInsecure()
    );
    client.getSchoolList(
      GetSchoolListRequest.fromPartial({
        name: '선린',
      }),
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
      }
    );
  }
}
