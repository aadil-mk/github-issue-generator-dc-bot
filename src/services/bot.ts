import DiscordJS, { GatewayIntentBits, Events } from "discord.js";
import { ENV } from "../config/env";
import { loadCommands } from "../bot/handlers/commandHandler";
import { handleReady } from "../bot/events/ready";
import { handleInteraction } from "../bot/events/interaction";
import { handleMessage } from "../bot/events/message";

/**
 * Initializes and starts the Discord bot client.
 */
export const startBot = () => {
    const client = new DiscordJS.Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    });

    // Dynamically bootstrap commands runtime
    loadCommands();

    // Hook core bot listener functionality
    client.once(Events.ClientReady, () => handleReady(client));
    client.on(Events.InteractionCreate, handleInteraction);
    client.on(Events.MessageCreate, handleMessage);

    client.login(ENV.BOT_TOKEN);
};
