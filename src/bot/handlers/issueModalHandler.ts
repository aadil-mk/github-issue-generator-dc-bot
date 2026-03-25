//* ====== Imports ====== *//
import {
  ActionRowBuilder,
  Attachment,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ComponentType,
  EmbedBuilder,
  Message,
  MessageFlags,
  ModalSubmitInteraction,
  TextChannel,
  ThreadAutoArchiveDuration,
} from "discord.js";
import { ENV } from "../../config/env";
import { Issue } from "../../models/Issue/Issue";
import {
  createGithubIssue,
  searchGithubIssues,
  uploadAttachmentToGithub,
} from "../../services/github";
import { COLOR } from "../../utils/colors";
import { CUSTOM_IDS, LIMITS } from "../../utils/constants";
import logger from "../../utils/logger";
import { checkIssueRateLimit, formatRemainingTime } from "../../utils/rateLimiter";

//* ====== Internal Logic Helpers ====== *//

/**
 * Validates the user's rate limit for issue submissions.
 */
async function validateRateLimit(interaction: ModalSubmitInteraction): Promise<boolean> {
  const rateLimit = await checkIssueRateLimit(interaction.user.id);
  if (rateLimit.limited) {
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("🚫 Rate Limit Reached")
          .setDescription(
            `You've submitted **3 issues** in the last hour.\n` +
              `Please wait **${formatRemainingTime(rateLimit.remainingMs)}** before submitting another.`,
          )
          .addFields({
            name: "💡 Tip",
            value: "If urgent, contact a developer directly.",
          })
          .setColor(COLOR.RED)
          .setTimestamp(),
      ],
    });
    return false;
  }
  return true;
}

/**
 * Provides an optional attachment loop via a private thread.
 */
async function processAttachments(interaction: ModalSubmitInteraction): Promise<string[]> {
  const attachmentUrls: string[] = [];
  const canCreateThread = interaction.channel instanceof TextChannel;

  if (!canCreateThread || !interaction.channel) return attachmentUrls;

  try {
    const thread = await (interaction.channel as TextChannel).threads.create({
      name: "📎 Issue Attachments",
      type: ChannelType.PrivateThread,
      invitable: false,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
    });

    await thread.members.add(interaction.user.id);

    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("📎 Attach Files (Optional)")
          .setDescription(
            `A private thread has been created for you: ${thread}\n\n` +
              "Upload your files there, then click **Done ✅**.\n" +
              "Or click **Skip →** to continue without attachments.\n\n" +
              `*Times out in 60s · Max ${LIMITS.MAX_ATTACHMENT_BYTES / (1024 * 1024)} MB per file.*`,
          )
          .setColor(COLOR.BLUE),
      ],
    });

    const attachRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(CUSTOM_IDS.ATTACHMENT_DONE_BTN)
        .setLabel("Done ✅")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(CUSTOM_IDS.ATTACHMENT_SKIP_BTN)
        .setLabel("Skip →")
        .setStyle(ButtonStyle.Secondary),
    );

    const promptMsg = await thread.send({
      content: `<@${interaction.user.id}>`,
      embeds: [
        new EmbedBuilder()
          .setTitle("📎 Upload Your Files Here")
          .setDescription(
            "Drop your screenshots or files in this thread, then click **Done ✅**.\n" +
              "Click **Skip →** to submit without attachments.\n\n" +
              `*Times out in 60s · Max ${LIMITS.MAX_ATTACHMENT_BYTES / (1024 * 1024)} MB per file.*`,
          )
          .setColor(COLOR.BLUE),
      ],
      components: [attachRow],
    });

    const collectedFiles: { url: string; name: string }[] = [];
    const msgCollector = thread.createMessageCollector({
      filter: (m: Message) => m.author.id === interaction.user.id && m.attachments.size > 0,
      time: LIMITS.ATTACHMENT_TIMEOUT_MS,
    });

    msgCollector.on("collect", (m: Message) => {
      m.attachments.forEach((att: Attachment) => {
        collectedFiles.push({ url: att.url, name: att.name });
      });
    });

    const attachBtn = await promptMsg.awaitMessageComponent({
      filter: (i) =>
        i.user.id === interaction.user.id &&
        ([CUSTOM_IDS.ATTACHMENT_DONE_BTN, CUSTOM_IDS.ATTACHMENT_SKIP_BTN] as string[]).includes(i.customId),
      componentType: ComponentType.Button,
      time: LIMITS.ATTACHMENT_TIMEOUT_MS,
    });

    msgCollector.stop();
    await attachBtn.deferUpdate();

    if (attachBtn.customId === CUSTOM_IDS.ATTACHMENT_DONE_BTN && collectedFiles.length > 0) {
      await thread.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("⏳ Uploading...")
            .setDescription(`Uploading **${collectedFiles.length}** file(s) to GitHub...`)
            .setColor(COLOR.BLUE),
        ],
      });

      for (const file of collectedFiles) {
        try {
          attachmentUrls.push(await uploadAttachmentToGithub(file.url, file.name));
        } catch (err) {
          logger.error(`Failed to upload attachment "${file.name}"`, err);
        }
      }
    }

    await thread.delete().catch((err) => logger.error("Failed to delete attachment thread", err));
  } catch (err) {
    logger.error("Error in attachment processing loop", err);
  }

  return attachmentUrls;
}

