import { Client } from "discord.js";
import { ENV } from "../../config/env";
import { commands } from "../handlers/commandHandler";
import { logger } from "../../utils/logger";

export const handleReady = (client: Client) => {
    logger.info("⏳ Registering commands ");
    const guildId = ENV.GUILD_ID || "";

    const guild = client.guilds.cache.get(guildId);
    const slashCommands = guild ? guild.commands : client.application?.commands;

    // Register loaded commands with Discord
    const commandsData = commands.map((c) => c.data);
    if (commandsData.length > 0) {
        slashCommands?.set(commandsData)
            .then(() => {
                logger.info("✅ Commands successfully registered!");
            })
            .catch((err) => {
                logger.error("Failed to register commands", err);
            });
    }
};
