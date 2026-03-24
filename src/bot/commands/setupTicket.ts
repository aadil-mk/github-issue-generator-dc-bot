import { ApplicationCommandType, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from "discord.js";
import { COLOR } from "../../utils/colors";

export default {
    data: {
        name: "setup-ticket",
        description: "Creates an interactive button panel to generate new GitHub issues.",
        type: ApplicationCommandType.ChatInput,
    },
    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        const embed = new EmbedBuilder()
            .setTitle("🎫 Generate GitHub Issue")
            .setDescription("Click the button below to fill out a ticket and automatically submit a new issue to our GitHub repository!")
            .setColor(COLOR.BLUE);

        const button = new ButtonBuilder()
            .setCustomId("openIssueModal_btn")
            .setLabel("Create Issue")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🐙");

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        // Instantly reply to the slash command with the persistent button panel securely inside the channel!
        await interaction.reply({ 
            embeds: [embed], 
            components: [row] 
        });
    }
};
