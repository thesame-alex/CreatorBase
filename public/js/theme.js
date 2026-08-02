/* ======================================
   CREATORBASE THEME + MOBILE NAVIGATION
====================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================
       THEME
    ====================== */

    const themeToggle = document.getElementById("themeToggle");

    if (localStorage.getItem("theme") === "light") {

        document.body.classList.add("light");

    }

    updateThemeButton();

    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle("light");

            localStorage.setItem(
                "theme",
                document.body.classList.contains("light")
                    ? "light"
                    : "dark"
            );

            updateThemeButton();

        });

    }

    function updateThemeButton() {

        if (!themeToggle) return;

        themeToggle.textContent =
            document.body.classList.contains("light")
                ? "☀️"
                : "🌙";

    }

    /* ======================
       MOBILE MENU
    ====================== */

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (!menuToggle || !navLinks) return;

    function closeMenu() {

        navLinks.classList.remove("show");
        menuToggle.textContent = "☰";

    }

    menuToggle.addEventListener("click", (e) => {

        e.stopPropagation();

        navLinks.classList.toggle("show");

        menuToggle.textContent =
            navLinks.classList.contains("show")
                ? "✕"
                : "☰";

    });

    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", closeMenu);

    });

    document.addEventListener("click", (e) => {

        if (

            !menuToggle.contains(e.target) &&
            !navLinks.contains(e.target)

        ) {

            closeMenu();

        }

    });

    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {

            closeMenu();

        }

    });

});