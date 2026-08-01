/* ==========================================
   CREATORBASE
   RANKINGS.JS
========================================== */

let creators = [];
let filteredCreators = [];

let currentSort = "overall";
let ascending = false;

/* ==========================
LOAD CREATORS
========================== */

async function loadCreators() {

    try {

        const response = await fetch("/api/creators");

        creators = await response.json();

        filteredCreators = [...creators];

        populateFilters();

        applyFilters();

    }

    catch (error) {

        console.error(error);

    }

}

/* ==========================
POPULATE FILTERS
========================== */

function populateFilters() {

    const categoryFilter =
        document.getElementById("categoryFilter");

    const countryFilter =
        document.getElementById("countryFilter");

    const categories = [

        ...new Set(

            creators.map(c => c.category)

        )

    ].sort();

    const countries = [

        ...new Set(

            creators.map(c => c.country)

        )

    ].sort();

    categories.forEach(category => {

        categoryFilter.innerHTML += `

            <option value="${category}">

                ${capitalize(category)}

            </option>

        `;

    });

    countries.forEach(country => {

        countryFilter.innerHTML += `

            <option value="${country}">

                ${country}

            </option>

        `;

    });

}

/* ==========================
FILTER
========================== */

function applyFilters() {

    const search = document
        .getElementById("rankingSearch")
        .value
        .toLowerCase()
        .trim();

    const category =
        document.getElementById("categoryFilter").value;

    const country =
        document.getElementById("countryFilter").value;

    const verified =
        document.getElementById("verifiedFilter").value;

    filteredCreators = creators.filter(c => {

        const matchesSearch =

            c.name.toLowerCase().includes(search);

        const matchesCategory =

            category === "all" ||

            c.category === category;

        const matchesCountry =

            country === "all" ||

            c.country === country;

        const matchesVerified =

            verified === "all" ||

            (

                verified === "verified"

                    ? c.metadata?.verified

                    : !c.metadata?.verified

            );

        return (

            matchesSearch &&

            matchesCategory &&

            matchesCountry &&

            matchesVerified

        );

    });

    sortCreators();

    renderRankings();

}
/* ==========================
SORTING
========================== */

function sortCreators() {

    filteredCreators.sort((a, b) => {

        let valueA;
        let valueB;

        switch (currentSort) {

            case "name":

                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
                break;

            case "category":

                valueA = a.category.toLowerCase();
                valueB = b.category.toLowerCase();
                break;

            case "country":

                valueA = a.country.toLowerCase();
                valueB = b.country.toLowerCase();
                break;

            default:

                valueA = a.overall;
                valueB = b.overall;

        }

        if (typeof valueA === "string") {

            return ascending

                ? valueA.localeCompare(valueB)

                : valueB.localeCompare(valueA);

        }

        return ascending

            ? valueA - valueB

            : valueB - valueA;

    });

}

/* ==========================
RENDER TABLE
========================== */

function renderRankings() {

    const tbody =
        document.getElementById("rankingsBody");

    tbody.innerHTML = "";

    filteredCreators
    .slice(0, 100)
    .forEach((creator, index) => {

        tbody.innerHTML += `

            <tr>

                <td>

                    ${index + 1}

                </td>

                <td>

                    <a
                        href="creator.html?slug=${creator.slug}"
                        class="creator-link"
                    >

                        ${creator.name}

                    </a>

                </td>

                <td>

                    ${capitalize(creator.category)}

                </td>

                <td>

                    ${creator.country}

                </td>

                <td>

                    <strong>

                        ${creator.overall}

                    </strong>

                </td>

            </tr>

        `;

    });

    document.getElementById("creatorCount").textContent =

        `${filteredCreators.length} Creator${filteredCreators.length === 1 ? "" : "s"}`;

}

/* ==========================
HELPERS
========================== */

function capitalize(text){

    return text.charAt(0).toUpperCase() +

        text.slice(1);

}

/* ==========================
THEME
========================== */

function initializeTheme(){

    const button =
        document.getElementById("themeToggle");

    if(!button) return;

    if(localStorage.getItem("theme")==="light"){

        document.body.classList.add("light");

        button.textContent="☀️";

    }

    button.onclick=()=>{

        document.body.classList.toggle("light");

        const light =

            document.body.classList.contains("light");

        button.textContent =

            light ? "☀️" : "🌙";

        localStorage.setItem(

            "theme",

            light ? "light" : "dark"

        );

    };

}
/* ==========================
EVENTS
========================== */

window.addEventListener("DOMContentLoaded", () => {

    initializeTheme();

    loadCreators();

    document
        .getElementById("rankingSearch")
        .addEventListener("input", applyFilters);

    document
        .getElementById("categoryFilter")
        .addEventListener("change", applyFilters);

    document
        .getElementById("countryFilter")
        .addEventListener("change", applyFilters);

    document
        .getElementById("verifiedFilter")
        .addEventListener("change", applyFilters);

    document.getElementById("sortName").addEventListener("click", () => {

        currentSort = "name";
        ascending = !ascending;

        sortCreators();
        renderRankings();

    });

    document.getElementById("sortCategory").addEventListener("click", () => {

        currentSort = "category";
        ascending = !ascending;

        sortCreators();
        renderRankings();

    });

    document.getElementById("sortCountry").addEventListener("click", () => {

        currentSort = "country";
        ascending = !ascending;

        sortCreators();
        renderRankings();

    });

    document.getElementById("sortOverall").addEventListener("click", () => {

        currentSort = "overall";
        ascending = !ascending;

        sortCreators();
        renderRankings();

    });

});