/**
 * Checks for duplicate issues on GitHub and prompts the user to continue or cancel.
 */
async function checkDuplicateIssues(
  interaction: ModalSubmitInteraction,
  issueTitleRaw: string,
): Promise<boolean> {
  try {
    const { data } = await searchGithubIssues(issueTitleRaw);

    if (data.items.length > 0) {
      const dupList = data.items
        .slice(0, 3)
        .map((issue, i) => `${i + 1}. [${issue.title}](${issue.html_url})`)
        .join("\n");

      const dupRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(CUSTOM_IDS.DUPLICATE_CREATE_ANYWAY_BTN)
          .setLabel("Create Anyway")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(CUSTOM_IDS.DUPLICATE_CANCEL_BTN)
          .setLabel("Cancel")
          .setStyle(ButtonStyle.Secondary),
      );

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("⚠️ Similar Issues Found")
            .setDescription(
              `Found **${data.items.length}** similar open issue(s):\n\n` +
                dupList +
                "\n\nYour problem may already be tracked.",
            )
            .addFields({
              name: "What would you like to do?",
              value:
                "• **Create Anyway** — submit regardless.\n" +
                "• **Cancel** — review existing issues first.",
            })
            .setColor(COLOR.YELLOW)
            .setTimestamp(),
        ],
        components: [dupRow],
      });

      const replyMessage = (await interaction.fetchReply()) as Message;

      const dupBtn = await replyMessage.awaitMessageComponent({
        filter: (i) =>
          i.user.id === interaction.user.id &&
          ([CUSTOM_IDS.DUPLICATE_CREATE_ANYWAY_BTN, CUSTOM_IDS.DUPLICATE_CANCEL_BTN] as string[]).includes(i.customId),
        componentType: ComponentType.Button,
        time: LIMITS.DUPLICATE_TIMEOUT_MS,
      });

      await dupBtn.deferUpdate();

      if (dupBtn.customId === CUSTOM_IDS.DUPLICATE_CANCEL_BTN) {
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ Issue Creation Cancelled")
              .setDescription(
                "Submission cancelled. Check the existing issues above — " +
                  "a comment there is often more helpful than a duplicate.",
              )
              .setColor(COLOR.RED)
              .setTimestamp(),
          ],
          components: [],
        });
        return false;
      }

      await interaction.editReply({ components: [] });
    }
    return true;
  } catch (err) {
    if (err instanceof Error && err.name === "InteractionCollectorError") {
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("⏱️ Timed Out")
            .setDescription("No response. Issue creation cancelled.")
            .setColor(COLOR.RED)
            .setTimestamp(),
        ],
        components: [],
      });
      return false;
    }
    logger.error("Duplicate search failed (non-fatal)", err);
    return true; // Proceed if search fails
  }
}

