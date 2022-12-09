import {
  ActionRowBuilder,
  CommandInteraction,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import ms from 'ms';
import { Stream } from 'stream';
import { GenerationResult } from '../../invokeai';

export function streamToString(stream: Stream) {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

export function generationResultEmbed(result: GenerationResult) {
  return new EmbedBuilder()
    .setTitle('Novel')
    .setDescription(result.metadata.image.prompt[0].prompt)
    .setFields(
      {
        name: 'App ID',
        value: result.metadata.app_id,
        inline: true,
      },
      {
        name: 'App Version',
        value: result.metadata.app_version,
        inline: true,
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: true,
      },
      {
        name: 'Model',
        value: result.metadata.model,
        inline: true,
      },
      {
        name: 'Model Hash',
        value: result.metadata.model_hash,
        inline: true,
      },
      {
        name: 'Model Weight',
        value: result.metadata.model_weights,
        inline: true,
      },
      {
        name: 'Seed',
        value: result.metadata.image.seed.toString(),
        inline: true,
      },
      {
        name: 'Steps',
        value: result.metadata.image.steps.toString(),
        inline: true,
      },
      {
        name: 'CFG Scale',
        value: result.metadata.image.cfg_scale.toString(),
        inline: true,
      },
      {
        name: 'Width',
        value: result.metadata.image.width.toString(),
        inline: true,
      },
      {
        name: 'Height',
        value: result.metadata.image.height.toString(),
        inline: true,
      },
      {
        name: 'Sampler',
        value: result.metadata.image.sampler,
        inline: true,
      },
      {
        name: 'High Res Optimization',
        value: result.metadata.image.hires_fix.toString(),
        inline: true,
      },
      {
        name: 'Type',
        value: result.metadata.image.type,
        inline: true,
      },
      {
        name: 'mtime',
        value: result.mtime.toString(),
        inline: true,
      }
    )
    .setURL(result.url);
}

export function generatePromptModal() {
  const prompt = new TextInputBuilder()
    .setCustomId('novel_modal_prompt')
    .setLabel('프롬프트')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const promptRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
    prompt
  );
  const id = Math.random().toString(36).substring(7);

  return new ModalBuilder()
    .setCustomId(`novel_modal_${id}`)
    .setTitle('Novel')
    .addComponents(promptRow);
}

export async function showModal(
  interaction: CommandInteraction,
  modal: ModalBuilder,
  options: { timeout: number } = { timeout: ms('5m') }
) {
  await interaction.showModal(modal);
  return interaction
    .awaitModalSubmit({
      filter: (i) =>
        i.customId === modal.data.custom_id &&
        i.user.id === interaction.user.id,
      time: options.timeout,
    })
    .catch(() => void interaction.reply('시간이 초과되었습니다.'));
}
