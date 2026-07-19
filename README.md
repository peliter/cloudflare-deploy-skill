# Cloudflare Deploy Skill (for AI Agents) / Cloudflare 自動部署技能

[![GitHub License](https://img.shields.io/github/license/peliter/cloudflare-deploy-skill?style=flat-square)](LICENSE)
[![Wrangler Version](https://img.shields.io/npm/v/wrangler?style=flat-square&label=wrangler)](https://www.npmjs.com/package/wrangler)

[English](#english) | [繁體中文](#繁體中文)

---

## English

A highly structured, automated **AI Agent Skill** to deploy any full-stack web, static frontend, or serverless backend project directly to **Cloudflare (Pages & Workers)**, provision database/storage bindings, and retrieve live URLs automatically.

This skill is designed to be **read and executed by other AI Agents** (such as Claude Code, Cursor, OpenCode, Cline, Windsurf, etc.) to give them instant, robust Cloudflare deployment capabilities.

### 🚀 Features
- **Auth Checklist**: Detects if wrangler is authenticated, guides login seamlessly.
- **Resource Auto-Provisioning**: Automated checks/creation of Cloudflare D1 (SQLite), R2 (Object Storage), and Queues.
- **Auto Project Type Detection**: Discovers if the target is a frontend-only static site (Pages), a backend API (Workers), or a full-stack monorepo.
- **Secret Syncing**: Safeguards environment variables, automatically uploading local secrets to Cloudflare.
- **Database Schema Migration**: Automatically detects and applies remote SQL schema migrations.
- **URL Extraction**: Captures output logs, deduplicates, and presents clean, live URLs back to the user.

### 🛠️ How to Install this Skill
Select the installation method based on your AI Agent:

#### 1. Claude Code
```bash
claude plugin marketplace add peliter/cloudflare-deploy-skill
```

#### 2. OpenCode
Add the skill to your global OpenCode configuration (`~/.config/opencode/opencode.json`):
```json
{
  "skills": [
    "github:peliter/cloudflare-deploy-skill"
  ]
}
```

#### 3. Cursor / Cline / Roo Code / VS Code Copilot
Simply instruct the agent to read the `SKILL.md` file inside this repository:
```text
When asked to deploy to Cloudflare, read and follow the instructions in:
https://raw.githubusercontent.com/peliter/cloudflare-deploy-skill/main/SKILL.md
```

---

## 繁體中文

這是一個專門為 **AI Agent**（例如 Claude Code, Cursor, OpenCode, Cline, Windsurf 等）設計的結構化**自動部署技能**。它能賦予 AI Agent 一鍵將任何全端專案、靜態網頁（Pages）或後端 API（Workers）發佈至 **Cloudflare** 的強大能力，自動配置雲端資源，並在完成後精準提取網址。

### 🚀 核心功能
- **登入狀態自動檢測**：智能判定 Wrangler 是否已登入，引導進行瀏覽器授權。
- **雲端資源自動配置**：一鍵建立並檢查 D1 資料庫、R2 儲存桶和任務佇列。
- **專案結構智能辨識**：自動分析目錄，決定應部署為 Cloudflare Pages 還是 Workers。
- **環境 Secrets 同步**：自動將 `.env.local` 檔案中的加密變數安全同步至 Cloudflare。
- **資料庫自動遷移**：自動執行並同步本地與生產環境的資料庫 SQL 遷移。
- **部署網址精準提取**：自動抓取並去重部署日誌，產出清晰的公開 Live 網址。

### 🛠️ 如何安裝此技能
請根據你目前使用的 AI Agent 選擇對應的載入方式：

#### 1. Claude Code
```bash
claude plugin marketplace add peliter/cloudflare-deploy-skill
```

#### 2. OpenCode
在你的全域 OpenCode 配置檔案中 (`~/.config/opencode/opencode.json`) 加入：
```json
{
  "skills": [
    "github:peliter/cloudflare-deploy-skill"
  ]
}
```

#### 3. Cursor / Cline / Roo Code / VS Code Copilot
直接在你的 System Prompt、`.cursorrules` 或 `.clinerules` 中加入以下指令，引導 AI Agent 直接學習此技能：
```text
當用戶要求部署或發佈專案至 Cloudflare 時，請閱讀並遵循以下技能手冊：
https://raw.githubusercontent.com/peliter/cloudflare-deploy-skill/main/SKILL.md
```

---

## 💻 Manual & CLI Usage / 手動與 CLI 使用

If you or your agent wants to run the automated script directly:
若你或你的 Agent 想直接使用隨附的自動部署腳本：

```bash
# Run the deployment helper via Bun / 透過 Bun 執行自動化部署腳本
bun run https://raw.githubusercontent.com/peliter/cloudflare-deploy-skill/main/deploy.ts
```

---

## 📝 License / 授權協議

MIT License - see the LICENSE file for details.
