const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "creators.json");

const creators = JSON.parse(
    fs.readFileSync(filePath, "utf8")
);

for (const creator of creators) {

    // Compress Overall
    if (typeof creator.overall === "number") {

        const o = creator.overall;

        if (o >= 98) creator.overall = 93;
        else if (o === 97) creator.overall = 92;
        else if (o === 96) creator.overall = 91;
        else if (o === 95) creator.overall = 89;
        else if (o === 94) creator.overall = 88;
        else if (o === 93) creator.overall = 87;
        else if (o === 92) creator.overall = 86;
        else if (o === 91) creator.overall = 85;
        else if (o === 90) creator.overall = 84;
        else if (o === 89) creator.overall = 83;
        else if (o === 88) creator.overall = 82;
        else if (o === 87) creator.overall = 81;
        else if (o === 86) creator.overall = 80;
        else if (o === 85) creator.overall = 79;
        else if (o === 84) creator.overall = 78;
        else if (o === 83) creator.overall = 77;
        else if (o === 82) creator.overall = 76;
        else if (o === 81) creator.overall = 75;
        else if (o === 80) creator.overall = 74;
    }

    // Compress Stats
    if (creator.stats) {

        for (const stat in creator.stats) {

            let s = creator.stats[stat];

            if (typeof s !== "number") continue;

            if (s >= 98) s = 95;
            else if (s === 97) s = 94;
            else if (s === 96) s = 93;
            else if (s === 95) s = 92;
            else if (s === 94) s = 91;
            else if (s === 93) s = 90;
            else if (s === 92) s = 89;
            else if (s === 91) s = 88;
            else if (s === 90) s = 87;
            else if (s === 89) s = 86;
            else if (s === 88) s = 85;

            creator.stats[stat] = s;

        }

    }

}

fs.writeFileSync(
    filePath,
    JSON.stringify(creators, null, 2)
);

console.log("✅ Ratings compressed successfully.");