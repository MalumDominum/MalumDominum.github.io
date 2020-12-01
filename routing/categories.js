'use strict';

const dbUrl = "https://my-json-server.typicode.com/MalumDominum/MalumDominum.github.io";
const categoriesRequest = new Request(dbUrl + "/categories")

let constructor = async function(container) {
    const pageWidth = document.createElement('div');
    pageWidth.classList.add("page-width");
    container.appendChild(pageWidth);
    let hash = getHashDetails();
    
    pageWidth.appendChild(pathElement);
    pageWidth.appendChild(productSection);
}

export { constructor };