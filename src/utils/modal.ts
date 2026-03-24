import {
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";

export const getIssueModal = (description: string) => {
    const modal = new ModalBuilder()
        .setTitle("Create github issue")
        .setCustomId("AwesomeForm");

    const requestType = new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setCustomId("requestType")
        .setLabel("Request type (Fix, Feat, etc.)")
        .setPlaceholder("e.g. Fix, Feat")
        .setRequired(true);

    const issueTitle = new TextInputBuilder()
        .setStyle(TextInputStyle.Short)
        .setCustomId("issueTitle")
        .setLabel("Issue title");

    const issueDescription = new TextInputBuilder()
        .setStyle(TextInputStyle.Paragraph)
        .setCustomId("issueDescription")
        .setLabel("Issue description")
        .setValue(description);

    const rows = [requestType, issueTitle, issueDescription].map((component) =>
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(component)
    );

    modal.addComponents(...rows);

    return modal;
};
