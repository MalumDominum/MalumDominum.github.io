'use strict';
import { getHashDetails, cleanElement } from "./processor.js";

const router = document.getElementById('router');

function routePage() {
  switch (getHashDetails()[0]) {
    case 'categories':
      import('./categories.js');
      break;
    case 'products':
      import('./products.js')
      .then(module => {
        module.constructor(router).then(function() {
          initiateRoutes(router);
        });
      })
      break;
    case 'cart':
      import('./cart.js');
      break;
    default:
      import('./main.js')
      .then(module => {
        module.constructor(router).then(function() {
          initiateRoutes(router);
        });
      })
      break;
  }
}
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

// goods[i].querySelector('[data-route]').onmouseup = function(e) {
//   var e = e || window.event;
//   var btnCode = e.button;
//   if (btnCode === 1)
//    console.log('Middle button');
// }

function initiateRoutes(element) {
  let routeElements = element.querySelectorAll('[data-route]');
  routeElements.forEach(function(routeElement) {
    routeElement.addEventListener('click', function() { routeLogic(routeElement); console.log('click'); })
  });
};