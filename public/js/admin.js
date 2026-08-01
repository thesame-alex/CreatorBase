const form = document.getElementById("creatorForm");
const categorySelect = document.getElementById("category");

// =============================
// LOAD COUNTRIES
// =============================

async function loadCountries() {

    try {

        const response = await fetch("/api/countries");

        if (!response.ok) {
            throw new Error("Failed to load countries.");
        }

        const countries = await response.json();

        const select = document.getElementById("country");

        select.innerHTML = "";

        countries.forEach(country => {

            select.innerHTML += `

                <option value="${country}">

                    ${country}

                </option>

            `;

        });

    }

    catch (err) {

        console.error("Failed to load countries:", err);

    }

}

// =============================
// LOAD SUBCATEGORIES
// =============================

async function loadSubcategories() {

    try {

        const response = await fetch(

            `/api/subcategories/${categorySelect.value}`

        );

        if (!response.ok) {
            throw new Error("Failed to load subcategories.");
        }

        const subcategories = await response.json();

        const select = document.getElementById("subcategory");

        select.innerHTML = "";

        subcategories.forEach(sub => {

            select.innerHTML += `

                <option value="${sub}">

                    ${sub}

                </option>

            `;

        });

    }

    catch (err) {

        console.error("Failed to load subcategories:", err);

    }

}

// =============================
// BUILD STAT INPUTS
// =============================

async function buildStatInputs() {

    try {

        const response = await fetch(
            `/api/stat-template/${categorySelect.value}`
        );

        if (!response.ok) {
            throw new Error("Failed to load stat template.");
        }

        const stats = await response.json();

        const container = document.getElementById("statsContainer");

        container.innerHTML = "";

        stats.forEach(stat => {

            container.innerHTML += `

                <div class="stat-input">

                    <label>${stat}</label>

                    <input
                        type="number"
                        min="0"
                        max="100"
                        value="50"
                        data-stat="${stat}"
                    >

                </div>

            `;

        });

    }

    catch (err) {

        console.error("Failed to load stat template:", err);

    }

}

// =============================
// PAGE LOAD
// =============================

window.addEventListener("DOMContentLoaded", async () => {

    await loadCountries();

    await loadSubcategories();

    await buildStatInputs();

});

// =============================
// CATEGORY CHANGE
// =============================

categorySelect.addEventListener("change", async () => {

    await loadSubcategories();

    await buildStatInputs();

});

// =============================
// SAVE CREATOR
// =============================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const button = form.querySelector("button");

    button.disabled = true;

    button.textContent = "Saving...";

    const stats = {};

    document.querySelectorAll("#statsContainer input").forEach(input => {

        let value = Number(input.value);

        value = Math.max(0, Math.min(100, value));

        stats[input.dataset.stat] = value;

    });

    const creator = {

        name: document.getElementById("name").value,

        category: categorySelect.value,

        subcategory: document.getElementById("subcategory").value,

        country: document.getElementById("country").value,

        stats

    };

    try {

        const response = await fetch("/api/creators", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(creator)

        });

        if (!response.ok) {

            throw new Error("Failed to save creator.");

        }

        const result = await response.json();

        console.log(result);

        button.textContent = "Saved ✓";

        form.reset();

        await loadCountries();

        await loadSubcategories();

        await buildStatInputs();

    }

    catch (err) {

        console.error(err);

        button.textContent = "Error";

    }

    finally {

        setTimeout(() => {

            button.disabled = false;

            button.textContent = "Save Creator";

        }, 1200);

    }
const modal = document.getElementById("categoryModal");

document.getElementById("newCategoryBtn").onclick = () => {

    modal.style.display = "flex";

};

document.getElementById("saveCategory").onclick = () => {

    const category = {

        name: document.getElementById("newCategoryName").value,

        subcategories: document
            .getElementById("newSubcategories")
            .value
            .split("\n")
            .map(x => x.trim())
            .filter(Boolean),

        stats: document
            .getElementById("newStats")
            .value
            .split("\n")
            .map(x => x.trim())
            .filter(Boolean)

    };

    console.log(category);

    alert("Backend next 😉");

};
});