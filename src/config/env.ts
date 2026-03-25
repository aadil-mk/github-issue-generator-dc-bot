import dotenv from "dotenv";

dotenv.config();

const REQUIRED_VARS = [
  "BOT_TOKEN",
  "GUILD_ID",
  "GT_ACCESS_TOKEN",
  "GT_USERNAME",
  "GT_REPOSITORY",
  "MONGODB_URI",
  "DEVELOPER_IDS",
] as const;

const missing = REQUIRED_VARS.filter(
  (key) => !process.env[key] || process.env[key]!.trim() === "",
);

if (missing.length > 0) {
  console.error("❌ Missing required environment variables:");
  missing.forEach((key) => console.error(`   - ${key}`));
  console.error(
    "\nPlease define the above variables in your .env file or environment before starting the bot.",
  );
  process.exit(1);
}

export const ENV = {
  /** Port the HTTP server listens on. Defaults to 7000 if not set. */
  PORT: Number(process.env.PORT) || 7000,

  /** Discord bot token used to authenticate with the Discord API. */
  BOT_TOKEN: process.env.BOT_TOKEN as string,

  /** Discord guild (server) ID the bot operates in. */
  GUILD_ID: process.env.GUILD_ID as string,

  /** GitHub personal access token used to authenticate API requests. */
  GT_ACCESS_TOKEN: process.env.GT_ACCESS_TOKEN as string,

  /** GitHub username that owns the target repository. */
  GT_USERNAME: process.env.GT_USERNAME as string,

  /** GitHub repository name where issues will be managed. */
  GT_REPOSITORY: process.env.GT_REPOSITORY as string,

  /** Command prefix for bot commands. Defaults to "/" if not set. */
  PREFIX: process.env.PREFIX || "/",

  /**
   * Comma-separated list of Discord user IDs with developer-level privileges.
   * Parsed into a trimmed, non-empty string array at startup.
   */
  DEVELOPER_IDS: (process.env.DEVELOPER_IDS as string)
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0),

  /** MongoDB connection URI used to connect to the database. */
  MONGODB_URI: process.env.MONGODB_URI as string,
};
