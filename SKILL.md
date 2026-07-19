---
name: cloudflare-deploy
description: Deploy any web or backend project to Cloudflare (Pages/Workers) using Wrangler and automatically retrieve the live deploy URLs. Checks for login status, configures necessary Cloudflare resources (such as D1 databases, R2 buckets, Queues), executes database schema migrations, deploys the code, synchronizes environment secrets, and reports the live public URL.
---

# Cloudflare Deploy Skill

A specialized AI Agent skill for deploying web frontends (Cloudflare Pages), backend API workers (Cloudflare Workers), and full-stack monorepos to Cloudflare, automatically provisioning backend resources, and retrieving the deployed live URLs.

## Triggers
- "Deploy my project to Cloudflare"
- "Publish this web app to Cloudflare"
- "Help me deploy to Pages / Workers"
- "Create Cloudflare resources and deploy"
- "Run cloudflare-deploy skill"

## How to execute (for Agents)

When an agent is tasked with deploying a project to Cloudflare, the agent should follow this step-by-step pipeline:

### Step 1: Detect Project Type and Build Setup
1. Search for project configuration files (`package.json`, `wrangler.toml`, `next.config.js`, etc.) to understand the structure.
2. Determine if it is a **Frontend-only Pages** app, a **Backend-only Worker**, or a **Monorepo/Full-stack** project (like Hono + React / Remix / Next.js).
3. Identify the build command (e.g., `npm run build`, `bun run build`) and output directory (e.g., `dist`, `build`, `.svelte-kit`, `.next`).

### Step 2: Ensure Wrangler is Installed and Logged In
Run the following check:
```bash
bun x wrangler whoami
```
If not logged in, ask or prompt the user for login using:
```bash
bun x wrangler login
```
Or check if environment variables `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set.

### Step 3: Check/Provision Backend Resources (if applicable)
If the backend requires:
- **D1 Database**: Check if the database exists or create it:
  ```bash
  bun x wrangler d1 list
  bun x wrangler d1 create <db-name>
  ```
- **R2 Storage**: Check if the R2 bucket exists or create it:
  ```bash
  bun x wrangler r2 bucket list
  bun x wrangler r2 bucket create <bucket-name>
  ```
- **Queues**: Create queues if needed:
  ```bash
  bun x wrangler queues create <queue-name>
  ```

### Step 4: Prepare Configuration (`wrangler.toml` or `wrangler.jsonc`)
Ensure the target bindings and configurations are mapped in `wrangler.toml` (database ID, bucket name, bindings, environment variables).

### Step 5: Execute Build and Deployment
You can invoke the automated deployment script included in this skill:
```bash
bun run ./deploy.ts
```
Or run the deployment manually:
1. Build the production assets:
   ```bash
   npm run build # or bun run build
   ```
2. Deploy the Pages assets:
   ```bash
   bun x wrangler pages deploy <output-dir> --project-name <project-name>
   ```
   Or deploy the Worker:
   ```bash
   bun x wrangler deploy
   ```

### Step 6: Synchronize Secrets (Variables)
For any environment variables marked as secrets in `.env.local`, upload them securely using:
```bash
bun x wrangler secret put <KEY> --name <worker-name>
```

### Step 7: Apply Database Migrations
If there are schema migrations to apply:
```bash
bun x wrangler d1 execute <db-name> --remote --file <migration-file.sql>
```

### Step 8: Parse and Return Live URLs
Look at the wrangler CLI output to find the exact live Worker URL or Pages custom domain:
- E.g., `https://<worker-name>.<subdomain>.workers.dev`
- E.g., `https://<pages-project>.pages.dev`
Report this URL clearly to the user.
