import { Interaction, MessageFlags } from "discord.js";
import { commands } from "../handlers/commandHandler";
import { handleModalSubmit } from "../handlers/modalSubmit";
import logger from "../../utils/logger";
import { getIssueModal } from "../../utils/modal";
import { CUSTOM_IDS } from "../../utils/constants";

export const handleInteraction = async (interaction: Interaction) => {
  if (
    interaction.isChatInputCommand() ||
    interaction.isMessageContextMenuCommand()
  ) {
    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error("Failed to execute command", error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  } else if (
    interaction.isStringSelectMenu() &&
    interaction.customId === CUSTOM_IDS.ISSUE_SELECT_MENU
  ) {
    const selectedValue = interaction.values[0];
    const modal = getIssueModal({ type: selectedValue });
    await interaction.showModal(modal);
  } else if (
    interaction.isModalSubmit() &&
    interaction.customId.startsWith(CUSTOM_IDS.MODAL_PREFIX)
  ) {
    await handleModalSubmit(interaction);
  }
};
