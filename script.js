'use strict';
//==============Buttons-for-Mobile==============
let menuButton = document.getElementById("header-menu");
const headerMobile = document.getElementById("header-mobile");
menuButton.addEventListener('click', function () {
    headerMobile.classList.toggle('hidden')
});

const footerPanels = document.getElementsByClassName("footer-nav-mobile-title");
const footerContainers = document.getElementsByClassName("footer-nav-container-mobile");
for (let i = 0; i < 3; i++) {
  footerPanels[i].addEventListener('click', function () {
    footerContainers[i].classList.toggle('hidden')
})};