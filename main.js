let pokemonROW = document.getElementById("pokemonROW")
let searchBtn = document.getElementById("searchBtn")
let searchPokemon = document.getElementById("search-pokemon")
let postPerPageDiv = document.getElementById("postPerPageDiv")
let postPerPageSelect = document.getElementById("post-per-page-select")
let pagination = document.getElementById("pagination")
let nextButton = document.getElementById("nextPage")
let prevButton = document.getElementById("prevPage")
let currentOffset = 0 //default set 0
let postPerPageVal = 0
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
// defualt value is 0
// getData(currentOffset)


//search button hanlder
function searchHandler() {
    console.log("current value: ", searchPokemon.value)
    let findPokemonName = dupPokemonData.filter(element => element.name === searchPokemon.value);
    console.log(findPokemonName)

    //empty then show all
    if (searchPokemon.value === "") {
        getData(currentOffset)
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
    getData(currentOffset)
    postPerPageVal = postPerPageSelect.value
})


let currentPage = 1 //default set 1
let limit = 50;
let pokemonPerPage = 10
let totalPaginationItem = limit / pokemonPerPage
function updatePagination() {
    for (let i = 0; i < totalPaginationItem; i++) {
        let pageItem = document.createElement("li");
        let pageLink = document.createElement("a");
        pageItem.className = "page-item";
        pageLink.className = "page-link";
        pageLink.innerHTML = i + 1
        pageLink.href = "javascript:void(0)";
        pageLink.addEventListener("click", () => {
            currentPage = i + 1
            currentOffset = (i) * pokemonPerPage
            currentPageHandler()
        });
        pageItem.appendChild(pageLink);
        pagination.insertBefore(pageItem, nextButton);
    }
    //intial call 
    currentPageHandler()
}
updatePagination()

//current page number update
function currentPageHandler() {
    let paginationItems = document.querySelectorAll(".page-item");
    paginationItems.forEach((item, index) => {
        // console.log(index, totalPaginationItem)
        if (index === currentPage) {
            console.log("ind",index, "==== item",item, " ==== CP", currentPage," ==== offset ",currentOffset)
            getData(currentOffset)
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
    prevButton.classList.toggle("disabled", currentPage === 1);
    nextButton.classList.toggle("disabled", currentPage === limit / pokemonPerPage);
}

//prev and next button
prevButton.addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        currentOffset = currentOffset - pokemonPerPage
        getData(currentOffset)
        currentPageHandler();
    }
});
nextButton.addEventListener("click", () => {
    if (currentPage <= limit / pokemonPerPage - 1) {
        currentPage++;
        currentOffset = currentOffset + pokemonPerPage
        getData(currentOffset)
        currentPageHandler();
    }
});
