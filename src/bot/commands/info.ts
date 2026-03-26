import {
  ApplicationCommandType,
  Interaction,
  EmbedBuilder,
} from "discord.js";
import os from "os";
import { COLOR } from "../../utils/colors";
import { Issue } from "../../models/Issue/Issue";

export default {
  data: {
    name: "info",
    description: "View GitHub Issue Bot information and status",
    type: ApplicationCommandType.ChatInput,
  },
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    // --- Statistics Calculations ---
    const uptimeInSeconds = process.uptime();
    const days = Math.floor(uptimeInSeconds / 86400);
    const hours = Math.floor((uptimeInSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeInSeconds % 3600) / 60);
    const uptime = `${days}d ${hours}h ${minutes}m`;

    // RAM stats (MB)
    const memUsage = process.memoryUsage();
    const heapUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(1);
    const heapTotalMB = (memUsage.heapTotal / 1024 / 1024).toFixed(1);
    const totalMemGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);

    // CPU and Ping
    const cpuLoad = os.loadavg()[0].toFixed(2);
    const ping = interaction.client.ws.ping;

    // Database stats
    const totalIssues = await Issue.countDocuments({}).catch(() => 0);

    const devUser = await interaction.client.users
      .fetch("883904014532624385")
      .catch(() => null);

    const embed = new EmbedBuilder()
      .setTitle("🤖 Bot Information & System Status")
      .setDescription(
        "Bridging Discord and GitHub – a production-grade link for reporting " +
          "bugs and requesting features via forms & private threads.",
      )
      .setColor(COLOR.BLUE)
      .addFields(
        {
          name: "📊 Bot Stats",
          value:
            `**Total Issues:** \`${totalIssues}\` issues created\n` +
            `**Latency:** \`${ping}ms\` (WS Ping)\n` +
            `**Bot Uptime:** \`${uptime}\``,
          inline: true,
        },
        {
          name: "🖥️ System Resources",
          value:
            `**RAM:** \`${heapUsedMB}MB\` / \`${heapTotalMB}MB\` (Heap)\n` +
            `**Server RAM:** \`${totalMemGB}GB\` (Total)\n` +
            `**CPU Load:** \`${cpuLoad}%\``,
          inline: true,
        },
        {
          name: "💻 Platform",
          value: `\`${os.type()}\` • \`${os.release()}\` (\`${os.arch()}\`)`,
          inline: false,
        },
      )
      .setFooter({
        text: `Developed by ${devUser?.username || "Unknown"} with ❤️`,
        iconURL: devUser?.displayAvatarURL() || undefined,
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
    });
  },
};
