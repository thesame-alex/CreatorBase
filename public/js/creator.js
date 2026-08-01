/* ==========================================
   CREATORBASE
   CREATOR.JS
========================================== */


let creator = null;
let creators = [];


/* ==========================
LOAD CREATOR
========================== */


async function loadCreator(){

    const params = new URLSearchParams(window.location.search);

    const slug = params.get("slug");


    console.log("Loading creator:", slug);


    if(!slug){

        document.getElementById("creatorName").textContent =
            "Creator not found";

        return;

    }


    try{


        const creatorResponse =
            await fetch(`/api/creator/${slug}`);



        if(!creatorResponse.ok){

            throw new Error("Creator not found");

        }



        creator = await creatorResponse.json();



        const creatorsResponse =
            await fetch("/api/creators");



        creators = await creatorsResponse.json();



        renderCreator();

        renderInformation();

        renderMetadata();

        renderStats();

        renderSimilarCreators();



    }


    catch(error){


        console.error(
            "Creator loading error:",
            error
        );


        const name =
            document.getElementById("creatorName");


        if(name){

            name.textContent =
                "Creator not found";

        }


    }


}




/* ==========================
HEADER
========================== */


function renderCreator(){


    document.getElementById("creatorName").textContent =
        creator.name;



    document.getElementById("creatorCategory").textContent =
        capitalize(creator.category);



    document.getElementById("creatorCountry").textContent =
        creator.country;



    document.getElementById("creatorSubcategory").textContent =
        capitalize(creator.subcategory);



    document.getElementById("creatorOverall").textContent =
        creator.overall;


}





/* ==========================
INFORMATION
========================== */


function renderInformation(){


const box =
document.getElementById("creatorInformation");


if(!box) return;



box.innerHTML = `


<div class="creator-item">

<span>Category</span>

<strong>${creator.category}</strong>

</div>



<div class="creator-item">

<span>Specialization</span>

<strong>${creator.subcategory}</strong>

</div>



<div class="creator-item">

<span>Country</span>

<strong>${creator.country}</strong>

</div>



<div class="creator-item">

<span>Overall Rating</span>

<strong>${creator.overall}</strong>

</div>


`;



}





/* ==========================
METADATA
========================== */


function renderMetadata(){


const box =
document.getElementById("creatorMetadata");


if(!box) return;



box.innerHTML = `


<div class="creator-item">

<span>Verified</span>

<strong>
${creator.metadata?.verified ? "✅ Verified" : "❌ Not Verified"}
</strong>

</div>



<div class="creator-item">

<span>Featured</span>

<strong>
${creator.metadata?.featured ? "⭐ Featured" : "No"}
</strong>

</div>



<div class="creator-item">

<span>Added</span>

<strong>
${creator.metadata?.createdAt ?? "Unknown"}
</strong>

</div>



`;



}






/* ==========================
STATS
========================== */


function renderStats(){


const container =
document.getElementById("creatorStats");



if(!container) return;



container.innerHTML = "";



Object.entries(creator.stats || {})
.forEach(([name,value])=>{


container.innerHTML += `


<div class="stat-comparison">


<div class="stat-header">

${name}

</div>



<div class="stat-player winner">


<div class="stat-name">

${name}

</div>



<div class="stat-bar">

<div class="stat-fill"
style="width:${value}%">

</div>

</div>



<strong>

${value}

</strong>



</div>


</div>


`;



});



}






/* ==========================
SIMILAR CREATORS
========================== */


function renderSimilarCreators(){


const container =
document.getElementById("similarCreators");


if(!container) return;



const similar =
creators

.filter(c=>

c.slug !== creator.slug &&

c.category === creator.category

)

.slice(0,4);



if(similar.length === 0){


container.innerHTML =
"<p>No similar creators found.</p>";


return;


}



container.innerHTML = "";



similar.forEach(c=>{


container.innerHTML += `


<div class="creator-item">


<a href="creator.html?slug=${c.slug}"
style="color:inherit;text-decoration:none;">


<span>

${c.name}

</span>


</a>


<strong>

${c.overall}

</strong>


</div>


`;



});



}






/* ==========================
HELPER
========================== */


function capitalize(text){

if(!text) return "";

return text.charAt(0).toUpperCase()+text.slice(1);

}





/* ==========================
START
========================== */


window.addEventListener(
"DOMContentLoaded",
()=>{

loadCreator();

}
);