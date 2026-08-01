let creators = [];

// ======================================
// LOAD CREATORS
// ======================================

async function loadCreators() {

    const response = await fetch("/api/creators");

    creators = await response.json();

}

// ======================================
// AUTOCOMPLETE
// ======================================

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

        const matches = creators
    .filter(c => {

        const name = c.name.toLowerCase();
        const slug = c.slug.toLowerCase();

        return (
            name.includes(query) ||
            slug.includes(query)
        );

    })
    .sort((a, b) =>
        a.name.localeCompare(b.name)
    )
    .slice(0, 8);
        if (!matches.length) {

            results.style.display = "none";

            return;

        }

        matches.forEach(creator => {

            const item = document.createElement("div");

            item.className = "search-result";

            item.textContent = creator.name;

            item.addEventListener("click", () => {

                input.value = creator.name;

                results.innerHTML = "";

                results.style.display = "none";

            });

            results.appendChild(item);

        });

        results.style.display = "block";

    });

    input.addEventListener("keydown", e => {

        if (e.key === "Enter") {

            e.preventDefault();

            compareCreators();

        }

    });

    document.addEventListener("click", e => {

        if (

            !input.contains(e.target) &&

            !results.contains(e.target)

        ) {

            results.style.display = "none";

        }

    });

}

// ======================================
// COMPARE
// ======================================

async function compareCreators() {

    const first = document
        .getElementById("creatorOne")
        .value
        .trim();

    const second = document
        .getElementById("creatorTwo")
        .value
        .trim();

    if (!first || !second) {

        alert("Select two creators.");

        return;

    }

    if (first.toLowerCase() === second.toLowerCase()) {

        alert("Choose two different creators.");

        return;

    }

    const response = await fetch(

        `/api/compare?first=${encodeURIComponent(first)}&second=${encodeURIComponent(second)}`

    );

    const data = await response.json();

    if (!response.ok) {

        alert(data.error);

        return;

    }

    displayComparison(data.first, data.second);

}

// ======================================
// DISPLAY
// ======================================

function statRows(first, second) {

    const stats = Object.keys(first.stats);

    return stats.map(stat => {

        const firstScore = first.stats[stat];

        const secondScore = second.stats[stat];


        let firstWinner = "";

        let secondWinner = "";


        if (firstScore > secondScore) {

            firstWinner = "winner";

        } 
        
        else if (secondScore > firstScore) {

            secondWinner = "winner";

        }


        return `

        <div class="stat-comparison">


            <div class="stat-header">

                <span>${stat}</span>

            </div>



            <div class="stat-player ${firstWinner}">

                <div class="stat-name">

                    ${first.name}

                    ${firstScore > secondScore ? "🏆" : ""}

                </div>


                <div class="stat-bar">

                    <div 
                        class="stat-fill"
                        style="width:${firstScore}%"
                    >

                    </div>

                </div>


                <strong>

                    ${firstScore}

                </strong>

            </div>




            <div class="stat-player ${secondWinner}">

                <div class="stat-name">

                    ${second.name}

                    ${secondScore > firstScore ? "🏆" : ""}

                </div>


                <div class="stat-bar">

                    <div 
                        class="stat-fill"
                        style="width:${secondScore}%"
                    >

                    </div>

                </div>


                <strong>

                    ${secondScore}

                </strong>

            </div>


        </div>

        `;

    }).join("");

}
function displayComparison(first, second) {

    let firstWins = 0;
    let secondWins = 0;

    let statsHTML = "";

    Object.keys(first.stats).forEach(stat => {

        const a = first.stats[stat];
        const b = second.stats[stat];

        let winner = "Draw";

        if (a > b) {

            winner = first.name;
            firstWins++;

        } else if (b > a) {

            winner = second.name;
            secondWins++;

        }

        statsHTML += `

            <div class="battle-stat">

                <div class="battle-stat-title">

                    ${stat}

                </div>

                <div class="battle-row">

                    <div class="battle-side ${a>b?"winner":""}">

                        <strong>${first.name}</strong>

                        <span>${a}</span>

                    </div>

                    <div class="battle-vs-small">

                        VS

                    </div>

                    <div class="battle-side ${b>a?"winner":""}">

                        <strong>${second.name}</strong>

                        <span>${b}</span>

                    </div>

                </div>

                <div class="battle-winner">

                    🏆 Winner: ${winner}

                </div>

            </div>

        `;

    });

    let overallWinner = "Draw";

    if (firstWins > secondWins) {

        overallWinner = first.name;

    } else if (secondWins > firstWins) {

        overallWinner = second.name;

    }

    document.getElementById("comparison").innerHTML = `

        <div class="battle-card">

            <div class="battle-player">

                <h2>${first.name}</h2>

                <div class="battle-score">

                    ${first.overall}

                </div>

            </div>

            <div class="battle-center">

                ⚔️

            </div>

            <div class="battle-player">

                <h2>${second.name}</h2>

                <div class="battle-score">

                    ${second.overall}

                </div>

            </div>

        </div>

        <div class="battle-summary">

            <h2>

                🏆 Overall Winner

            </h2>

            <h1>

                ${overallWinner}

            </h1>

            <p>

                ${first.name}: ${firstWins} Wins

                &nbsp;&nbsp;•&nbsp;&nbsp;

                ${second.name}: ${secondWins} Wins

            </p>

        </div>

        ${statsHTML}

    `;

}

// ======================================
// START
// ======================================

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

        .getElementById("compareBtn")

        .addEventListener("click", compareCreators);

});