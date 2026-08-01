const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "creators.json");

const creators = JSON.parse(
    fs.readFileSync(filePath, "utf8")
);

const overallDistribution = {};
const categoryTotals = {};
const categoryCounts = {};

let highest = creators[0];
let lowest = creators[0];
let totalOverall = 0;

for (const creator of creators) {

    // Overall Distribution
    overallDistribution[creator.overall] =
        (overallDistribution[creator.overall] || 0) + 1;

    // Highest
    if (creator.overall > highest.overall) {
        highest = creator;
    }

    // Lowest
    if (creator.overall < lowest.overall) {
        lowest = creator;
    }

    // Average
    totalOverall += creator.overall;

    // Category Average
    if (!categoryTotals[creator.category]) {

        categoryTotals[creator.category] = 0;
        categoryCounts[creator.category] = 0;

    }

    categoryTotals[creator.category] += creator.overall;
    categoryCounts[creator.category]++;

}

console.log("\n========== CREATORBASE RATING REPORT ==========\n");

// Distribution
console.log("Overall Distribution\n");

Object.keys(overallDistribution)
    .sort((a, b) => b - a)
    .forEach(score => {

        console.log(
            `${score.padStart(2, " ")} : ${overallDistribution[score]}`
        );

    });

console.log("\n---------------------------------------\n");

console.log("Highest Rated");
console.log(
    `${highest.name} (${highest.overall})`
);

console.log("\nLowest Rated");
console.log(
    `${lowest.name} (${lowest.overall})`
);

console.log("\nAverage Overall");
console.log(
    (totalOverall / creators.length).toFixed(2)
);

console.log("\n---------------------------------------\n");

console.log("Category Averages\n");

Object.keys(categoryTotals)
    .sort()
    .forEach(category => {

        const avg =
            categoryTotals[category] /
            categoryCounts[category];

        console.log(
            `${category.padEnd(12)} ${avg.toFixed(2)}`
        );

    });

console.log("\n==============================================\n");