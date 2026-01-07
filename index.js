#!/usr/bin/env node
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

const log = console.log;

// Fix for Windows path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const projectName = process.argv[2];

    if (!projectName) {
        log(chalk.red("❌ Please provide a project name."));
        log(chalk.white("Example: create-myreactapp myproject"));
        process.exit(1);
    }

    const templateDir = path.join(__dirname, "template");
    const targetDir = path.join(process.cwd(), projectName);

    // Check if template folder exists
    if (!fs.existsSync(templateDir)) {
        log(chalk.red(`❌ Template folder not found at: ${templateDir}`));
        process.exit(1);
    }

    // Prevent overwriting existing folder
    if (fs.existsSync(targetDir)) {
        log(chalk.red(`❌ Folder "${projectName}" already exists.`));
        process.exit(1);
    }

    // Step 1: Copy project files
    log(chalk.cyan(`📦 Creating project in ${targetDir} ...`));
    await fs.copy(templateDir, targetDir);

    // Step 2: Install dependencies
    process.chdir(targetDir);
    log(chalk.yellow("📥 Installing dependencies... (this may take a moment)"));
    try {
        await execa("npm", ["install"], { stdio: "inherit" });
    } catch (err) {
        log(chalk.red("❌ Failed to install dependencies."));
        log(err);
        process.exit(1);
    }

    // Step 3: Done message
    log(chalk.green("\n✅ All done! Your React + Vite + Tailwind app is ready."));
    log(chalk.white(`\nNext steps:`));
    log(chalk.white(`  cd ${projectName}`));
    log(chalk.white(`  npm run dev`));
    log(chalk.green("\n🚀 Happy Coding!"));
}

main();
