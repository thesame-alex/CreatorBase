/* ==========================================
   CREATORBASE
   CATEGORIES.JS
========================================== */

let creators = [];

/* ==========================
LOAD CREATORS
========================== */

async function loadCreators() {

    try {

        const response = await fetch("/api/creators");

        creators = await response.json();

        renderCategories();

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================
RENDER CATEGORIES
========================== */

function renderCategories() {

    const grid = document.getElementById("categoriesGrid");

    grid.innerHTML = "";

    const categories = {};

    creators.forEach(creator => {

        if (!categories[creator.category]) {

            categories[creator.category] = [];

        }

        categories[creator.category].push(creator);

    });

    Object.entries(categories).forEach(([category, list]) => {

        const average = Math.round(

            list.reduce(

                (sum, creator) => sum + creator.overall,

                0

            ) / list.length

        );

        const topCreator = [...list]

            .sort((a, b) => b.overall - a.overall)[0];

        const card = document.createElement("div");

        card.className = "category-card";

        card.innerHTML = `

            <h3>

                ${capitalize(category)}

            </h3>

            <p>

                ${list.length} Creator${list.length !== 1 ? "s" : ""}

            </p>

            <p>

                Average Rating: <strong>${average}</strong>

            </p>

            <p>

                Top Creator:

                <strong>${topCreator.name}</strong>

            </p>

            <br>

            <button class="categoryButton">

                Explore

            </button>

        `;

        card.querySelector("button").onclick = () => {

            window.location.href =
                `rankings.html?category=${encodeURIComponent(category)}`;

        };

        grid.appendChild(card);

    });

}

/* ==========================
HELPERS
========================== */

function capitalize(text) {

    return text.charAt(0).toUpperCase() +

        text.slice(1);

}

/* ==========================
THEME
========================== */

function initializeTheme() {

    const button = document.getElementById("themeToggle");

    if (!button) return;

    if (localStorage.getItem("theme") === "light") {

        document.body.classList.add("light");

        button.textContent = "☀️";

    }

    button.onclick = () => {

        document.body.classList.toggle("light");

        const light = document.body.classList.contains("light");

        button.textContent = light ? "☀️" : "🌙";

        localStorage.setItem(

            "theme",

            light ? "light" : "dark"

        );

    };

}

/* ==========================
START
========================== */

window.addEventListener("DOMContentLoaded", () => {

    initializeTheme();

    loadCreators();

});