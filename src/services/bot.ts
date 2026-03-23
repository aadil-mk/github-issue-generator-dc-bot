import DiscordJS, { GatewayIntentBits, ApplicationCommandType, Events } from "discord.js";
import { ENV } from "../utils/constants";
import { getIssueModal } from "../utils/modal";
import { createGithubIssue } from "../services/github";

/**
 * Initializes and starts the Discord bot client.
 */
export const startBot = () => {
    const client = new DiscordJS.Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });

    client.once(Events.ClientReady, () => {
        console.log("issue bot ready");
        const guildId = ENV.GUILD_ID || "";

        const guild = client.guilds.cache.get(guildId);
        const commands = guild ? guild.commands : client.application?.commands;

        commands?.create({
            name: "Open github issue",
            type: ApplicationCommandType.Message,
        });
    });

    client.on(Events.InteractionCreate, async (interaction) => {
        if (interaction.isMessageContextMenuCommand()) {
            const { commandName, targetMessage } = interaction;
            if (commandName === "Open github issue") {
                const modal = getIssueModal(targetMessage.content);
                await interaction.showModal(modal);
            }
        } else if (interaction.isModalSubmit()) {
            const { fields } = interaction;
            const issueTitle = fields.getTextInputValue("issueTitle");
            const issueDescription = fields.getTextInputValue("issueDescription");
            try {
                const res = await createGithubIssue(issueTitle, issueDescription);
                await interaction.reply(`Issue created: ${res.data.html_url}`);
            } catch (error) {
                console.error("Failed to create issue.", error);
                await interaction.reply({ content: "Failed to create issue.", ephemeral: true });
            }
        }
    });

    client.login(ENV.BOT_TOKEN);
};
