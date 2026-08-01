const fs = require("fs");
const path = require("path");

const source = path.join(__dirname, "..", "data", "creators.json");

const backupFolder = path.join(__dirname, "..", "backups");

if (!fs.existsSync(backupFolder)) {

    fs.mkdirSync(backupFolder);

}

const now = new Date();

const timestamp = `${now.getFullYear()}-${
String(now.getMonth() + 1).padStart(2, "0")
}-${
String(now.getDate()).padStart(2, "0")
}_${
String(now.getHours()).padStart(2, "0")
}-${
String(now.getMinutes()).padStart(2, "0")
}-${
String(now.getSeconds()).padStart(2, "0")
}`;

const destination = path.join(

    backupFolder,

    `creators_${timestamp}.json`

);

fs.copyFileSync(source, destination);

console.log("✅ Backup created:");
console.log(destination);