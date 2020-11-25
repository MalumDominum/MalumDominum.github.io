'use strict';

const router = document.getElementById('router');

function getPathDetails() {
  let splitedPath = window.location.pathname.split('/');
  splitedPath.shift();
  switch (splitedPath.length) {
      case 1: return [ splitedPath[0] ];  //cart

      case 2: return [ splitedPath[0],    //categories | products
                       splitedPath[1] ];

      case 4: return [ splitedPath[2],    // products
                       splitedPath[3],    // product name
                       splitedPath[1] ];  // category
  }
}

function routePage() {
  switch (getPathDetails()[0]) {
    case 'categories':
      import('./categories.js');
      break;
    case 'products':
      import('./products.js');
      break;
    case 'cart':
      import('./cart.js');
      break;
    default:
      import('./main.js')
      .then(module => {
        router.appendChild(module.pageWidth);
        module.appendEvents();
      })
      break;
  }
}
window.onpopstate = routePage();
routePage();


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