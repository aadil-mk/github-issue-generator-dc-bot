import { ApplicationCommandType, Interaction } from "discord.js";

export default {
    data: {
        name: "help",
        description: "Learn how to use the Github Issue bot",
        type: ApplicationCommandType.ChatInput,
    },
    async execute(interaction: Interaction) {
        if (!interaction.isChatInputCommand()) return;
        
        await interaction.reply({
            content: "**GitHub Issue Bot Help**\n\nTo create an issue from an existing message:\n1. Right-click or long-press any message.\n2. Go to **Apps**.\n3. Click **Open github issue**.\n4. A modal will pop up allowing you to customize the title and description before submitting directly to the repository!",
            ephemeral: true,
        });
    }
};
