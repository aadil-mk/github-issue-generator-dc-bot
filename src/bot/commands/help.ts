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
    description: "Learn how to submit a GitHub issue",
    type: ApplicationCommandType.ChatInput,
  },
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const embed = new EmbedBuilder()
      .setTitle("📘 GitHub Issue Bot — User Guide")
      .setDescription(
        "Follow these steps to report bugs or request new features directly to our team.",
      )
      .setColor(COLOR.BLUE)
      .addFields(
        {
          name: "🚀 1. Start a Submission",
          value:
            "Go to the **issue-reporting** channel and select an issue type (🐛 Bug or ✨ Feature) from the dropdown ticket panel.",
        },
        {
          name: "📝 2. Fill the Form",
          value:
            "A form will pop up. Enter a clear **Title** and a detailed **Description** of your request, then click **Submit**.",
        },
        {
          name: "📎 3. Add Attachments (Private Thread)",
          value:
            "Once submitted, I'll create a **private thread** and send you a DM/mention. " +
            "Upload your files there, then click **Done ✅** to complete the report.\n\n" +
            "*Note: This thread is private and only visible to you and the developers.*",
        },
        {
          name: "✅ 4. You're Done!",
          value:
            "You'll get a confirmation message once the issue is live on GitHub. " +
            "Our developers will be notified automatically!",
        },
      )
      .setFooter({
        text: "Need more help? Contact one of our developers.",
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral,
    });
  },
};
