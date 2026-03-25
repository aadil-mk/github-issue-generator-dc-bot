import {
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export interface IssueModalDto {
    type: string;
    descriptionInitialValue: string;
}

export const getIssueModal = (dto: IssueModalDto) => {
    const { type, descriptionInitialValue } = dto;

    const modal = new ModalBuilder()
        .setTitle(`Create Issue - ${type}`)
        .setCustomId(`AwesomeForm:${type}`);

    const issueTitle = new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setCustomId("issueTitle")
        .setLabel("Issue title")
        .setRequired(true);

    const issueDescription = new TextInputBuilder()
        .setStyle(TextInputStyle.Paragraph)
        .setCustomId("issueDescription")
        .setLabel("Issue description")
        .setValue(descriptionInitialValue)
        .setRequired(true);

    const issueTitleRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        issueTitle
    );

    const issueDescriptionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        issueDescription
    );

    modal.addComponents(issueTitleRow, issueDescriptionRow);

    return modal;
};
