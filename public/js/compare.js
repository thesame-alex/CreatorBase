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

    document.getElementById("comparison").innerHTML = `

        <div class="dashboard">

            <div class="panel">

                <h2>${first.name}</h2>

                <h1>${first.overall}</h1>

                <p><strong>Category:</strong> ${first.category}</p>

                <p><strong>Country:</strong> ${first.country}</p>

            </div>

            <div class="panel">

                <h2>${second.name}</h2>

                <h1>${second.overall}</h1>

                <p><strong>Category:</strong> ${second.category}</p>

                <p><strong>Country:</strong> ${second.country}</p>

            </div>

        </div>

        <div class="leaderboard" style="margin-top:30px;">

            <h2 style="margin-bottom:20px;">

                Stat Comparison

            </h2>

            <table>

                <thead>

                    <tr>

                        <th>Stat</th>

                        <th>${first.name}</th>

                        <th>${second.name}</th>

                    </tr>

                </thead>

                <tbody>

                    ${statRows(first, second)}

                </tbody>

            </table>

        </div>

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