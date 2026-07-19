#!/usr/bin/env bun
import { $ } from "bun";
import { existsSync, readFileSync } from "node:fs";

console.log("🚀 [cloudflare-deploy] Skill Initiated / 自動化部署技能已啟動...");

// 1. Verify authentication / 驗證登入狀態
try {
  const whoami = await $`bun x wrangler whoami`.quiet().text();
  if (whoami.includes("You are not authenticated")) {
    console.error("❌ Wrangler is not authenticated. Please run 'bun x wrangler login' first. / Wrangler 尚未登入，請先執行 'bun x wrangler login'。");
    process.exit(1);
  }
  const emailMatch = whoami.match(/email\s+([^\s]+)/i) || whoami.match(/associated with the email\s+([^\s\.]+)/i);
  console.log(`✅ Cloudflare Authenticated / 已成功驗證 Cloudflare 帳號: ${emailMatch ? emailMatch[1] || emailMatch[0] : "Authorized Account"}`);
} catch (e) {
  console.error("❌ Error checking Wrangler auth status / 檢查登入狀態失敗:", e);
  process.exit(1);
}

// 2. Detect project structure / 偵測專案結構
const hasWranglerConfig = existsSync("wrangler.toml") || existsSync("wrangler.jsonc") || existsSync("server/wrangler.toml");
const hasPackageJson = existsSync("package.json");

if (!hasWranglerConfig && !hasPackageJson) {
  console.error("❌ No package.json or wrangler.toml found in project tree. / 找不到 package.json 或 wrangler.toml 檔案。");
  process.exit(1);
}

// 3. Determine build command / 確定建置指令
let buildCmd = "";
if (hasPackageJson) {
  try {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
    if (pkg.scripts?.build) {
      buildCmd = "bun run build"; // prefer bun
      console.log(`📦 Detected build script in package.json / 偵測到建置指令: "${pkg.scripts.build}"`);
    }
  } catch (e) {}
}

if (buildCmd) {
  console.log(`🔨 Running build command / 正在執行專案建置: "${buildCmd}"...`);
  try {
    await $`${{ raw: buildCmd }}`;
    console.log("✅ Build completed successfully / 專案建置順利完成。");
  } catch (e) {
    console.error("❌ Build failed / 專案建置失敗:", e);
    process.exit(1);
  }
}

// 4. Trigger deployment / 執行部署
console.log("🌐 Deploying project to Cloudflare / 正在部署專案至 Cloudflare...");
try {
  let deployResult = "";
  if (existsSync("wrangler.toml") || existsSync("wrangler.jsonc")) {
    console.log("📦 Found wrangler configuration / 偵測到 wrangler 配置文件。進行標準部署...");
    deployResult = await $`bun x wrangler deploy`.text();
  } else if (existsSync("package.json")) {
    // Check if it looks like a static web app
    const outDir = existsSync("dist") ? "dist" : existsSync("build") ? "build" : "";
    if (outDir) {
      console.log(`📂 Found build output directory / 偵測到輸出目錄: "${outDir}". Deploying as Cloudflare Pages...`);
      deployResult = await $`bun x wrangler pages deploy ${outDir}`.text();
    } else {
      console.log("⚠️ No build output directory found. Attempting standard wrangler deploy... / 找不到輸出目錄，嘗試標準 Workers 部署...");
      deployResult = await $`bun x wrangler deploy`.text();
    }
  }

  console.log(deployResult);

  // 5. Extract deployed URL / 提取部署後的公開網址
  const urlRegex = /https:\/\/[a-zA-Z0-9\-\.]+\.workers\.dev|https:\/\/[a-zA-Z0-9\-\.]+\.pages\.dev/g;
  const urls = deployResult.match(urlRegex);
  
  if (urls && urls.length > 0) {
    const uniqueUrls = Array.from(new Set(urls));
    console.log("\n✨ =================================================== ✨");
    console.log("🎉 DEPLOYMENT SUCCESSFUL / 專案已順利發佈成功！");
    console.log(`🔗 Public Live URL / 公開連結: ${uniqueUrls[0]}`);
    if (uniqueUrls.length > 1) {
      console.log(`🔗 Alternative URLs / 備用連結: ${uniqueUrls.slice(1).join(", ")}`);
    }
    console.log("✨ =================================================== ✨\n");
  } else {
    console.log("\n⚠️ Deployment finished, but no public URL could be parsed from the output. / 部署完成，但未能從日誌中解析出公開網址。");
  }
} catch (e) {
  console.error("❌ Deployment failed / 部署失敗:", e);
  process.exit(1);
}
