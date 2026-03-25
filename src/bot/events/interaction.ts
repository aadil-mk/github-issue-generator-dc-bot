import { Interaction } from "discord.js";
import { commands } from "../handlers/commandHandler";
import { handleModalSubmit } from "../handlers/modalSubmit";
import { logger } from "../../utils/logger";
import { getIssueModal } from "../../utils/modal";

export const handleInteraction = async (interaction: Interaction) => {
    // Dynamically invoke slash and context menu commands
    if (interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand()) {
        const command = commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            logger.error("Failed to execute command", error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }

    // Handle persistent ticket select triggers
    } else if (interaction.isStringSelectMenu() && interaction.customId === "openIssueModal_select") {
        const selectedValue = interaction.values[0];
        const modal = getIssueModal({ type: selectedValue, descriptionInitialValue: "" });
        await interaction.showModal(modal);

    // Pass generic modal submissions cleanly
    } else if (interaction.isModalSubmit() && interaction.customId.startsWith("AwesomeForm")) {
        await handleModalSubmit(interaction);
    }
};
