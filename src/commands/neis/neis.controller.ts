import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SelectMenuBuilder,
} from 'discord.js';
import { NeisService } from './neis.service';
import { DateTime } from 'luxon';
import { Information } from '../../grpc/gen/neis.proto';

function schoolToEmbed(school: Information) {
  const embed = new EmbedBuilder()
    .setTitle(`${school.name}`)
    .setAuthor({
      name: school.nameEng,
    })
    .setURL(school.homepage)
    .setDescription(`${school.address} ${school.addressDetail}`)
    .addFields([
      {
        name: '관할 교육청',
        value: school.districtName,
      },
      {
        name: '관할 교육지원청',
        value: school.organization,
      },
      {
        name: '유형',
        value: [school.highschool, school.kind].join(' '),
        inline: true,
      },
      {
        name: '형태',
        value: school.foundation,
        inline: true,
      },
      {
        name: '성별',
        value: school.coeducation,
        inline: true,
      },
      {
        name: '주소',
        value: school.address,
      },
      {
        name: '상세 주소',
        value: school.addressDetail,
        inline: true,
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: true,
      },
      {
        name: '우편번호',
        value: school.postalCode,
        inline: true,
      },
      {
        name: '설립 연도',
        value: DateTime.fromFormat(
          school.foundationDate,
          'yyyyMMdd'
        ).toLocaleString(DateTime.DATE_FULL, {
          locale: 'ko-KR',
        }),
        inline: true,
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: true,
      },
      {
        name: '개교기념일',
        value: DateTime.fromFormat(
          school.foundationMemorial,
          'yyyyMMdd'
        ).toLocaleString(
          {
            month: 'long',
            day: 'numeric',
          },
          {
            locale: 'ko-KR',
          }
        ),
        inline: true,
      },
      {
        name: '교육청 코드',
        value: school.districtCode,
        inline: true,
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: true,
      },
      {
        name: '학교 코드',
        value: school.code,
        inline: true,
      },
    ])
    .setTimestamp(
      DateTime.fromFormat(school.modifiedDate, 'yyyyMMdd').toJSDate()
    );
  return embed;
}

export default class NeisController {
  private readonly neisService = new NeisService();

  async schoolInfo(interaction: ChatInputCommandInteraction): Promise<void> {
    const name = interaction.options.getString('name')!;
    const res = await this.neisService.getSchoolList(name);

    const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
      new SelectMenuBuilder()
        .setCustomId('select_school')
        .setPlaceholder('Nothing selected')
        .addOptions(
          res.schools.map((school, index) => ({
            label: school.name,
            description: school.location,
            value: index.toString(),
          }))
        )
    );

    const message = await (
      await interaction.reply({
        components: [row],
        ephemeral: true,
      })
    ).awaitMessageComponent();
    if (!message.isSelectMenu() || message.customId !== 'select_school') return;

    const school = res.schools[Number(message.values[0])];

    interaction.editReply({
      embeds: [schoolToEmbed(school)],
      components: [],
    });
  }
}
