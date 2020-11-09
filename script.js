let menuButton = document.getElementById("header-menu");
const headerMobile = document.getElementById("header-mobile");
menuButton.addEventListener('click', function () {
    headerMobile.classList.toggle('hidden')
})