/**
 * Creates the GitHub issue and notifies developers.
 */
async function finalizeIssueCreation(
  interaction: ModalSubmitInteraction,
  issueTitle: string,
  issueBody: string,
  issueDescription: string,
  attachmentUrls: string[],
) {
  try {
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("⏳ Creating Issue...")
          .setDescription("Submitting your issue to GitHub...")
          .setColor(COLOR.BLUE),
      ],
      components: [],
    });

    const res = await createGithubIssue(issueTitle, issueBody);

    await Issue.create({
      issueLink: res.data.html_url,
      requestedById: interaction.user.id,
      requestedByUsername: interaction.user.username,
      title: issueTitle,
      description: issueDescription,
    });

    const successEmbed = new EmbedBuilder()
      .setTitle("✅ Issue Created Successfully")
      .setDescription(
        `**${issueTitle}** has been forwarded to our developers.\n\n` +
          `[🔗 View on GitHub](${res.data.html_url})`,
      )
      .setColor(COLOR.GREEN)
      .setTimestamp();

    if (attachmentUrls.length > 0) {
      successEmbed.addFields({
        name: "📎 Attachments",
        value: `${attachmentUrls.length} file(s) uploaded and embedded in the issue.`,
      });
    }

    await interaction.editReply({ embeds: [successEmbed] });

    for (const devId of ENV.DEVELOPER_IDS) {
      try {
        const devUser = await interaction.client.users.fetch(devId);
        const dmEmbed = new EmbedBuilder()
          .setTitle("⚠️ New GitHub Issue Triggered")
          .setDescription(
            `Opened by <@${interaction.user.id}> (**${interaction.user.username}**).\n\n` +
              `**${issueTitle}**\n\n[🔗 View on GitHub](${res.data.html_url})`,
          )
          .setColor(COLOR.BLUE)
          .setTimestamp();

        if (attachmentUrls.length > 0) {
          dmEmbed.addFields({
            name: "📎 Attachments",
            value: `${attachmentUrls.length} file(s) attached.`,
          });
        }
        await devUser.send({ embeds: [dmEmbed] });
      } catch (err) {
        logger.error(`Failed to DM developer ID: ${devId}`, err);
      }
    }
  } catch (err) {
    logger.error("Failed to create GitHub issue", err);
    await interaction.editReply({
      embeds: [],
      components: [],
      content: "❌ Something went wrong. Please try again or contact a developer.",
    });
  }
}


//* ====== Main Issue Modal Handler ====== *//
export const handleIssueModal = async (interaction: ModalSubmitInteraction) => {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const { fields, customId } = interaction;
  const requestType = customId.split(":")[1] ?? "UNKNOWN";
  const issueTitleRaw = fields.getTextInputValue("issueTitle");
  const issueTitle = `[${requestType}] ${issueTitleRaw}`;
  const issueDescription = fields.getTextInputValue("issueDescription");

  // 1. Rate Limiting
  if (!(await validateRateLimit(interaction))) return;

  // 2. Optional Attachments
  const attachmentUrls = await processAttachments(interaction);

  // 3. Duplicate Detection
  if (!(await checkDuplicateIssues(interaction, issueTitleRaw))) return;

  // 4. Construct Final Body
  let issueBody = issueDescription;
  if (attachmentUrls.length > 0) {
    issueBody +=
      "\n\n---\n\n### 📎 Attachments\n\n" +
      attachmentUrls.map((url, i) => `![Attachment ${i + 1}](${url})`).join("\n\n");
  }

  // 5. Finalize Submission
  await finalizeIssueCreation(interaction, issueTitle, issueBody, issueDescription, attachmentUrls);
};
