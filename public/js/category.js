/* ==========================================
   CREATORBASE
   CATEGORY.JS
========================================== */

let creators = [];

/* ==========================
GET CATEGORY FROM URL
========================== */

const params = new URLSearchParams(window.location.search);

const CATEGORY = params.get("category");

/* ==========================
LOAD
========================== */

async function loadCreators() {

    try {

        const response = await fetch("/api/creators");

        creators = await response.json();

        renderCategory();

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================
RENDER CATEGORY
========================== */

function renderCategory() {

    const title = document.getElementById("categoryTitle");

    const description = document.getElementById("categoryDescription");

    const tbody = document.getElementById("categoryBody");

    if (!tbody) return;

    if (!CATEGORY) {

        title.textContent = "Category";

        description.textContent = "No category selected.";

        return;

    }

    const displayName = {

        streamer: "Streamers",

        youtuber: "YouTubers",

        musician: "Musicians",

        actor: "Actors",

        athlete: "Athletes",

        tiktoker: "TikTokers"

    };

    title.textContent = displayName[CATEGORY] || CATEGORY;

    description.textContent =
        `Browse every ${displayName[CATEGORY] || CATEGORY} in CreatorBase.`;

    tbody.innerHTML = "";

    const categoryCreators = creators

        .filter(c => c.category.toLowerCase() === CATEGORY)

        .sort((a, b) => b.overall - a.overall);

    if (categoryCreators.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td colspan="4">

                    No creators found.

                </td>

            </tr>

        `;

        return;

    }

    categoryCreators.forEach((creator, index) => {

        tbody.innerHTML += `

            <tr>

                <td>${index + 1}</td>

                <td>

                    <a
                        href="creator.html?slug=${creator.slug}"
                        class="creator-link"
                    >

                        ${creator.name}

                    </a>

                </td>

                <td>${creator.country}</td>

                <td>

                    <strong>${creator.overall}</strong>

                </td>

            </tr>

        `;

    });

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