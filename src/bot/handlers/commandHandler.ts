import fs from "fs";
import path from "path";
import { Collection, Interaction, ApplicationCommandData } from "discord.js";
import { logger } from "../../utils/logger";

export interface Command {
  data: ApplicationCommandData;
  execute: (interaction: Interaction) => Promise<void>;
}

export const commands = new Collection<string, Command>();

export const loadCommands = async () => {
  const commandsPath = path.join(__dirname, "../commands");
  if (!fs.existsSync(commandsPath)) return;

  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = (await import(filePath)).default;

    if (command && "data" in command && "execute" in command) {
      commands.set(command.data.name, command);
    } else {
      logger.warn(
        `The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
};
