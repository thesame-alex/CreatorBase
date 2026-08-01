const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "creators.json");

const creators = JSON.parse(
    fs.readFileSync(filePath, "utf8")
);

const ids = new Set();
const slugs = new Set();

const validCategories = [
    "streamer",
    "youtuber",
    "musician",
    "actor",
    "athlete",
    "tiktoker",
    "creator",
    "comedian",
    "podcaster"
];

let errors = 0;
let warnings = 0;

console.log("\n========== CREATORBASE DATABASE REPORT ==========\n");

for (const creator of creators) {

    // ID
    if (ids.has(creator.id)) {
        console.log(`❌ Duplicate ID: ${creator.id} (${creator.name})`);
        errors++;
    } else {
        ids.add(creator.id);
    }

    // SLUG
    if (slugs.has(creator.slug)) {
        console.log(`❌ Duplicate Slug: ${creator.slug}`);
        errors++;
    } else {
        slugs.add(creator.slug);
    }

    // NAME
    if (!creator.name) {
        console.log(`❌ Missing Name (ID ${creator.id})`);
        errors++;
    }

    // CATEGORY
    if (!validCategories.includes(
        String(creator.category).toLowerCase()
    )) {

        console.log(
            `❌ Invalid Category (${creator.name}) : ${creator.category}`
        );

        errors++;
    }

    // COUNTRY
    if (!creator.country) {

        console.log(
            `⚠ Missing Country (${creator.name})`
        );

        warnings++;
    }

    // OVERALL
    if (typeof creator.overall !== "number") {

        console.log(
            `❌ Invalid Overall (${creator.name})`
        );

        errors++;

    } else {

        if (creator.overall > 93) {

            console.log(
                `⚠ Overall above cap (${creator.name}) : ${creator.overall}`
            );

            warnings++;

        }

        if (creator.overall < 50) {

            console.log(
                `⚠ Very low Overall (${creator.name}) : ${creator.overall}`
            );

            warnings++;

        }

    }

    // STATS
    if (!creator.stats) {

        console.log(
            `❌ Missing Stats (${creator.name})`
        );

        errors++;

    } else {

        const values = Object.values(creator.stats);

        if (values.length !== 6) {

            console.log(
                `⚠ ${creator.name} has ${values.length} stats`
            );

            warnings++;

        }

        for (const value of values) {

            if (
                typeof value !== "number" ||
                value < 1 ||
                value > 99
            ) {

                console.log(
                    `❌ Invalid stat on ${creator.name}`
                );

                errors++;
                break;

            }

        }

    }

    // METADATA
    if (!creator.metadata) {

        console.log(
            `⚠ Missing Metadata (${creator.name})`
        );

        warnings++;

    }

}

console.log("\n========================================");
console.log(`Creators Checked : ${creators.length}`);
console.log(`Errors           : ${errors}`);
console.log(`Warnings         : ${warnings}`);
console.log("========================================\n");