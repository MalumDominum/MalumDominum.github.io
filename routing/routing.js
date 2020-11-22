'use strict';
import { pageWidth, appendEvents } from './main.js';
const router = document.getElementById('router');

router.appendChild(pageWidth);

appendEvents();
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