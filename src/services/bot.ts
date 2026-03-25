import DiscordJS, { GatewayIntentBits, Events } from "discord.js";
import { ENV } from "../config/env";
import { loadCommands } from "../bot/handlers/commandHandler";
import { handleReady } from "../bot/events/ready";
import { handleInteraction } from "../bot/events/interaction";

export const startBot = async () => {
  const client = new DiscordJS.Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  loadCommands();

  // Hook core bot listener functionality
  client.once(Events.ClientReady, () => handleReady(client));
  client.on(Events.InteractionCreate, handleInteraction);

  try {
    await client.login(ENV.BOT_TOKEN);
  } catch (error) {
    console.error("[Bot] Failed to log in to Discord:", error);
    throw error;
  }
};
