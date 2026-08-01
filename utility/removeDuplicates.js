const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "creators.json");

const creators = JSON.parse(
    fs.readFileSync(filePath, "utf8")
);

const idMap = new Map();
const slugMap = new Map();
const nameMap = new Map();

let duplicateIDs = 0;
let duplicateSlugs = 0;
let duplicateNames = 0;

console.log("\n========== DUPLICATE REPORT ==========\n");

for (const creator of creators) {

    // Duplicate IDs
    if (idMap.has(creator.id)) {

        duplicateIDs++;

        console.log(
            `❌ Duplicate ID ${creator.id}`
        );

        console.log(
            `   ${idMap.get(creator.id).name}`
        );

        console.log(
            `   ${creator.name}\n`
        );

    } else {

        idMap.set(creator.id, creator);

    }

    // Duplicate Slugs
    if (slugMap.has(creator.slug)) {

        duplicateSlugs++;

        console.log(
            `❌ Duplicate Slug "${creator.slug}"`
        );

        console.log(
            `   ${slugMap.get(creator.slug).name}`
        );

        console.log(
            `   ${creator.name}\n`
        );

    } else {

        slugMap.set(creator.slug, creator);

    }

    // Duplicate Names (ignoring spaces/case)
    const cleanName = creator.name
        .toLowerCase()
        .replace(/\s+/g, "");

    if (nameMap.has(cleanName)) {

        duplicateNames++;

        console.log(
            `⚠ Similar Name`
        );

        console.log(
            `   ${nameMap.get(cleanName).name}`
        );

        console.log(
            `   ${creator.name}\n`
        );

    } else {

        nameMap.set(cleanName, creator);

    }

}

console.log("==================================");
console.log(`Creators: ${creators.length}`);
console.log(`Duplicate IDs: ${duplicateIDs}`);
console.log(`Duplicate Slugs: ${duplicateSlugs}`);
console.log(`Similar Names: ${duplicateNames}`);
console.log("==================================");