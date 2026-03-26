# Discord GitHub Issues Bot

Create GitHub issues directly from Discord — without ever leaving the app. Built with a modular, production-grade architecture.

---

## 🚀 Features

- **`/setup-ticket`** — Posts a persistent dropdown panel. Team members pick an issue type and fill in a digital form.
- **`/info`** — View bot statistics, system resources (RAM/CPU), and uptime.
- **`/setup-help`** — Developer-only guide for managing the bot and permissions.
- **`/help`** — User guide for reporting issues.
- **🛡️ Rate Limiting** — Prevents spam by limiting users to 3 submissions per hour.
- **🔍 Duplicate Detection** — Automatically searches GitHub for similar issues before creating a new one to reduce noise.
- **📎 Attachment Support** — Generates a private thread for users to upload screenshots/files, which are then mirrored directly to the GitHub issue.
- **Developer DMs** — Configured developers receive instant DM notifications with links to new issues.
- **Persistence** — All submissions are logged to MongoDB for audit trails.

---

## 🛠 Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 9
- A **MongoDB** instance (local or Atlas)
- A **Discord application & bot** — [Discord Developer Portal](https://discord.com/developers/applications)
- A **GitHub Personal Access Token** with `repo` scope — [Creating a token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

---

## ⚙️ Setup

### 1. Clone & Install

```sh
git clone https://github.com/your-username/github-issue-bot.git
cd github-issue-bot
npm install
```

### 2. Configure Environment

Copy the example env file and fill in your values:

```sh
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `BOT_TOKEN` | ✅ | Your Discord bot token. |
| `GUILD_ID` | ✅ | Your Discord server ID. |
| `GT_ACCESS_TOKEN` | ✅ | GitHub Personal Access Token (`repo` scope). |
| `GT_USERNAME` | ✅ | GitHub owner (user or org). |
| `GT_REPOSITORY` | ✅ | Target repository name. |
| `MONGODB_URI` | ✅ | MongoDB connection string. |
| `DEVELOPER_IDS` | ✅ | Comma-separated Discord User IDs for DMs & Admin commands. |
| `PORT` | ❌ | HTTP server port (default: 7000). |

---

## 🏃 Running the bot

### Development
```sh
npm run dev
```

### Production
```sh
npm run build
npm start
```

---

## 📂 Project Structure

```
src/
├── bot/
│   ├── commands/        # Slash command definitions (info, help, setup, etc.)
│   ├── events/          # Gateway events (ready, interactionCreate)
│   └── handlers/        # Business logic (issueModalHandler, commandHandler)
├── config/
│   ├── database.ts      # MongoDB connection
│   └── env.ts           # Typed environment validation
├── models/
│   └── Issue/           # Mongoose schemas & interfaces
├── services/
│   ├── bot.ts           # Discord client initialization
│   └── github.ts        # Octokit & GitHub API logic
├── utils/               # Shared utilities (rateLimiter, logger, colors)
└── index.ts             # Main entry point (Express + Boot)
```

---

## 🏗 Tech Stack

- **Discord:** `discord.js` v14
- **GitHub:** `@octokit/rest`
- **Database:** `mongoose` + MongoDB
- **Logging:** `pino` + `pino-pretty`
- **Language:** TypeScript 5

```
