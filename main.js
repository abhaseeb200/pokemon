let pokemonROW = document.getElementById("pokemonROW")
let searchBtn = document.getElementById("searchBtn")
let searchPokemon = document.getElementById("search-pokemon")
let postPerPageDiv = document.getElementById("postPerPageDiv")
let postPerPageSelect = document.getElementById("post-per-page-select")
let pagination = document.getElementById("pagination")
let nextButton = document.getElementById("nextPage")
let prevButton = document.getElementById("prevPage")
let currentOffset = 0 //default set 0
let pokemonPerPage = 10 //default set 10
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
function pokemonDataDOM(data,pokemonImg) {
    let divCol = document.createElement("div")
    let divCard = document.createElement("div")
    let imgCard = document.createElement("img")
    let divCardBody = document.createElement("div")
    let CardBodyP = document.createElement("p")

    divCol.classList.add("col-md-3", "col-sm-6", "mt-3")
    divCard.classList.add("card", "shadow","w-100")
    imgCard.classList.add("card-img-top")
    divCardBody.classList.add("card-body")
    CardBodyP.classList.add("card-text")

    CardBodyP.innerHTML = data.name
    imgCard.src = pokemonImg

    pokemonROW.appendChild(divCol)
    divCol.appendChild(divCard)
    divCard.appendChild(imgCard)
    divCard.appendChild(divCardBody)
    divCardBody.appendChild(CardBodyP)
}

//get API data
const getData = async (offset,limit) => {
    console.log({ offset })
    loader()
    try {
        let data = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
        let res = await data.json()

        //Hide loader
        pokemonROW.innerHTML = ""

        dupPokemonData = []
        //create DOM
        for (let i = 0; i < res.results?.length; i++) {
            const getSinglePokemonData = async () => {
                try {
                    let data = await fetch(res.results[i].url)
                    let response = await data.json()

                    let pokemonSingleImg = response.sprites.other.dream_world.front_default
                    pokemonDataDOM(res.results[i],pokemonSingleImg)
                    dupPokemonData.push({"name":res.results[i].name, "src" : pokemonSingleImg})
                } catch(err) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err,
                    })
                }
            }
            getSinglePokemonData()
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


//search button hanlder
function searchHandler() {
    console.log("current value: ", searchPokemon.value)
    let findPokemonName = dupPokemonData.filter(element => element.name === searchPokemon.value);

    //empty then show all
    if (searchPokemon.value === "") {
        getData(currentOffset,pokemonPerPage)
        postPerPageDiv.style.display = "block"
        return
    }

    //hide post-per-page
    postPerPageDiv.style.display = "none"

    //If pokemon is name find
    if (findPokemonName.length) {
        pokemonROW.innerHTML = ""
        pokemonDataDOM(findPokemonName[0],findPokemonName[0].src)
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




//Pagination
let currentPage = 1 //default set 1
let limitRange = 50;
let totalPaginationItem = Math.ceil(limitRange / pokemonPerPage)

//Post per page
postPerPageSelect.addEventListener("change", () => {
    currentOffset = 0 ;
    //emptry old pagination
    let paginationItems = document.querySelectorAll(".page-item");
    paginationItems.forEach((item,ind)=> {
        if (ind === 0 || ind === paginationItems.length - 1) {
            //get prev & next button
        } else {
            item.parentNode.removeChild(item);
        }
    })

    pokemonPerPage = parseInt(postPerPageSelect.value)
    totalPaginationItem = Math.ceil(limitRange / pokemonPerPage)
    getData(currentOffset,pokemonPerPage)
    updatePagination()

})

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
    currentPageHandler()
}
updatePagination()

//current page number update
function currentPageHandler() {
    let paginationItems = document.querySelectorAll(".page-item");
    paginationItems.forEach((item, index) => {
        if (index === currentPage) {
            console.log("ind", index, "==== item", item, " ==== CP", currentPage, " ==== offset ", currentOffset)
            let isActiveClass = item.classList.contains("active")
            if (!isActiveClass) {
                getData(currentOffset,pokemonPerPage) //API get off when whey they are active
            }
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
    prevButton.classList.toggle("disabled", currentPage === 1);
    nextButton.classList.toggle("disabled", currentPage === Math.ceil(limitRange / pokemonPerPage));
}

//prev and next button
prevButton.addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        currentOffset = currentOffset - pokemonPerPage
        currentPageHandler();
    }
});
nextButton.addEventListener("click", () => {
    if (currentPage <= Math.ceil(limitRange / pokemonPerPage) - 1) {
        currentPage++;
        currentOffset = currentOffset + pokemonPerPage
        currentPageHandler();
    }
});
