const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "data", "creators.json");

const creators = JSON.parse(
    fs.readFileSync(file, "utf8")
);

const used = new Set();

function slugify(text){

    return text

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g,"")

        .toLowerCase()

        .replace(/[^a-z0-9]+/g,"-")

        .replace(/^-+|-+$/g,"");

}

for(const creator of creators){

    let slug = slugify(creator.name);

    let count = 2;

    while(used.has(slug)){

        slug = `${slugify(creator.name)}-${count}`;

        count++;

    }

    creator.slug = slug;

    used.add(slug);

}

fs.writeFileSync(

    file,

    JSON.stringify(creators,null,2)

);

console.log(`✅ Generated ${creators.length} unique slugs.`);