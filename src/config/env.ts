import dotenv from "dotenv";

dotenv.config();

/**
 * Application environment configuration object map.
 */
export const ENV = {
    /** Port assigned to the express server */
    PORT: process.env.PORT || 7000,

    /** Discord bot login token */
    BOT_TOKEN: process.env.BOT_TOKEN,

    /** Default Guild ID for slash command registration */
    GUILD_ID: process.env.GUILD_ID,

    /** Personal access token for interacting with Github */
    GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN || "",

    /** Target Github Organization / User name for issue creation */
    GITHUB_USERNAME: process.env.GITHUB_USERNAME || "",

    /** Target Github Repository name for issue creation */
    GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY || "",
    /** Bot command execution prefix */
    PREFIX: process.env.PREFIX || "/",

    /** Comma-separated list of developer User IDs to ping upon issue creation */
    DEVELOPER_IDS: process.env.DEVELOPER_IDS,

    /** MongoDB Connection URI */
    MONGODB_URI: process.env.MONGODB_URI || "",
};
