import { ApplicationCommandType, CommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel, StringSelectMenuBuilder } from "discord.js";
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
            .setDescription("Select the type of issue you'd like to create from the menu below to automatically submit a new report to our GitHub repository!")
            .setColor(COLOR.BLUE);

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("openIssueModal_select")
            .setPlaceholder("Select request type to create issue")
            .addOptions([
                { label: "Bug Fix (FIX)", value: "FIX", description: "Report a bug or problem", emoji: "🐛" },
                { label: "Feature (FEAT)", value: "FEAT", description: "Request a new feature", emoji: "✨" }
            ]);

        const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

        await interaction.reply({ 
            embeds: [embed], 
            components: [row] 
        });
    }
};
