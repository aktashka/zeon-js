let favList = document.getElementById('favorites')
let data = JSON.parse(localStorage.getItem('favorites'))
console.log(data)

const getUsers = () => {
    const usersLocalStorage = localStorage.getItem('favorites');
    if (usersLocalStorage !== null) {
        return JSON.parse(usersLocalStorage);
    }
    return [];
}
const removeFavorites = (id) => {
    console.log(id)
    users = getUsers()
    const index = users.find(el => el.id === id)
    if (index) {
        users = users.filter(el => el.id !== id)
    }
    localStorage.setItem('favorites', JSON.stringify(users));
    return {
        users
    }
}



function viewData() {
    data.forEach(element => {
        favList.innerHTML += `
        <div class="result-item">
        <div class="person-item">
            <img class="img-item" src="${element.avatar}" alt="">
            <div class="person-info">
                <h3 class="name">${element.login}</h3>
                <a class="user_link" target='_blank' href="${element.html_url}">${element.html_url}</a>
            </div>
        </div>
        <div class="button-holder">
        <div class='btn-item-holder'>
            <button onclick='removeFavorites(${element.id})' class="btn-star"><i class="fa-solid fa-star"></i></button>
        </div>
            <div class="favorites-btn">
            <a href='./repositories.html'><button class="btn active">Show repositories</button></a>
            </div>
        </div>
    </div>
        `
    });
}
viewData()