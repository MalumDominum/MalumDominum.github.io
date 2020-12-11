import { getHashDetails } from "./processor.js";

const dbUrl = "https://my-json-server.typicode.com/MalumDominum/AnimeInternetShopDb";

let constructor = async function(container) {
    await fetch(new Request(dbUrl + '/actions?url=' + getHashDetails()[1]))
    .then(function(response) {
        return response.blob();
    }).then(async function(blob) {
        let action = JSON.parse(await blob.text())[0];
        const pageWidth = document.createElement('div');
        pageWidth.classList.add("page-width");
        pageWidth.innerHTML =
        `<h1 class="action-title">${action.title}</h1>
        <img src="${action.photo}" class="action-image">
        <p>${action.description}</p>`

        container.appendChild(pageWidth);
    }
);}

export { constructor };