const baseUrl = 'https://api.github.com/search/users?q='
const errorItem = document.querySelector('.error-item')
const resultList = document.querySelector('.result-list')
const modal = document.getElementById('modal')
const closeModal = document.querySelector('.close-btn')
const modalContent = document.querySelector('.modal-content-inner')
const loaderBlock = document.querySelector('.loader-block')

closeModal.addEventListener('click', function () {
    modal.style.opacity = '0'
    modal.style.visibility = 'hidden'
})


modal.addEventListener('click', function () {
    modal.style.opacity = '0'
    modal.style.visibility = 'hidden'
})


const reposUrl = 'https://api.github.com/users/'

const viewRepositories = (login) => {

    modal.style.opacity = '1'
    modal.style.visibility = 'visible'


    fetch(`${reposUrl}${login}/repos`)
        .then(response => {
            if (!response.ok) {
                throw Error('error')
            } else {
                return response.json()
            }
        })
        .then((data) => {
            console.log(data)
            if (data === 0) {
            }
            loaderBlock.innerHTML = ''
            renderRepositories(data)
            errorItem.innerHTML = ''
        })
        .catch((error) => {
            errorItem.innerHTML = error
        })


    function renderRepositories(repos) {
        modalContent.innerHTML += ''
        repos.map(item => {
            modalContent.innerHTML += `
        <div class="modal-repositories-list">
            <div class="modal-item-content">
                <div class="repos-name">${item.name}</div>
                <div class="modal-btn-holder">
                    <a href="${item.html_url}"><button class="btn active">go to Github</button></a>
                </div>
            </div>
        </div>
            `
        });
    }
    renderRepositories()
}

function addFavorites(id, avatar, login, html_url) {
    const favItem = {
        id, avatar, login, html_url
    }
    favLocal(favItem)
}

const getUsers = () => {
    const usersLocalStorage = localStorage.getItem('favorites');
    if (usersLocalStorage !== null) {
        return JSON.parse(usersLocalStorage);
    }
    return [];
}
let pushUsers = false
const favLocal = (obj) => {
    users = getUsers();
    const id = obj.id
    console.log(id)
    const index = users.find(el => el.id === id)
    if (index) {
        users = users.filter(el => el.id !== id)
    } else {
        users.push(obj)
        pushUsers = true
    }
    localStorage.setItem('favorites', JSON.stringify(users));
    return {
        pushUsers, users
    }
}

let allResult = {
    sort: 'created',
    order: 'desc',
    perPage: 4,
    pagination: 1,

};

console.log(allResult)

function addResultSort(el) {
    allResult.sort = el
}

function addResultOrder(el) {
    allResult.order = el
}


function addResultPerPage(el) {
    allResult.perPage = el
}

function addResultPagination(el) {
    allResult.pagination = el
}

function addResultPrev() {
    allResult.pagination = allResult.pagination > 1 ? allResult.pagination - 1 : allResult.pagination
}

function addResultNext() {
    allResult.pagination = allResult.pagination + 1
}


let searchTimoutToken = 0;

function searchUsers(users = '') {
    fetch(`${baseUrl}${users}&sort=${allResult.sort}_at&order=${allResult.order}&per_page=${allResult.perPage}&page=${allResult.pagination}`)
        .then(response => {
            if (!response.ok) {
                throw Error('error')
            } else {
                return response.json()
            }
        })
        .then((data) => {
            console.log(data)

            const resultsUser = data.items
            if (resultsUser === 0) {

            }
            renderResults(resultsUser)
            errorItem.innerHTML = ''
        })

        .catch((error) => {
            errorItem.innerHTML = error;
        })

    function renderResults(result) {
        resultList.innerHTML = '';
        setTimeout(() => {
            loaderBlock.style.display = 'none';
        }, 1000)
        result.map(el => (
            resultList.innerHTML += `
            <div class="result-item">
                <div class="person-item">
                    <img class="img-item" src="${el.avatar_url}" alt="">
                    <div class="person-info">
                        <h3 class="name">${el.login}</h3>
                        <a class="user_link" target='_blank' href="${el.html_url}">${el.html_url}</a>
                    </div>
                </div>
                <div class="button-holder">
                <div class='btn-item-holder'>
                    <button onclick="addFavorites(${el.id},\'${el.avatar_url}\', \'${el.login}\',\'${el.html_url}\')" class="btn-star"><i class="fa-solid fa-star"></i></button>
                </div>
                    <div class="btn-item-holder">
                    <button onclick="viewRepositories('${el.login}')" class="btn active">Show repositories</button>
                    </div>
                </div>
            </div> 
            `
        ))
    }
}


window.onload = () => {

    const sortSelect = document.getElementById('sort-select')
    const heroOrder = document.getElementById('order-select')
    const heroPerPage = document.getElementById('per-page')
    const paginationInput = document.getElementById('pagination-input')
    const prevButton = document.querySelector('.prevButton')
    const nextButton = document.querySelector('.nextButton')


    sortSelect.addEventListener('change', () => {
        addResultSort(sortSelect.value)
        searchUsers()
    })


    heroOrder.addEventListener('change', () => {
        addResultOrder(heroOrder.value)
        searchUsers()
    })

    heroPerPage.addEventListener('change', () => {
        addResultPerPage(heroPerPage.value)
        searchUsers()
    })


    paginationInput.addEventListener('change', () => {
        addResultPagination(paginationInput.value)
        searchUsers()
    })

    prevButton.addEventListener('click', () => {
        addResultPrev()
        searchUsers()
    })

    nextButton.addEventListener('click', () => {
        addResultNext()
        searchUsers()
    })



    const search = document.getElementById('search')
    search.onkeyup = (event) => {

        searchUsers(search.value)

        clearTimeout(searchTimoutToken)

        loaderBlock.style.display = 'flex'
        searchTimoutToken = setTimeout(() => {
            searchUsers(search.value)
        }, 7000)
    }
}
