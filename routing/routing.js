'use strict';

const router = document.getElementById('router');

switch (window.location.hash) {
  case 'product':
    console.log('product');
    break;
  default:
    import { pageWidth, appendEvents } from './main.js';
    router.appendChild(pageWidth);
    appendEvents();
    break;
}
// function routeLogic(routeElement) {
//     history.pushState(null, null, routeElement.dataset.route);
//     OnRoute();
// };

// function initiateRoutes() {
//   let routeElements = document.querySelectorAll('[data-route]');
//   routeElements.forEach(function(routeElement) {
//     routeElement.addEventListener('click', routeLogic(routeElement))
//   });
// };

// initiateRoutes();

// function OnRoute() {
//   router.innerHTML = "";
// }