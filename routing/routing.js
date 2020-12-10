'use strict';
import { addMobileEvents } from "../script.js";
import { getHashDetails, cleanElement } from "./processor.js";

addMobileEvents();

const router = document.getElementById('router');

function initiateComponent(path) {
  import(path)
    .then(module => {
      module.constructor(router).then(function() {
        initiateAddToCart(router);
        initiateRoutes(router);
      });
    })
}

function routePage() {
  switch (getHashDetails()[0]) {
    case 'categories':
      initiateComponent('./categories.js');
      break;
    case 'products':
      initiateComponent('./products.js');
      break;
    case 'cart':
      updateCartCounter(JSON.parse(localStorage.getItem('cartData')));
      initiateComponent('./cart.js');
      break;
    case 'actions':
      initiateComponent('./action.js');
      break;
    default:
      initiateComponent('./main.js');
      break;
  }
}
initiateCartLogic();
initiateRoutes(document);
window.onpopstate = onRoute;
routePage();

function onRoute() {
  cleanElement(router);
  window.scrollTo(0, 0);
  routePage();
}

function routeLogic(routeElement) {
  history.pushState(null, null, routeElement.dataset.route ? routeElement.dataset.route : '/');
  onRoute();
};

function initiateRoutes(element) {
  let routeElements = element.querySelectorAll('[data-route]');
  routeElements.forEach(function(routeElement) {
    routeElement.addEventListener('click', function() { routeLogic(routeElement); })
    routeElement.onmouseup = function(e) {
      var e = e || window.event;
      var btnCode = e.button;
      if (btnCode === 1)
        window.open(window.location.origin + routeElement.dataset.route, '_blank');
    }
  });
};

function updateCartCounter(data) {
  document.querySelector('.header-cart-counter').innerHTML = Object.keys(data).length;
}
function initiateCartLogic () {
  const cartData = localStorage.getItem('cartData');
  if (!cartData) {
    localStorage.setItem('cartData', '{}');
    updateCartCounter({});
  } else {
    updateCartCounter(JSON.parse(cartData));
  }
}

function initiateAddToCart(element) {
  let addToCartElements = element.querySelectorAll('[data-addtocart]');
  addToCartElements.forEach(function(routeElement) {
    routeElement.addEventListener('click', function(e) {
      let cartData = JSON.parse(localStorage.getItem('cartData'));
      let quantity = this.dataset.quantity ? this.dataset.quantity : 1;
      if(cartData[this.dataset.addtocart]) {
        cartData[this.dataset.addtocart] += (+quantity);
      } else {
        cartData[this.dataset.addtocart] = +quantity;
      }
      updateCartCounter(cartData);
      localStorage.setItem('cartData', JSON.stringify(cartData));
      alert('Продукт(ы) был(и) добавлен(ы) в вашу корзину!')
    })
  });
}