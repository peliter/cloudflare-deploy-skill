---
name: cloudflare-deploy
description: Deploy any web or backend project to Cloudflare (Pages/Workers) using Wrangler and automatically retrieve the live deploy URLs. / 使用 Wrangler 將任何前端網頁或後端專案部署至 Cloudflare (Pages/Workers) 並自動獲取部署後的公開網址。
---

# Cloudflare Deploy Skill / Cloudflare 自動部署技能

A specialized AI Agent skill for deploying web frontends (Cloudflare Pages), backend API workers (Cloudflare Workers), and full-stack monorepos to Cloudflare, automatically provisioning backend resources, and retrieving the deployed live URLs.
一個專用的 AI Agent 技能，用於將網頁前端（Cloudflare Pages）、後端 API 服務（Cloudflare Workers）以及全端 Monorepo 專案部署到 Cloudflare，自動設定與配置後端雲端資源，並在部署完成後自動提取並回傳公開網址。

## Triggers / 觸發詞
- "Deploy my project to Cloudflare" / "幫我部署專案到 Cloudflare"
- "Publish this web app to Cloudflare" / "發佈這個網頁應用到 Cloudflare"
- "Help me deploy to Pages / Workers" / "協助我部署到 Pages 或 Workers"
- "Create Cloudflare resources and deploy" / "建立 Cloudflare 資源並進行部署"
- "Run cloudflare-deploy skill" / "執行 cloudflare-deploy 技能"

---

## How to execute (for Agents) / 執行步驟指引（供 Agent 閱讀）

When tasked with deploying a project to Cloudflare, you must follow this step-by-step pipeline:
當你被要求部署專案到 Cloudflare 時，必須遵循以下標準化工作流流程：

### Step 1: Detect Project Type / 步驟 1：偵測專案類型與建置設定
1. Search for project configuration files (`package.json`, `wrangler.toml`, `next.config.js`, etc.) to understand the structure.
   搜尋專案配置檔案（如 `package.json`, `wrangler.toml`, `next.config.js` 等）以了解架構。
2. Determine if it is a **Frontend-only Pages** app, a **Backend-only Worker**, or a **Monorepo/Full-stack** project.
   判定其為**純前端 Pages**、**純後端 Worker**，亦或是**全端 Monorepo** 專案。
3. Identify the build command and output directory (e.g., `dist`, `build`, `.next`).
   找出對應的建置命令（如 `npm run build`）與輸出目錄（如 `dist`, `build`）。

### Step 2: Verify Authentication / 步驟 2：確認 Wrangler 是否已登入
Run the check command:
執行檢查指令：
```bash
bun x wrangler whoami
```
If not authenticated, guide the user to login:
若未登入，請引導用戶點擊授權連結登入：
```bash
bun x wrangler login
```

### Step 3: Check/Provision Resources / 步驟 3：自動配置/建立雲端資源
If the backend requires / 若專案後端需要：
- **D1 Database**: Create D1 instance / 建立 D1 資料庫實例：
  ```bash
  bun x wrangler d1 create <db-name>
  ```
- **R2 Storage**: Create R2 bucket / 建立 R2 儲存桶：
  ```bash
  bun x wrangler r2 bucket create <bucket-name>
  ```
- **Queues**: Create task queues / 建立任務佇列：
  ```bash
  bun x wrangler queues create <queue-name>
  ```

### Step 4: Prepare Configuration / 步驟 4：寫入與更新 `wrangler.toml`
Ensure target bindings, database IDs, and bucket names are correctly mapped.
確保將資料庫 ID、R2 儲存桶名稱與變數綁定正確寫入 `wrangler.toml`。

### Step 5: Execute Build & Deploy / 步驟 5：執行專案建置與發佈
You can run the automatic script included in this skill:
你可以直接執行本技能隨附的自動化部署腳本：
```bash
bun run ./deploy.ts
```
Or run the deployment manually / 或手動進行部署：
```bash
bun run build && bun x wrangler deploy
```

### Step 6: Synchronize Secrets / 步驟 6：同步敏感環境變數 (Secrets)
For any sensitive environment variables in `.env.local`, upload them securely:
將本地 `.env.local` 中的敏感加密金鑰安全地同步至 Cloudflare：
```bash
bun x wrangler secret put <KEY> --name <worker-name>
```

### Step 7: Apply Database Migrations / 步驟 7：執行資料庫遷移
If SQL migration files exist, apply them to the remote production D1:
若有 SQL 遷移檔案，將其套用至雲端生產環境：
```bash
bun x wrangler d1 execute <db-name> --remote --file <migration-file.sql>
```

### Step 8: Parse and Return Live URLs / 步驟 8：分析並提取部署網址
Analyze the output logs to extract the live public URL and present it clearly to the user.
解析 Wrangler 部署日誌，提取公開的 `workers.dev` 或 `pages.dev` 網址，並清晰回報給用戶。
