let pokemonROW = document.getElementById("pokemonROW")
let searchBtn = document.getElementById("searchBtn")
let searchPokemon = document.getElementById("search-pokemon")
let postPerPageDiv = document.getElementById("postPerPageDiv")
let postPerPageSelect = document.getElementById("post-per-page-select")
let pagination = document.getElementById("pagination")
let nextPage = document.getElementById("nextPage")
let prevPage = document.getElementById("prevPage")
let dupPokemonData = []

//Loader
function loader() {
    console.log("loader...")
    let flexDiv = document.createElement("div")
    let div = document.createElement("div")
    div.classList.add("spinner-border", "text-dark")
    flexDiv.classList.add("d-flex", "justify-content-center")
    div.setAttribute("role", "status")
    pokemonROW.appendChild(flexDiv)
    flexDiv.appendChild(div)
}


//render DOM
function pokemonDataDOM(data) {
    let divCol = document.createElement("div")
    let divCard = document.createElement("div")
    let imgCard = document.createElement("img")
    let divCardBody = document.createElement("div")
    let CardBodyP = document.createElement("p")

    divCol.classList.add("col-md-3", "col-sm-6", "mt-3")
    divCard.classList.add("card", "shadow")
    imgCard.classList.add("card-img-top")
    divCardBody.classList.add("card-body")
    CardBodyP.classList.add("card-text")

    CardBodyP.innerHTML = data.name
    imgCard.src = "./assets/images/pokemon-2.png"

    pokemonROW.appendChild(divCol)
    divCol.appendChild(divCard)
    divCard.appendChild(imgCard)
    divCard.appendChild(divCardBody)
    divCardBody.appendChild(CardBodyP)
}

//get API data
const getData = async (offset) => {
    console.log({ offset })
    loader()
    try {
        let data = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=10`)
        let res = await data.json()

        //Hide loader
        pokemonROW.innerHTML = ""

        //create DOM
        dupPokemonData = res.results
        for (let i = 0; i < res.results?.length; i++) {
            pokemonDataDOM(res.results[i])
        }
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err,
        })
        pokemonROW.innerHTML = "<p class='no-data'>No data is found</p>"
    }
}
// defualt value is 10
getData(0)

//search button hanlder
function searchHandler() {
    console.log("current value: ", searchPokemon.value)
    let findPokemonName = dupPokemonData.filter(element => element.name === searchPokemon.value);
    console.log(findPokemonName)

    //empty then show all
    if (searchPokemon.value === "") {
        getData(1)
        console.log("empty value")
        postPerPageDiv.style.display = "block"
        return
    }

    //hide post-per-page
    postPerPageDiv.style.display = "none"

    //If pokemon is name find
    if (findPokemonName.length) {
        pokemonROW.innerHTML = ""
        pokemonDataDOM(findPokemonName[0])
    } else {
        //If pokemon is not name find
        pokemonROW.innerHTML = "<p class='no-data'>No result is found</p>"
    }
}

//search button events
searchBtn.addEventListener("click", () => {
    searchHandler()
})
searchPokemon.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchHandler()
    }
})

//Post per page
postPerPageSelect.addEventListener("change", () => {
    // pokemonROW.innerHTML = ""
    getData(postPerPageSelect.value)
})

function paginationUpdate() {
    let limit = 50;
    let pokemonPerPage = 10
    let totalPagination = limit / pokemonPerPage
    let currentPage = 1
    let currentOffset = 0
    let isActiveOld = null
    let oldVal = 0
    prevPage.classList.toggle("disabled", currentPage === 1);
    nextPage.classList.toggle("disabled", currentPage === totalPagination - 1);

    for (let i = 0; i < totalPagination; i++) {
        let pageItem = document.createElement("li");
        let pageLink = document.createElement("a");
        pageItem.className = "page-item";
        pageLink.className = "page-link";
        pageLink.innerHTML = currentPage
        pageLink.setAttribute("value", (currentPage - 1) * 10)
        currentPage++
        pageLink.href = "javascript:void(0)";
        pageLink.addEventListener("click", () => {
            if (isActiveOld) {
                isActiveOld.parentElement.classList.remove("active");
                oldVal = isActiveOld.getAttribute("value")
            }
            currentOffset = parseInt(pageLink.getAttribute("value"))

            if (oldVal === currentOffset) {
                console.log("found same")
            } else {
                getData(currentOffset)
                isActiveOld = pageLink
            }
            //remove the default
            
            pageItem.classList.add("active");
        });
        pageItem.appendChild(pageLink);
        pagination.insertBefore(pageItem, nextPage);
    }

    nextPage.addEventListener("click",()=>{
        let pageLinks = document.querySelectorAll(".page-item");
        if (currentOffset + pokemonPerPage < limit) {
            for (let i = 0; i < pageLinks.length; i++) {
                if (pageLinks[i].classList.contains("active")) {
                    pageLinks[i].classList.remove("active");
                    pageLinks[i + 1].classList.add("active");
                    break;
                }
            }
            console.log(currentOffset + pokemonPerPage)
            currentOffset = currentOffset + pokemonPerPage
            getData(currentOffset)
        }
    })
}
paginationUpdate()



// // Assuming you have a list of page links with class "page-link"
// const pageLinks = document.querySelectorAll(".page-link");

// // Add a click event listener to each page link
// pageLinks.forEach(pageLink => {
//     pageLink.addEventListener("click", (event) => {
//         event.preventDefault(); // Prevent the default link behavior

//         // Get the value attribute of the clicked page link
//         const value = pageLink.getAttribute("value");
        
//         console.log("Clicked page link value:", value);

//         // Your code to handle the click event goes here
//     });
// });

