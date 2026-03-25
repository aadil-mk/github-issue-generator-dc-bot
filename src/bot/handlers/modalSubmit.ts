import { logger } from "../../utils/logger";
import { ModalSubmitInteraction, EmbedBuilder } from "discord.js";
import { createGithubIssue } from "../../services/github";
import { ENV } from "../../config/env";
import { COLOR } from "../../utils/colors";
import { Issue } from "../../models/Issue/Issue";

export const handleModalSubmit = async (
  interaction: ModalSubmitInteraction
) => {
  // Acknowledge the interaction immediately to prevent the 3-second 'Unknown interaction' timeout error natively
  await interaction.deferReply({ ephemeral: true });

  const { fields, customId } = interaction;
  const requestType = customId.split(":")[1];

  const issueTitleRaw = fields.getTextInputValue("issueTitle");
  const issueTitle = `[${requestType}] ${issueTitleRaw}`;
  const issueDescription = fields.getTextInputValue("issueDescription");

  try {
    const res = await createGithubIssue(issueTitle, issueDescription);

    await Issue.create({
      issueLink: res.data.html_url,
      requestedById: interaction.user.id,
      requestedByUsername: interaction.user.username,
      title: issueTitle,
      description: issueDescription
    });

    const devIds = String(ENV.DEVELOPER_IDS)
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const embed = new EmbedBuilder()
      .setTitle("✅ Issue Created Successfully")
      .setDescription(
        `Your issue **${issueTitle}** has been forwarded to our developers.\nThank you for your feedback!`
      )
      .setColor(COLOR.GREEN)
      .setTimestamp();

    // Edit the original ephemeral loading state natively
    await interaction.editReply({
      embeds: [embed]
    });

    // Dispatch direct DMs to every configured developer mapping securely
    if (devIds.length > 0) {
      for (const devId of devIds) {
        try {
          const devUser = await interaction.client.users.fetch(devId);
          if (devUser) {
            const dmEmbed = new EmbedBuilder()
              .setTitle("⚠️ New GitHub Issue Triggered")
              .setDescription(
                `A new issue has just been opened by <@${interaction.user.id}>!\n\n**${issueTitle}**\n\n[Click securely to view this issue on GitHub](${res.data.html_url})`
              )
              .setColor(COLOR.BLUE);

            await devUser.send({ embeds: [dmEmbed] });
          }
        } catch (dmError) {
          logger.error(
            `Failed to dispatch DM to Developer ID: ${devId}`,
            dmError
          );
        }
      }
    }
  } catch (error) {
    logger.error("Failed to create issue.", error);
    await interaction.editReply({ content: "Failed to create issue." });
  }
};
