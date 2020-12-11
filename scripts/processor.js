'use strict';

let getHashDetails = function() {
    let splitedHash = window.location.hash.replace('#', '').split('/');
    switch (splitedHash.length) {
        case 1: return [ splitedHash[0] ];  //cart

        case 2: return [ splitedHash[0],    //categories | products
                         splitedHash[1] ];

        default: return [''];
    }
};

let cleanElement = function(element) {
    while(element.hasChildNodes())
        element.removeChild(element.lastChild);
}

//==============Events-for-Mobile==============
const addMobileEvents = function () { 
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
}

export { getHashDetails, cleanElement, addMobileEvents };