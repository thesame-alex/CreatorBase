const express = require("express");
const path = require("path");
const fs = require("fs");
const { calculateOverall } = require("./utility/ratingEngine");

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Helper function to read creators.json
function getCreators() {
    const data = fs.readFileSync(
        path.join(__dirname, "data", "creators.json"),
        "utf8"
    );

    return JSON.parse(data);
}

function getStatTemplates() {

    const data = fs.readFileSync(
        path.join(__dirname, "data", "statTemplates.json"),
        "utf8"
    );

    return JSON.parse(data);

}
// =============================
// GET SUBCATEGORIES
// =============================

function getCategoryTemplates() {

    const data = fs.readFileSync(

        path.join(__dirname, "data", "categoryTemplates.json"),

        "utf8"

    );

    return JSON.parse(data);

}
function saveCategoryTemplates(data) {

    fs.writeFileSync(

        path.join(__dirname, "data", "categoryTemplates.json"),

        JSON.stringify(data, null, 2)

    );

}

function saveStatTemplates(data) {

    fs.writeFileSync(

        path.join(__dirname, "data", "statTemplates.json"),

        JSON.stringify(data, null, 2)

    );

}

app.get("/api/subcategories/:category", (req, res) => {

    const templates = getCategoryTemplates();

    const subcategories = templates[req.params.category];

    if (!subcategories) {

        return res.status(404).json({
            error: "Category not found"
        });

    }

    res.json(subcategories);

});
// =============================
// GET COUNTRIES
// =============================

function getCountries() {

    const data = fs.readFileSync(

        path.join(__dirname, "data", "countries.json"),

        "utf8"

    );

    return JSON.parse(data);

}

app.get("/api/countries", (req, res) => {

    res.json(getCountries());

});
// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API: Get all creators
app.get("/api/creators", (req, res) => {
    const creators = getCreators();

    res.json(creators);
});

// API: Get creator by slug
app.get("/api/creator/:slug", (req, res) => {

    const creators = getCreators();

    const creator = creators.find(
        c => c.slug === req.params.slug
    );

    if (!creator) {

        return res.status(404).json({
            error: "Creator not found"
        });

    }

    res.json(creator);

});

// =============================
// COMPARE TWO CREATORS
// =============================

app.get("/api/compare", (req, res) => {

    const creators = getCreators();

    function normalize(text) {

        return text
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");

    }

    const firstQuery = normalize(req.query.first || "");
    const secondQuery = normalize(req.query.second || "");

    const creatorOne = creators.find(c =>

        normalize(c.name) === firstQuery ||
        normalize(c.slug) === firstQuery

    );

    const creatorTwo = creators.find(c =>

        normalize(c.name) === secondQuery ||
        normalize(c.slug) === secondQuery

    );

    if (!creatorOne || !creatorTwo) {

        return res.status(404).json({

            error: "One or both creators not found."

        });

    }

    res.json({

        first: creatorOne,
        second: creatorTwo

    });

});
// API: Search creators
app.get("/api/search", (req, res) => {

    const q = (req.query.q || "").toLowerCase();

    const creators = getCreators();

    const results = creators.filter(c =>
        c.name.toLowerCase().includes(q)
    );

    res.json(results);

});
// =============================
// COMPARE TWO CREATORS
// =============================

app.get("/api/compare", (req, res) => {

    const { first, second } = req.query;

    if (!first || !second) {

        return res.status(400).json({

            error: "Both creators are required."

        });

    }

    const creators = getCreators();

    const creatorOne = creators.find(
        c => c.slug === first
    );

    const creatorTwo = creators.find(
        c => c.slug === second
    );

    if (!creatorOne || !creatorTwo) {

        return res.status(404).json({

            error: "One or both creators not found."

        });

    }
    if (creatorOne.category !== creatorTwo.category) {

    return res.status(400).json({

        error: "Creators must be in the same category."

    });

}

    res.json({

        first: creatorOne,
        second: creatorTwo

    });

});

// API: Search creators
app.get("/api/search", (req, res) => {
    const q = (req.query.q || "").toLowerCase();

    const creators = getCreators();

    const results = creators.filter(c =>
        c.name.toLowerCase().includes(q)
    );

    res.json(results);
});

// =============================
// CREATE NEW CREATOR
// =============================
// =============================
// GET STAT TEMPLATE
// =============================

app.get("/api/stat-template/:category", (req, res) => {

    const templates = getStatTemplates();

    console.log("Category requested:", req.params.category);
    console.log("Templates object:", templates);
    console.log("Available keys:", Object.keys(templates));

    const stats = templates[req.params.category];

    if (!stats) {
        return res.status(404).json({
            error: "Category not found"
        });
    }

    res.json(stats);

});
app.post("/api/creators", (req, res) => {

    const creators = getCreators();

const creator = req.body;

if (!creator.name || !creator.name.trim()) {

    return res.status(400).json({

        error: "Creator name is required."

    });

}

const creatorSlug = creator.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const existingCreator = creators.find(
    c => c.slug === creatorSlug
);

if (existingCreator) {

    return res.status(409).json({

        success: false,

        error: "A creator with that name already exists."

    });

}

    if (!creator.country || !creator.country.trim()) {

    return res.status(400).json({

        error: "Country is required."

    });

}

    creator.overall = calculateOverall(

    creator.category,

    creator.stats

);

   creator.id = creators.length
    ? Math.max(...creators.map(c => c.id)) + 1
    : 1;

    creator.slug = creatorSlug;
    creator.metadata = {

        verified: false,

        featured: false,

        createdAt: new Date().toISOString()

    };

    creators.push(creator);

    fs.writeFileSync(

        path.join(__dirname, "data", "creators.json"),

        JSON.stringify(creators, null, 2)

    );

    res.json({

        success: true,

        creator

    });

});

app.listen(PORT, () => {
    console.log(`🚀 CreatorBase running at http://localhost:${PORT}`);
});