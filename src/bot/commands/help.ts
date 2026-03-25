import {
  ApplicationCommandType,
  Interaction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { COLOR } from "../../utils/colors";

export default {
  data: {
    name: "help",
    description: "Learn how to use the GitHub Issue Bot",
    type: ApplicationCommandType.ChatInput,
  },
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const embed = new EmbedBuilder()
      .setTitle("📘 GitHub Issue Bot — Help Guide")
      .setDescription(
        "This bot lets you create GitHub issues directly from Discord. " +
          "Below are all the available ways to interact with the bot.",
      )
      .setColor(COLOR.BLUE)
      .addFields(
        {
          name: "⚙️ `/setup-ticket`",
          value:
            "Posts a persistent panel in the current channel with a **dropdown menu**.\n" +
            "Team members can select an issue type and fill in a form to submit a GitHub issue — " +
            "no slash commands needed after setup.\n\n" +
            "**Issue types available:**\n" +
            "🐛 **Bug Fix (FIX)** — Report a bug or problem\n" +
            "✨ **Feature (FEAT)** — Request a new feature",
        },
        {
          name: "❓ `/help`",
          value: "Displays this help message.",
        },
        {
          name: "📋 How Issue Submission Works",
          value:
            "1. Select an issue type from the dropdown in a ticket panel.\n" +
            "2. A modal (form) will pop up asking for:\n" +
            "   • **Issue Title** — A short summary\n" +
            "   • **Issue Description** — A detailed explanation\n" +
            "3. Submit the form — the issue is automatically created on GitHub " +
            "with a `[FIX]` or `[FEAT]` prefix on the title.\n" +
            "4. You'll receive a confirmation embed once the issue is live.",
        },
        {
          name: "🔔 Developer Notifications",
          value:
            "When an issue is submitted, all configured developers are automatically " +
            "notified via **Direct Message** with a link to the newly created GitHub issue.",
        },
        {
          name: "🗄️ Issue Logging",
          value:
            "Every submitted issue is saved to the database, recording:\n" +
            "• Issue title & description\n" +
            "• Link to the GitHub issue\n" +
            "• Discord username & user ID of the submitter",
        },
      )
      .setFooter({
        text: "GitHub Issue Bot • Issues are submitted directly to the configured repository",
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });
  },
};
