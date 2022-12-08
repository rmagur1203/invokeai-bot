import {
  ActionRowBuilder,
  CommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import ms from 'ms';

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
