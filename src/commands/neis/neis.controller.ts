import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  SelectMenuBuilder,
} from 'discord.js';
import NeisService from './neis.service';
import { DateTime } from 'luxon';
import { Information, Lunch } from '../../grpc/gen/neis.proto';
import { Inject } from '../../decorator';
import { MemoryCache } from 'cache-manager';
import ms from 'ms';

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
      DateTime.fromFormat(school.modifiedDate, 'yyyyMMdd', {
        zone: 'Asia/Seoul',
      }).toJSDate()
    );
  return embed;
}

function lunchToEmbed(lunch: Lunch) {
  const date = DateTime.fromFormat(lunch.date, 'yyyy-MM-dd').toLocaleString(
    {
      month: 'long',
      day: 'numeric',
    },
    {
      locale: 'ko-KR',
    }
  );

  return new EmbedBuilder()
    .setTitle(`${lunch.schoolName} 급식`)
    .setTimestamp(
      DateTime.fromFormat(lunch.date, 'yyyy-MM-dd', {
        zone: 'Asia/Seoul',
      }).toJSDate()
    )
    .addFields(
      {
        name: `${date} ${lunch.mealName}`,
        value: lunch.dishName.replace(/<br\/>/g, '\n'),
        inline: true,
      },
      {
        name: '영양 정보',
        value: lunch.nutritionInfo.replace(/<br\/>/g, '\n'),
        inline: true,
      }
    )
    .setFooter({
      text: lunch.calorieInfo,
    });
}

export default class NeisController {
  private readonly neisService = new NeisService();
  @Inject('CACHE_MANAGER') private readonly $store!: MemoryCache;

  async schoolInfo(interaction: ChatInputCommandInteraction): Promise<void> {
    const name = interaction.options.getString('name')!;
    const res = await this.neisService.getSchoolList(name);

    const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
      new SelectMenuBuilder()
        .setCustomId('select_school')
        .setPlaceholder('선택해주세요.')
        .addOptions(
          res.schools.map((school, index) => ({
            label: school.name,
            description: school.location,
            value: index.toString(),
          }))
        )
    );

    let message = await (
      await interaction.reply({
        components: [row],
        ephemeral: true,
      })
    ).awaitMessageComponent();

    if (!message.isSelectMenu() || message.customId !== 'select_school') return;

    await message.deferUpdate();

    const school = res.schools[Number(message.values[0])];

    const saveButton = new ButtonBuilder()
      .setCustomId('save_school')
      .setLabel('학교 정보 저장')
      .setStyle(ButtonStyle.Primary);

    message = await (
      await interaction.editReply({
        embeds: [schoolToEmbed(school)],
        components: [
          new ActionRowBuilder<ButtonBuilder>().addComponents(saveButton),
        ],
      })
    ).awaitMessageComponent();

    if (!message.isButton() || message.customId !== 'save_school') return;

    const id = interaction.user.id;
    this.$store.set(
      `${id}:school`,
      {
        districtCode: school.districtCode,
        code: school.code,
      },
      ms('1y')
    );

    message.reply({
      content: '학교 정보가 저장되었습니다.',
      ephemeral: true,
    });
  }

  async schoolMeal(interaction: ChatInputCommandInteraction): Promise<void> {
    const id = interaction.user.id;
    const school = await this.$store.get<{
      districtCode: string;
      code: string;
    }>(`${id}:school`);

    if (!school) {
      await interaction.reply({
        content: '학교 정보가 없습니다. 먼저 학교 정보를 저장해주세요.',
        ephemeral: true,
      });
      return;
    }

    const res = await this.neisService.getSchoolMeal(
      school.districtCode,
      school.code
    );
    const lunch = res.lunch!;

    await interaction.reply({
      embeds: [lunchToEmbed(lunch)],
    });
  }
}
