'use strict';
import { getHashDetails, getProducts } from "./processor.js";

const pageWidth = document.createElement('div');
pageWidth.classList.add("page-width");

getProducts().then(function(products) {
    let hash = getHashDetails();
    let product;
    if (hash.length === 2)
        for (let i = 0; i < products.length; i++) {
            let tempProduct = products[i];
            if (tempProduct.url === hash[1]) {
                product = tempProduct;
                break;
            }
        }
    else if (hash.length === 3)
        for (let i = 0; i < products.length; i++) {
            let tempProduct = products[i];
            if (tempProduct.url === hash[1] && (tempProduct.subCategoryUrl === hash[2] || tempProduct.categoryUrl === hash[2])) {
                product = tempProduct;
                break;
            }
        };

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
            `<a class="product-photo" style="background-image: url(product-photos/${product.categoryUrl}/${product.subCategoryUrl}/${image});"></a>`
        ).join('')}
    </div>
    <img src="product-photos/${product.categoryUrl}/${product.subCategoryUrl}/${product.images[0]}" alt="${product.name}" class="full-product-photo">
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
        <button class="add-to-cart-button">В корзину</button>
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
                `product-photos/${product.categoryUrl}/${product.subCategoryUrl}/${product.images[i]}`;
        })
    };

    const quantityInput = productSection.querySelector(".quantity-input");
    productSection.querySelector(".quantity.plus").addEventListener('click', function() {
        if (quantityInput.value) 
            quantityInput.value = (parseInt(quantityInput.value, 10) + 1).toString();
        else quantityInput.value = '1';
    })

    productSection.querySelector(".quantity.minus").addEventListener('click', function() {
        if (quantityInput.value && parseInt(quantityInput.value, 10) > 1) 
            quantityInput.value = (parseInt(quantityInput.value, 10) - 1).toString();
        else quantityInput.value = '1';
    })
    
    pageWidth.appendChild(pathElement);
    pageWidth.appendChild(productSection);
});

export { pageWidth };