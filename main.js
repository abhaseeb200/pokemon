let pokemonROW = document.getElementById("pokemonROW")
let searchBtn = document.getElementById("searchBtn")
let searchPokemon = document.getElementById("search-pokemon")
let postPerPageDiv = document.getElementById("postPerPageDiv")
let postPerPageSelect = document.getElementById("post-per-page-select")
let pagination = document.getElementById("pagination")
let nextButton = document.getElementById("nextPage")
let prevButton = document.getElementById("prevPage")
let modalBodyImg = document.getElementById("modal-body-img")
let modalBodyDetail = document.getElementById("modal-body-detail")
var myModal = new bootstrap.Modal(document.getElementById('exampleModal'))
let currentOffset = 0 //default set 0
let pokemonPerPage = 10 //default set 10
let postPerPageVal = 0
let dupPokemonData = []
let isAlreadyGetInitalizeAPI
//Pagination
let currentPage = 1 //default set 1
let limitRange = 50;
let totalPaginationItem = Math.ceil(limitRange / pokemonPerPage)

//get API data
const getData = async (offset, limit) => {
    loader()
    try {
        let data = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
        let res = await data.json()

        //Hide loader
        pokemonROW.innerHTML = ""

        dupPokemonData = []

        //create DOM
        for (let i = 0; i < res.results?.length; i++) {
            getSinglePokemonData(res.results[i].url)
        }
        isAlreadyGetInitalizeAPI = true
        updatePagination()

    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err,
        })
        pokemonROW.innerHTML = "<p class='no-data'>No data is found</p>"
        pagination.innerHTML = ""
        postPerPageDiv.innerHTML = ""
        return
    }
}
getData(currentOffset, pokemonPerPage) //API get initalize

//get single pokemon data
const getSinglePokemonData = async (url) => {
    try {
        let data = await fetch(url)
        let response = await data.json()
        pokemonDataDOM(response)
        dupPokemonData.push(response)
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err,
        })
    }
}

//Loader
function loader() {
    let flexDiv = document.createElement("div")
    let div = document.createElement("div")
    div.classList.add("spinner-border", "text-dark")
    flexDiv.classList.add("d-flex", "justify-content-center")
    div.setAttribute("role", "status")
    pokemonROW.appendChild(flexDiv)
    flexDiv.appendChild(div)
}


//render DOM
function pokemonDataDOM(response) {
    let divCol = document.createElement("div")
    let divCard = document.createElement("div")
    let imgCard = document.createElement("img")
    let divCardBody = document.createElement("div")
    let CardBodyP = document.createElement("p")

    divCol.classList.add("col-md-3", "col-sm-6", "mt-3")
    divCard.classList.add("card", "shadow", "w-100")
    imgCard.classList.add("card-img-top")
    divCardBody.classList.add("card-body")
    CardBodyP.classList.add("card-text")
    CardBodyP.innerHTML = response.name
    imgCard.src = response.sprites.other.dream_world.front_default

    pokemonROW.appendChild(divCol)
    divCol.appendChild(divCard)
    divCard.appendChild(imgCard)
    divCard.appendChild(divCardBody)
    divCardBody.appendChild(CardBodyP)

    divCard.onclick = () => {
        pokemonDetailsModalDOM(response)
    }
}

