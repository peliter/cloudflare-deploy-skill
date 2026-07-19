#!/usr/bin/env bun
import { $ } from "bun";
import { existsSync, readFileSync } from "node:fs";

console.log("🚀 Cloudflare Auto Deployer Skill Initiated...");

// 1. Verify authentication
try {
  const whoami = await $`bun x wrangler whoami`.quiet().text();
  if (whoami.includes("You are not authenticated")) {
    console.error("❌ Wrangler is not authenticated. Please run 'bun x wrangler login' first.");
    process.exit(1);
  }
  const emailMatch = whoami.match(/email\s+([^\s]+)/i) || whoami.match(/associated with the email\s+([^\s\.]+)/i);
  console.log(`✅ Authenticated with Cloudflare: ${emailMatch ? emailMatch[1] || emailMatch[0] : "Authorized Account"}`);
} catch (e) {
  console.error("❌ Error checking Wrangler auth status:", e);
  process.exit(1);
}

// 2. Detect project structure
const hasWranglerConfig = existsSync("wrangler.toml") || existsSync("wrangler.jsonc") || existsSync("server/wrangler.toml");
const hasPackageJson = existsSync("package.json");

if (!hasWranglerConfig && !hasPackageJson) {
  console.error("❌ No package.json or wrangler.toml found in the current directory tree.");
  process.exit(1);
}

// 3. Determine build command
let buildCmd = "";
if (hasPackageJson) {
  try {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
    if (pkg.scripts?.build) {
      buildCmd = "bun run build"; // prefer bun if available
      console.log(`📦 Detected build script in package.json: "${pkg.scripts.build}"`);
    }
  } catch (e) {}
}

if (buildCmd) {
  console.log(`🔨 Running build command: "${buildCmd}"...`);
  try {
    await $`${{ raw: buildCmd }}`;
    console.log("✅ Build completed successfully.");
  } catch (e) {
    console.error("❌ Build failed:", e);
    process.exit(1);
  }
}

// 4. Trigger deployment
console.log("🌐 Deploying project to Cloudflare...");
try {
  let deployResult = "";
  if (existsSync("wrangler.toml") || existsSync("wrangler.jsonc")) {
    console.log("📦 Found wrangler configuration file. Running standard wrangler deploy...");
    deployResult = await $`bun x wrangler deploy`.text();
  } else if (existsSync("package.json")) {
    // Check if it looks like a static web app
    const outDir = existsSync("dist") ? "dist" : existsSync("build") ? "build" : "";
    if (outDir) {
      console.log(`📂 Found build output directory: "${outDir}". Deploying as Cloudflare Pages...`);
      deployResult = await $`bun x wrangler pages deploy ${outDir}`.text();
    } else {
      console.log("⚠️ No build output directory found. Attempting standard wrangler deploy...");
      deployResult = await $`bun x wrangler deploy`.text();
    }
  }

  console.log(deployResult);

  // 5. Extract deployed URL
  const urlRegex = /https:\/\/[a-zA-Z0-9\-\.]+\.workers\.dev|https:\/\/[a-zA-Z0-9\-\.]+\.pages\.dev/g;
  const urls = deployResult.match(urlRegex);
  
  if (urls && urls.length > 0) {
    // Deduplicate
    const uniqueUrls = Array.from(new Set(urls));
    console.log("\n✨ =================================================== ✨");
    console.log("🎉 DEPLOYMENT SUCCESSFUL!");
    console.log(`🔗 Public Live URL: ${uniqueUrls[0]}`);
    if (uniqueUrls.length > 1) {
      console.log(`🔗 Alternative URLs: ${uniqueUrls.slice(1).join(", ")}`);
    }
    console.log("✨ =================================================== ✨\n");
  } else {
    console.log("\n⚠️ Deployment finished, but no public URL could be parsed from the output.");
  }
} catch (e) {
  console.error("❌ Deployment failed:", e);
  process.exit(1);
}
