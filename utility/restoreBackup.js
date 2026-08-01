const fs = require("fs");
const path = require("path");

const backupFolder = path.join(__dirname, "..", "backups");
const dataFile = path.join(__dirname, "..", "data", "creators.json");

// Get all backup files
const backups = fs.readdirSync(backupFolder)
    .filter(file => file.endsWith(".json"))
    .sort();

if (backups.length === 0) {
    console.log("❌ No backups found.");
    process.exit(0);
}

// Use latest backup
const latestBackup = backups[backups.length - 1];

const backupPath = path.join(
    backupFolder,
    latestBackup
);

// Restore
fs.copyFileSync(
    backupPath,
    dataFile
);

console.log("✅ Database restored successfully.");
console.log(`Backup used: ${latestBackup}`);