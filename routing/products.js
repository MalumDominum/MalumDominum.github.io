'use strict';
const dbUrl = "https://my-json-server.typicode.com/MalumDominum/MalumDominum.github.io";

import { getHashDetails } from "./processor.js";

let constructor = async function(container) {
    const pageWidth = document.createElement('div');
    pageWidth.classList.add("page-width");
    container.appendChild(pageWidth);
    let hash = getHashDetails();
    await fetch(new Request(dbUrl + '/products?url=' + hash[1]))
    .then(function(response) {
    return response.blob();
    }).then(async function(blob) {
        let product = JSON.parse(await blob.text())[0];
        await fetch(new Request(dbUrl + '/categories?id=' + product.categoryId))
        .then(function(response) {
        return response.blob();
        }).then(async function(blob) {
            const categoryData = JSON.parse(await blob.text())[0];
            product.categoryUrl = categoryData.url;
            product.categoryName = categoryData.name;
            product.subCategoryUrl = categoryData.subCategories[product.subCategoryId - 1].url;
            product.subCategoryName = categoryData.subCategories[product.subCategoryId - 1].name;
            const pathElement = document.createElement('nav')
            pathElement.classList.add("path");
            pathElement.innerHTML = 
            `<a class="path-link" data-route="">Главная страница</a>
            <svg class="arrow-right" viewBox="0 0 478.448 478.448">
                <path fill="#010002" d="M131.659 0l-31.165 32.035 213.31 207.197-213.31 207.141 31.156 32.075 246.304-239.216z"></path>
            </svg>
            <a class="path-link" data-route="#categories/${product.categoryUrl}">${product.categoryName}</a>
            <svg class="arrow-right" viewBox="0 0 478.448 478.448">
                <path fill="#010002" d="M131.659 0l-31.165 32.035 213.31 207.197-213.31 207.141 31.156 32.075 246.304-239.216z"></path>
            </svg>
            <a class="path-link" data-route="#categories/${product.subCategoryUrl}">${product.subCategoryName}</a>`

            const productSection = document.createElement('div');
            productSection.classList.add("product-section")
            productSection.innerHTML =
            `<div class="vertical-photos-container">
                ${product.images.map( (image) =>
                    `<a class="product-photo" style="background-image: url(product-photos/${image});"></a>`
                ).join('')}
            </div>
            <img src="product-photos/${product.images[0]}" alt="${product.name}" class="full-product-photo">
            <div class="product-description-container">
                ${product.sale ? `<p class="sale-label">Скидка ${product.sale}%</p>` : ``}
                <h1 class="product-title">${product.name}</h1>
                ${product.sale ? `<p class="product-price crossed-out">${(product.price).toFixed(2)} грн</p>
                                    <p class="product-price discounted">${(product.price * (100 - product.sale) / 100).toFixed(2)} грн</p>` 
                                : `<p class="product-price">${(product.price).toFixed(2)} грн</p>`}
                ${product.inStock ? `<div class="in-stock">В наличии</div>` 
                                    : `<div class="not-in-stock">Нет в наличии</div>`}
                <div class="product-quantity-container">
                    <a class="quantity plus"></a>
                    <input class="quantity-input" value="1">
                    <a class="quantity minus"></a>
                </div>
                <button ${product.inStock ? `` : `disabled` } class="add-to-cart-button" data-addtocart="${product.url}" data-quantity="1">В корзину</button>
                <p class="product-code">Код: ${product.code}</p>
                <p class="product-description">
                    ${product.description.replace(/(?:\r\n|\r|\n)/g, '<br>')}
                </p>
            </div>`

            const productPhotos = productSection.querySelectorAll(".product-photo");
            for (let i = 0; i < productPhotos.length; i++) {
                productPhotos[i].addEventListener('click', function() {
                    for (let j = 0; j < productPhotos.length; j++)
                        productPhotos[j].classList.remove('active');
                    productPhotos[i].classList.toggle('active');
                    productSection.querySelector(".full-product-photo").src = 
                        `product-photos/${product.images[i]}`;
                })
            };

            const quantityInput = productSection.querySelector(".quantity-input");
            productSection.querySelector(".quantity.plus").addEventListener('click', function() {
                if (quantityInput.value) 
                    quantityInput.value = (parseInt(quantityInput.value, 10) + 1).toString();
                else quantityInput.value = '1';
                productSection.querySelector(".add-to-cart-button").dataset.quantity = quantityInput.value;
            })

            productSection.querySelector(".quantity.minus").addEventListener('click', function() {
                if (quantityInput.value && parseInt(quantityInput.value, 10) > 1) 
                    quantityInput.value = (parseInt(quantityInput.value, 10) - 1).toString();
                else quantityInput.value = '1';
                productSection.querySelector(".add-to-cart-button").dataset.quantity = quantityInput.value;
            })

            
            pageWidth.appendChild(pathElement);
            pageWidth.appendChild(productSection);
        });
    });
}

export { constructor };