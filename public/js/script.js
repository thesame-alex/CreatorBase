/* ==========================================
   CREATORBASE
   SCRIPT.JS
========================================== */

/* ========= DATABASE ========= */

const database = {

    categories: [

        {
            name: "Streamers",
            description: "Live creators across Twitch, Kick and YouTube Live.",
            count: 0
        },

        {
            name: "YouTubers",
            description: "Entertainment, education and gaming creators.",
            count: 0
        },

        {
            name: "Musicians",
            description: "Artists from every major platform.",
            count: 0
        },

        {
            name: "Actors",
            description: "Film and television personalities.",
            count: 0
        },

        {
            name: "TikTokers",
            description: "Short-form content creators.",
            count: 0
        },

        {
            name: "Athletes",
            description: "Sports personalities worldwide.",
            count: 0
        }

    ],

  creators: []
};

/* ========= LOAD DATABASE ========= */

async function loadDatabase() {

    try {

        const response = await fetch("/api/creators");

        database.creators = await response.json();

        console.log("Creators loaded:", database.creators);

    }

    catch (error) {

        console.error("Failed to load creators:", error);

    }

}

/* ========= LOAD PAGE ========= */

document.addEventListener("DOMContentLoaded", async () => {

    await loadDatabase();

    buildCategories();

    buildTrending();

    buildRecent();

    buildLeaderboard();

    initializeTheme();

});



/* ========= CATEGORIES ========= */
function buildCategories() {

    const container = document.getElementById("categories");

    if (!container) return;

    container.innerHTML = "";

    database.categories.forEach(category => {

        const slug = {
            "Streamers": "streamer",
            "YouTubers": "youtuber",
            "Musicians": "musician",
            "Actors": "actor",
            "Athletes": "athlete",
            "TikTokers": "tiktoker"
        }[category.name];

        const count = database.creators.filter(
            c => c.category === slug
        ).length;

        container.innerHTML += `

            <a
                href="category.html?category=${slug}"
                class="category-card"
            >

                <h3>${category.name}</h3>

                <p>${category.description}</p>

                <strong>${count} Creators</strong>

            </a>

        `;

    });

}

/* ========= TRENDING ========= */

function buildTrending(){

    const container=document.getElementById("trendingCreators");

    if (!container) return;

    container.innerHTML="";

    const creators=[...database.creators]

    .sort((a,b)=>b.overall-a.overall)

    .slice(0,5);

    creators.forEach(creator=>{

        container.innerHTML+=`

            <div class="creator-item">

                <span>${creator.name}</span>

                <strong>${creator.overall}</strong>

            </div>

        `;

    });

}



/* ========= RECENT ========= */

function buildRecent(){

    const container = document.getElementById("recentUpdates");

if (!container) return;

container.innerHTML = "";

    database.creators

    .slice(0,5)

    .forEach(creator=>{

        container.innerHTML+=`

            <div class="creator-item">

                <span>${creator.name}</span>

                <small>Recently Updated</small>

            </div>

        `;

    });

}



/* ========= LEADERBOARD ========= */

function buildLeaderboard(){

    const tbody = document.getElementById("leaderboardBody");

if (!tbody) return;

tbody.innerHTML = "";

  const sorted = [...database.creators]
    .sort((a, b) => b.overall - a.overall)
    .slice(0, 50);

sorted.forEach((creator, index) => {

        tbody.innerHTML+=`

        <tr>

            <td>${index+1}</td>

            <td>
    <a
        href="creator.html?slug=${creator.slug}"
        class="creator-link"
    >
        ${creator.name}
    </a>
</td>

            <td>${creator.category}</td>

            <td>${creator.overall}</td>

        </tr>

        `;

    });

}



/* ========= SEARCH ========= */

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");

if (searchInput) {

    searchInput.addEventListener("input", showSuggestions);

    searchInput.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {

            searchCreators();

        }

    });

}

if (searchButton) {

    searchButton.addEventListener("click", searchCreators);

}

function showSuggestions() {

    const query = searchInput.value
        .toLowerCase()
        .trim();

    searchResults.innerHTML = "";

    if (!query) {

        searchResults.style.display = "none";

        return;

    }

    const matches = database.creators.filter(c =>

        c.name.toLowerCase().includes(query)

    );

    matches.slice(0, 8).forEach(creator => {

        const div = document.createElement("div");

        div.className = "search-result";

        div.textContent = creator.name;

        div.onclick = () => {

            window.location.href =
                `creator.html?slug=${creator.slug}`;

        };

        searchResults.appendChild(div);

    });

    searchResults.style.display =
        matches.length ? "block" : "none";

}

function searchCreators() {

    const query = searchInput.value
        .toLowerCase()
        .trim();

    const creator = database.creators.find(c =>

        c.name.toLowerCase() === query ||

        c.slug.toLowerCase() === query

    );

    if (creator) {

        window.location.href =
            `creator.html?slug=${creator.slug}`;

    }

    else {

        alert("Creator not found.");

    }

}

document.addEventListener("click", e => {

    if (

        !searchInput.contains(e.target) &&

        !searchResults.contains(e.target)

    ) {

        searchResults.style.display = "none";

    }

});


/* ========= THEME ========= */

function initializeTheme(){

    const button=document.getElementById("themeToggle");

    if(!button) return;

    if(localStorage.getItem("theme")==="light"){

        document.body.classList.add("light");

        button.textContent="☀️";

    }

    button.onclick=()=>{

        document.body.classList.toggle("light");

        const light=document.body.classList.contains("light");

        button.textContent=light ? "☀️" : "🌙";

        localStorage.setItem(

            "theme",

            light ? "light" : "dark"

        );

    };

}