'use strict';
import { getHashDetails } from "./processor.js";

const router = document.getElementById('router');

function routePage() {
  switch (getHashDetails()[0]) {
    case 'categories':
      import('./categories.js');
      break;
    case 'products':
      import('./products.js')
      .then(module => {
        console.log(module.pageWidth);
        router.appendChild(module.pageWidth);
        initiateRoutes(module.pageWidth);
      })
      break;
    case 'cart':
      import('./cart.js');
      break;
    default:
      import('./main.js')
      .then(module => {
        console.log(module.pageWidth);
        router.appendChild(module.pageWidth);
        module.appendEvents().then(function() {
          initiateRoutes(module.pageWidth);
        });
      })
      break;
  }
}
initiateRoutes(document);
//window.onpopstate = onRoute;
routePage();

function onRoute() {
  router.innerHTML = "";
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
    routeElement.addEventListener('click', function() { routeLogic(routeElement); })
  });
};