# Cloudflare Deploy Skill (for AI Agents)

[![GitHub License](https://img.shields.io/github/license/peliter/cloudflare-deploy-skill?style=flat-square)](LICENSE)
[![Wrangler Version](https://img.shields.io/npm/v/wrangler?style=flat-square&label=wrangler)](https://www.npmjs.com/package/wrangler)

A highly structured, automated **AI Agent Skill** to deploy any full-stack web, static frontend, or serverless backend project directly to **Cloudflare (Pages & Workers)**, provision database/storage bindings, and retrieve live URLs automatically.

This skill is designed to be **read and executed by other AI Agents** (such as Claude Code, Cursor, OpenCode, Cline, Windsurf, etc.) to give them instant, robust Cloudflare deployment capabilities.

---

## 🚀 Features

- **Auth Checklist**: Detects if wrangler is authenticated, guides login seamlessly.
- **Resource Auto-Provisioning**: Automated checks/creation of Cloudflare D1 (SQLite), R2 (Object Storage), and Queues.
- **Auto Project Type Detection**: Discovers if the target is a frontend-only static site (Pages), a backend API (Workers), or a full-stack monorepo.
- **Secret Syncing**: Safeguards environment variables, automatically uploading local secrets to Cloudflare.
- **Database Schema Migration**: Automatically detects and applies remote SQL schema migrations.
- **URL Extraction**: Captures output logs, deduplicates, and presents clean, live URLs back to the user.

---

## 🛠️ How to Install this Skill

Select the installation method based on the AI Agent you are using:

### 1. Claude Code
To make this skill permanently available within your Claude Code environment, run:
```bash
claude plugin marketplace add peliter/cloudflare-deploy-skill
```

### 2. OpenCode
Add the skill to your global OpenCode configuration (`~/.config/opencode/opencode.json`):
```json
{
  "skills": [
    "github:peliter/cloudflare-deploy-skill"
  ]
}
```

### 3. Cursor / Cline / Roo Code / VS Code Copilot
Simply instruct the agent to read the `SKILL.md` file inside this repository. You can append the following line to your system prompt or `.cursorrules` / `.clinerules`:
```text
When asked to deploy to Cloudflare, read and follow the instructions in:
https://raw.githubusercontent.com/peliter/cloudflare-deploy-skill/main/SKILL.md
```

---

## 💻 Manual & CLI Usage

If you or your agent wants to run the automated script directly:

### Prerequisites
Make sure you have [Bun](https://bun.sh) installed.

### Deploy in One Command
Clone this repository or run the script directly in your project root folder:
```bash
# Run the deployment helper via Bun
bun run https://raw.githubusercontent.com/peliter/cloudflare-deploy-skill/main/deploy.ts
```

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