function pokemonDetailsModalDOM(response) {
    myModal.show()
    modalBodyDetail.innerHTML = ""
    modalBodyImg.innerHTML = ""

    let id = document.createElement("span")
    let h1 = document.createElement("h1")
    let divAbility = document.createElement("div")
    let h5Ability = document.createElement("h3")
    let divHeight = document.createElement("div")
    let h5Height = document.createElement("h3")
    let spanHeight = document.createElement("span")
    let divWeight = document.createElement("div")
    let h5Weight = document.createElement("h3")
    let spanWeight = document.createElement("span")
    let img = document.createElement("img")

    h1.innerHTML = response.name
    h5Ability.innerHTML = "ABILITIES"
    h5Height.innerHTML = "HEIGHT"
    h5Weight.innerHTML = "WEIGHT"
    spanHeight.innerHTML = response.height
    spanWeight.innerHTML = response.weight
    img.src = response.sprites.other.dream_world.front_default

    id.classList.add("text-muted", "font-18")
    h1.classList.add("text-capitalize")
    divAbility.classList.add("mt-5")
    divHeight.classList.add("inline-block", "col-6", "mt-5")
    divWeight.classList.add("inline-block", "col-6", "mt-5")
    spanWeight.classList.add("cust-badges")
    h5Ability.classList.add("text-dark")
    h5Height.classList.add("text-dark")
    h5Weight.classList.add("text-dark")
    spanHeight.classList.add("cust-badges")
    img.classList.add("w-100")

    modalBodyDetail.appendChild(id)
    modalBodyDetail.appendChild(h1)
    id.innerHTML = "#" + response.id
    response.types.forEach(data => {
        let typesSlot = document.createElement("span")
        typesSlot.innerHTML += data.type.name
        typesSlot.classList.add("badge", "bg-success", "me-2", "text-uppercase")
        modalBodyDetail.appendChild(typesSlot)
    })
    modalBodyDetail.appendChild(divAbility)
    divAbility.appendChild(h5Ability)
    response.abilities.forEach(data => {
        let badge = document.createElement("span")
        badge.innerHTML += data.ability.name
        badge.classList.add("cust-badges", "me-2")
        divAbility.appendChild(badge)
    })

    modalBodyDetail.appendChild(divHeight)
    divHeight.appendChild(h5Height)
    divHeight.appendChild(spanHeight)
    modalBodyDetail.appendChild(divWeight)
    divWeight.appendChild(h5Weight)
    divWeight.appendChild(spanWeight)
    modalBodyImg.appendChild(img)
}

//search button hanlder
function searchHandler() {
    let findPokemonName = dupPokemonData.filter(element => element.name.includes(searchPokemon.value.trim().toLowerCase()));
    //empty then show all
    if (searchPokemon.value === "") {
        pokemonROW.innerHTML = ""
        dupPokemonData.forEach((item)=> {
            pokemonDataDOM(item)
        })
        postPerPageDiv.style.display = "block"
        pagination.style.display = "flex"
        return
    }

    //hide post-per-page
    postPerPageDiv.style.display = "none"

    //If pokemon is name find
    if (findPokemonName.length) {
        console.log(findPokemonName)
        pokemonROW.innerHTML = ""
        findPokemonName.forEach((item) => {
            pokemonDataDOM(item)
        })
        pagination.style.display = "none"
    } else {
        //If pokemon is not name find
        pokemonROW.innerHTML = "<p class='no-data'>No result is found</p>"
        pagination.style.display = "none"
    }
}


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

//current page number update
function currentPageHandler() {
    let paginationItems = document.querySelectorAll(".page-item");
    paginationItems.forEach((item, index) => {
        if (index === currentPage) {
            let isActiveClass = item.classList.contains("active")
            if (!isActiveClass && !isAlreadyGetInitalizeAPI) { //API get off when whey they are active && does't hit if already
                getData(currentOffset, pokemonPerPage)
                //emptry old pagination
                let paginationItems = document.querySelectorAll(".page-item");
                paginationItems.forEach((item, ind) => {
                    if (!(ind === 0 || ind === paginationItems.length - 1)) {
                        item.parentNode.removeChild(item);
                    }
                })
            }
            isAlreadyGetInitalizeAPI = false
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
// postPerPageSelect.addEventListener("change", () => {
//     currentOffset = 0;
//     //emptry old pagination
//     let paginationItems = document.querySelectorAll(".page-item");
//     paginationItems.forEach((item, ind) => {
//         if (ind === 0 || ind === paginationItems.length - 1) {
//             //get prev & next button
//         } else {
//             item.parentNode.removeChild(item);
//         }
//     })
//     pokemonPerPage = parseInt(postPerPageSelect.value)
//     totalPaginationItem = Math.ceil(limitRange / pokemonPerPage)
//     getData(currentOffset, pokemonPerPage)
//     updatePagination()
// })