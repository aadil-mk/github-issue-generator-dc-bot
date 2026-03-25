import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { CUSTOM_IDS } from "./constants";

export interface IssueModalDto {
  type: string;
}

export const getIssueModal = (dto: IssueModalDto) => {
  const { type } = dto;

  const modal = new ModalBuilder()
    .setTitle(`Create Issue - ${type}`)
    .setCustomId(`${CUSTOM_IDS.MODAL_PREFIX}:${type}`);

  const issueTitle = new TextInputBuilder()
    .setStyle(TextInputStyle.Short)
    .setCustomId("issueTitle")
    .setLabel("Issue title")
    .setRequired(true);

  const issueDescription = new TextInputBuilder()
    .setStyle(TextInputStyle.Paragraph)
    .setCustomId("issueDescription")
    .setLabel("Issue description")
    .setRequired(true);

  const issueTitleRow =
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      issueTitle,
    );

  const issueDescriptionRow =
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      issueDescription,
    );

  modal.addComponents(issueTitleRow, issueDescriptionRow);

  return modal;
};
