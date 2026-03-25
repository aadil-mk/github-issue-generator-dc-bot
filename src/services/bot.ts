import DiscordJS, { GatewayIntentBits, Events } from "discord.js";
import { ENV } from "../config/env";
import { loadCommands } from "../bot/handlers/commandHandler";
import { handleReady } from "../bot/events/ready";
import { handleInteraction } from "../bot/events/interaction";

export const startBot = () => {
    const client = new DiscordJS.Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    });

    loadCommands();

    // Hook core bot listener functionality
    client.once(Events.ClientReady, () => handleReady(client));
    client.on(Events.InteractionCreate, handleInteraction);

    client.login(ENV.BOT_TOKEN);
};
