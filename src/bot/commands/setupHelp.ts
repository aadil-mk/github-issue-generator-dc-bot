import {
  ApplicationCommandType,
  Interaction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { COLOR } from "../../utils/colors";

export default {
  data: {
    name: "setup-help",
    description: "Developer-only setup and configuration guide",
    type: ApplicationCommandType.ChatInput,
  },
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const embed = new EmbedBuilder()
      .setTitle("⚙️ GitHub Issue Bot — Admin Guide")
      .setDescription(
        "This guide contains instructions for developers and admins to set up and manage the bot.",
      )
      .setColor(COLOR.BLUE)
      .addFields(
        {
          name: "📍 Panel Installation",
          value:
            "Use `/setup-ticket` in the channel where you want the issue-reporting panel to appear. " +
            "This will post a persistent embed with a dropdown menu.",
        },
        {
          name: "🛡️ Permissions System",
          value:
            "• **Public:** The dropdown panel and forms are accessible to all users for reporting issues.\n" +
            "• **Developer Only:** Commands like `/setup-ticket` and `/setup-help` are restricted to users listed in the `DEVELOPER_IDS` environment variable.",
        },
        {
          name: "🔗 GitHub Integration",
          value:
            "Issues are automatically prefixed with `[FIX]` or `[FEAT]` and submitted to the configured GitHub repository. " +
            "Any attachments uploaded in the private thread are mirrored to GitHub as issue assets.",
        },
        {
          name: "🔔 DM Notifications",
          value:
            "All developers listed in `DEVELOPER_IDS` receive a DM with a link and summary whenever a new issue is created.",
        },
        {
          name: "📂 Logging",
          value:
            "Every submission is recorded in the MongoDB database for audit trails. This includes the submitter's Discord ID and the final GitHub issue link.",
        },
      )
      .setFooter({
        text: "GitHub Issue Bot • Admin Configuration Mode",
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });
  },
};
