/* ==========================================
   CREATORBASE BATTLE MODE
========================================== */

let creators = [];
let radarChart = null;

/* ===========================
LOAD DATABASE
=========================== */

async function loadCreators() {

    const response = await fetch("/api/creators");

    creators = await response.json();

    loadCategories();

}

/* ===========================
LOAD CATEGORIES
=========================== */

function loadCategories() {

    const select = document.getElementById("battleCategory");

    const categories = [
        ...new Set(creators.map(c => c.category))
    ].sort();

    categories.forEach(category => {

        const option = document.createElement("option");

        option.value = category;

        option.textContent =
            category.charAt(0).toUpperCase() +
            category.slice(1);

        select.appendChild(option);

    });

}

/* ===========================
AUTOCOMPLETE
=========================== */

function setupAutocomplete(inputId, resultsId) {

    const input = document.getElementById(inputId);

    const results = document.getElementById(resultsId);

    input.addEventListener("input", () => {

        const query = input.value.trim().toLowerCase();

        results.innerHTML = "";

        if (!query) {

            results.style.display = "none";

            return;

        }

        const category =
            document.getElementById("battleCategory").value;

        if (!category) {

            results.style.display = "none";

            return;

        }

        const matches = creators

        .filter(c =>

            c.category === category &&

            (

                c.name.toLowerCase().includes(query) ||

                c.slug.toLowerCase().includes(query)

            )

        )

        .sort((a,b)=>a.name.localeCompare(b.name))

        .slice(0,8);

        if (!matches.length) {

            results.style.display = "none";

            return;

        }

        matches.forEach(creator=>{

            const item = document.createElement("div");

            item.className = "search-result";

            item.textContent = creator.name;

            item.onclick = ()=>{

                input.value = creator.name;

                results.style.display = "none";

            };

            results.appendChild(item);

        });

        results.style.display = "block";

    });

}

/* ===========================
GET CREATOR
=========================== */

function getCreator(name){

    return creators.find(c=>

        c.name.toLowerCase() ===
        name.toLowerCase()

    );

}

/* ===========================
START BATTLE
=========================== */

function startBattle(){

    const category =
        document.getElementById("battleCategory").value;

    if(!category){

        alert("Choose a category first.");

        return;

    }

    const first =
        getCreator(
            document.getElementById("creatorOne").value
        );

    const second =
        getCreator(
            document.getElementById("creatorTwo").value
        );

    if(!first || !second){

        alert("Choose two creators.");

        return;

    }

    if(first.slug === second.slug){

        alert("Choose two different creators.");

        return;

    }

    document.getElementById("leftName").textContent =
        first.name;

    document.getElementById("rightName").textContent =
        second.name;

    drawRadar(first,second);

    buildTable(first,second);

}
/* ==========================================
   RADAR CHART
========================================== */

function drawRadar(first, second) {

    const labels = Object.keys(first.stats);

    const firstStats = labels.map(label => first.stats[label]);

    const secondStats = labels.map(label => second.stats[label]);

    const canvas = document.getElementById("battleRadar");

    if (radarChart) {

        radarChart.destroy();

    }

    radarChart = new Chart(canvas, {

        type: "radar",

        data: {

            labels: labels,

            datasets: [

                {

                    label: first.name,

                    data: firstStats,

                    borderColor: "#3b82f6",

                    backgroundColor: "rgba(59,130,246,.20)",

                    pointBackgroundColor: "#3b82f6",

                    pointRadius: 4,

                    borderWidth: 3,

                    fill: true

                },

                {

                    label: second.name,

                    data: secondStats,

                    borderColor: "#f59e0b",

                    backgroundColor: "rgba(245,158,11,.20)",

                    pointBackgroundColor: "#f59e0b",

                    pointRadius: 4,

                    borderWidth: 3,

                    fill: true

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            animation: {

                duration: 700

            },

           plugins: {

    legend: {

        display: false

    }

},

            scales: {

                r: {

                    min: 0,

                    max: 100,

                    ticks: {

                        stepSize: 20,

                        backdropColor: "transparent",

                        color: "#888"

                    },

                    grid: {

                        color: "rgba(255,255,255,.12)"

                    },

                    angleLines: {

                        color: "rgba(255,255,255,.12)"

                    },

                   pointLabels: {

    color: document.body.classList.contains("light-mode")
        ? "#111827"
        : "#ffffff",

                        font: {

                            size: 14,

                            weight: "bold"

                        }

                    }

                }

            }

        }

    });

}
/* ==========================================
   COMPARISON TABLE
========================================== */

function buildTable(first, second) {

    const stats = Object.keys(first.stats);

    const head = document.getElementById("tableHead");
    const body = document.getElementById("tableBody");

    head.innerHTML = "<th>Creator</th>";

    stats.forEach(stat => {

        head.innerHTML += `<th>${stat}</th>`;

    });

    body.innerHTML = "";

    let firstRow = `
        <tr class="player-one">
            <td><strong>${first.name}</strong></td>
    `;

    stats.forEach(stat => {

        firstRow += `<td>${first.stats[stat]}</td>`;

    });

    firstRow += "</tr>";

    let secondRow = `
        <tr class="player-two">
            <td><strong>${second.name}</strong></td>
    `;

    stats.forEach(stat => {

        secondRow += `<td>${second.stats[stat]}</td>`;

    });

    secondRow += "</tr>";

    body.innerHTML = firstRow + secondRow;

}
/* ==========================================
   RESET
========================================== */

function resetBattle() {

    document.getElementById("comparison").style.display = "none";

    document.getElementById("creatorOne").value = "";

    document.getElementById("creatorTwo").value = "";

    document.getElementById("creatorOneResults").innerHTML = "";

    document.getElementById("creatorTwoResults").innerHTML = "";

}

/* ==========================================
   START
========================================== */

window.addEventListener("DOMContentLoaded", async () => {

    await loadCreators();

    setupAutocomplete(
        "creatorOne",
        "creatorOneResults"
    );

    setupAutocomplete(
        "creatorTwo",
        "creatorTwoResults"
    );

    document
        .getElementById("comparison")
        .style.display = "none";

    document
        .getElementById("compareBtn")
        .addEventListener("click", () => {

            document
                .getElementById("comparison")
                .style.display = "grid";

            startBattle();

        });

    document
        .getElementById("battleCategory")
        .addEventListener("change", resetBattle);

});