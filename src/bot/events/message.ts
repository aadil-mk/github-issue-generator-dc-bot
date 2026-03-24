import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from "discord.js";
import { ENV } from "../../config/env";
import { COLOR } from "../../utils/colors";

export const handleMessage = async (message: Message) => {
    // Ignore bots
    if (message.author.bot) return;

    // Check for specific ENV configured command prefix
    const prefix = ENV.PREFIX;
    if (!message.content.startsWith(prefix)) return;

    // Strip prefix and separate arguments
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    // Because slash commands interface dynamically, we will safely intercept legacy text-based triggers manually.
    if (commandName === "help") {
        await message.reply({
            content: "**GitHub Issue Bot Help**\n\nYou can click the interactive 'Create Issue' button securely generated from `/setup-ticket` to directly post a new issue securely into the repository!",
        });
    } else if (commandName === "setup-ticket") {
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

        const channel = message.channel as TextChannel;
        await channel.send({ embeds: [embed], components: [row] });
    }
};
