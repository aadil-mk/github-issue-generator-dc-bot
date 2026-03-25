# Discord GitHub Issues Bot

Create GitHub issues directly from Discord — without ever leaving the app.

---

## Features

- `/setup-ticket` — Posts a persistent dropdown panel in any channel. Team members pick an issue type and fill in a form; the issue lands on GitHub automatically.
- `/help` — Displays a full in-Discord guide to using the bot.
- **Issue types** — 🐛 Bug Fix `[FIX]` and ✨ Feature Request `[FEAT]`, prefixed automatically on the GitHub issue title.
- **Developer notifications** — Configured developers receive a DM with a link every time a new issue is submitted.
- **Issue logging** — Every submission is persisted to MongoDB (submitter, title, description, GitHub link).

---

## Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 9
- A **MongoDB** instance (local or cloud, e.g. MongoDB Atlas)
- A **Discord application & bot** — [Discord Developer Portal](https://discord.com/developers/applications)
- A **GitHub Personal Access Token** with `repo` scope — [Creating a token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

---

## Setup

### 1. Clone the repository

```sh
git clone https://github.com/your-username/github-issue-bot.git
cd github-issue-bot
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

Copy the example env file and fill in your values:

```sh
cp .env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `BOT_TOKEN` | ✅ | Your Discord bot token. Found in the [Developer Portal](https://discord.com/developers/applications) under your app → Bot. |
| `GUILD_ID` | ✅ | Your Discord server ID. Right-click the server name → **Copy Server ID** (enable Developer Mode in Discord settings first). |
| `GITHUB_ACCESS_TOKEN` | ✅ | A GitHub Personal Access Token with `repo` scope. |
| `GITHUB_USERNAME` | ✅ | The GitHub organization or username that owns the target repository. e.g. `mdshamoon` from `github.com/mdshamoon/glific-frontend`. |
| `GITHUB_REPOSITORY` | ✅ | The target repository name. e.g. `glific-frontend` from `github.com/mdshamoon/glific-frontend`. |
| `MONGODB_URI` | ✅ | MongoDB connection string. e.g. `mongodb://localhost:27017/issuebot` or a MongoDB Atlas URI. |
| `DEVELOPER_IDS` | ✅ | Comma-separated Discord user IDs to DM when an issue is created. e.g. `123456789,987654321`. Right-click a user → **Copy User ID** to get their ID. |
| `PREFIX` | ❌ | Command prefix (default: `/`). Not used by slash commands — can be left blank. |

### 4. Invite the bot to your server

Generate an invite URL in the [Developer Portal](https://discord.com/developers/applications) under your app → OAuth2 → URL Generator. Select the following scopes and permissions:

**Scopes:** `bot`, `applications.commands`

**Bot permissions:** `Send Messages`, `Use Slash Commands`, `Embed Links`

---

## Running the bot

### Development

Runs directly with `ts-node` — no build step needed:

```sh
npm run dev
```

### Production

Compile TypeScript first, then run the compiled output:

```sh
npm run build
npm start
```

### Type checking only (no emit)

```sh
npm run typecheck
```

---

## Usage

Once the bot is running and invited to your server:

1. Run `/setup-ticket` in the channel where you want the panel to live.
2. A dropdown menu will appear — select **Bug Fix (FIX)** or **Feature (FEAT)**.
3. Fill in the **Issue Title** and **Issue Description** in the modal that pops up.
4. Submit — the issue is created on GitHub instantly, you get a confirmation embed, and all configured developers are notified via DM.

Run `/help` at any time for a full in-Discord guide.

---

## Project structure

```
src/
├── bot/
│   ├── commands/
│   │   ├── help.ts          # /help slash command
│   │   └── setupTicket.ts   # /setup-ticket slash command
│   ├── events/
│   │   ├── interaction.ts   # Routes all incoming interactions
│   │   └── ready.ts         # Registers commands on startup
│   └── handlers/
│       ├── commandHandler.ts  # Loads command files dynamically
│       └── modalSubmit.ts     # Handles form submission & GitHub API call
├── config/
│   ├── database.ts          # MongoDB connection
│   └── env.ts               # Typed environment variable map
├── models/
│   └── Issue/
│       ├── IIssue.ts        # Issue interface
│       └── Issue.ts         # Mongoose model
├── services/
│   ├── bot.ts               # Discord client setup
│   └── github.ts            # Octokit GitHub API wrapper
├── utils/
│   ├── colors.ts            # Shared embed color constants
│   ├── logger.ts            # Logger utility
│   └── modal.ts             # Issue modal builder
└── index.ts                 # Entry point (Express + bot boot)
```

---

## Tech stack

| | Package |
|---|---|
| Discord | `discord.js` v14 |
| GitHub API | `@octokit/rest` |
| Database | `mongoose` + MongoDB |
| HTTP server | `express` |
| Language | TypeScript 5 on Node >= 20 |
```
