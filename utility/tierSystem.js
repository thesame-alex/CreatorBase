const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "data", "creators.json");

const creators = JSON.parse(
    fs.readFileSync(file, "utf8")
);

/*
    TIER TABLE

    GOAT        92-93
    LEGEND      90-91
    ELITE       87-89
    WORLDCLASS  84-86
    EXCELLENT   81-83
    GREAT       78-80
    GOOD        74-77
    AVERAGE     68-73
    BELOW       55-67
*/

function average(stats){

    const values = Object.values(stats);

    return values.reduce(
        (a,b)=>a+b,
        0
    ) / values.length;

}

function tierFromAverage(avg){

    if(avg >= 96)
        return [92,93];

    if(avg >= 93)
        return [90,91];

    if(avg >= 89)
        return [87,89];

    if(avg >= 85)
        return [84,86];

    if(avg >= 81)
        return [81,83];

    if(avg >= 77)
        return [78,80];

    if(avg >= 72)
        return [74,77];

    if(avg >= 65)
        return [68,73];

    return [55,67];

}

for(const creator of creators){

    const avg = average(
        creator.stats
    );

    const [min,max] =
        tierFromAverage(avg);

    creator.overall =
        Math.round(
            (min+max)/2
        );

}

fs.writeFileSync(
    file,
    JSON.stringify(creators,null,2)
);

console.log("✅ Overall ratings regenerated.");