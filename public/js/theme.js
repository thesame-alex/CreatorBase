/* ======================================
   CREATORBASE THEME SYSTEM
====================================== */


function initializeTheme() {

    const button = document.getElementById("themeToggle");


    // Load saved theme

    const savedTheme = localStorage.getItem("theme");


    if (savedTheme === "light") {

        document.body.classList.add("light");

    }


    updateThemeButton();



    if(button){

        button.onclick = () => {


            document.body.classList.toggle("light");


            const isLight =
                document.body.classList.contains("light");


            localStorage.setItem(

                "theme",

                isLight ? "light" : "dark"

            );


            updateThemeButton();


        };

    }

}



function updateThemeButton(){

    const button =
        document.getElementById("themeToggle");


    if(!button) return;


    const isLight =
        document.body.classList.contains("light");


    button.textContent =
        isLight ? "☀️" : "🌙";

}



window.addEventListener(

    "DOMContentLoaded",

    initializeTheme

);