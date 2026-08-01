const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "creators.json");

const creators = JSON.parse(
    fs.readFileSync(filePath, "utf8")
);

const categoryMap = {

    // STREAMERS
    "Kai Cenat": ["streamer", "variety"],
    "IShowSpeed": ["streamer", "gaming"],
    "xQc": ["streamer", "variety"],
    "Jynxzi": ["streamer", "gaming"],
    "CaseOh": ["streamer", "gaming"],
    "Adin Ross": ["streamer", "variety"],
    "PlaqueBoyMax": ["streamer", "music"],
    "Shanks Comics": ["streamer", "variety"],

    // YOUTUBERS
    "MrBeast": ["youtuber", "entertainment"],
    "Mark Rober": ["youtuber", "science"],
    "MKBHD": ["youtuber", "technology"],
    "Emma Chamberlain": ["youtuber", "lifestyle"],
    "James Charles": ["youtuber", "beauty"],
    "David Dobrik": ["youtuber", "vlogs"],
    "Calfreezy": ["youtuber", "gaming"],
    "Jeremy Fragrance": ["youtuber", "fragrance"],

    // PODCASTERS
    "Joe Rogan": ["podcaster", "mma"],
    "Lex Fridman": ["podcaster", "technology"],
    "Theo Von": ["podcaster", "comedy"],
    "Andrew Schulz": ["podcaster", "comedy"],
    "Chris Williamson": ["podcaster", "self-improvement"],
    "Steven Bartlett": ["podcaster", "business"],

    // COMEDIANS
    "Twyse": ["comedian", "skits"],
    "Sabinus": ["comedian", "skits"],
    "Broda Shaggi": ["comedian", "skits"],
    "Brain Jotter": ["comedian", "skits"],
    "Taaooma": ["comedian", "skits"],
    "Mr Macaroni": ["comedian", "skits"],
    "Basketmouth": ["comedian", "stand-up"],
    "Bovi": ["comedian", "stand-up"],
    "AY Makun": ["comedian", "stand-up"],

    // TIKTOKERS
    "VeryDarkMan": ["tiktoker", "commentary"],
    "Sophie Rain": ["tiktoker", "lifestyle"],
    "Nara Smith": ["tiktoker", "lifestyle"],
    "Livvy Dunne": ["tiktoker", "sports"],
    "Hairbie_1": ["tiktoker", "fashion"],

    // MUSICIANS
    "KSI": ["musician", "rap"],
    "Drake": ["musician", "rap"],
    "Burna Boy": ["musician", "afrobeats"],
    "Davido": ["musician", "afrobeats"],
    "Wizkid": ["musician", "afrobeats"],
    "Taylor Swift": ["musician", "pop"],
    "The Weeknd": ["musician", "rnb"]

};

let updated = 0;

for (const creator of creators) {

    const match = categoryMap[creator.name];

    if (!match) continue;

    creator.category = match[0];
    creator.subcategory = match[1];

    updated++;

}

fs.writeFileSync(
    filePath,
    JSON.stringify(creators, null, 2)
);

console.log(`✅ Updated ${updated} creators.`);