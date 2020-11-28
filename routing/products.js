'use strict';
const dbUrl = "https://my-json-server.typicode.com/MalumDominum/MalumDominum.github.io";
const productsRequest = new Request(dbUrl + "/products");
const categoriesRequest = new Request(dbUrl + "/categories")
import { getHashDetails } from "./routing.js"

fetch(productsRequest)
.then(function(response) {
  return response.blob();
}).then(async function(blob) {
    const products = JSON.parse(await blob.text());
    fetch(categoriesRequest)
    .then(function(response) {
        return response.blob();
    }).then(async function(blob) {
        const categories = JSON.parse(await blob.text());
        products.forEach(p => {
            categories.forEach(c => {
                if (p.categoryId === c.id) {
                    p.categoryUrl = c.url;
                    p.categoryName = c.name; 
                    c.subCategories.forEach(s => { 
                        if (p.subCategoryId === s.id) {
                            p.subCategoryUrl = s.url;
                            p.subCategoryName = s.name; 
                        }
                    });
                };
            });
        });
        let hash = getHashDetails();
        let currentProduct;
        if (hash.length === 2)
            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                if (product.url === hash[1]) {
                    currentProduct = product;
                    break;
                }
            }
        else if (hash.length === 3)
            for (let i = 0; i < products.length; i++) {
                let product = products[i];
                if (product.url === hash[1] && (product.subCategoryUrl === hash[2] || product.categoryUrl === hash[2])) {
                    currentProduct = product;
                    break;
                }
            };
        const pathElement = document.createElement('nav')
        pathElement.classList.add("path");
        pathElement.innerHTML = 
        `<a class="path-link" data-route="">Главная страница</a>
        <span><svg class="icon icon-chevron-right" viewBox="0 0 478.448 478.448">
            <path fill="#010002" d="M131.659 0l-31.165 32.035 213.31 207.197-213.31 207.141 31.156 32.075 246.304-239.216z"></path>
        </svg></span>
        <a class="path-link" data-route="#categories/${currentProduct.categoryUrl}">${currentProduct.categoryName}</a>
        <span><svg class="icon icon-chevron-right" viewBox="0 0 478.448 478.448">
            <path fill="#010002" d="M131.659 0l-31.165 32.035 213.31 207.197-213.31 207.141 31.156 32.075 246.304-239.216z"></path>
        </svg></span>
        <a class="path-link" data-route="#categories/${currentProduct.subCategoryUrl}">${currentProduct.subCategoryName}</a>`

        const photoSection = document.createElement('div');
        photoSection.classList.add("photo-section")
        photoSection.innerHTML =
        `<div class="grid">
            <div class="vertical-photos-container">
                <a class="product-photo" style="background-image: url(figures/alphons-fa.jpg);"></a>
            </div>
            <div class="full-product-photo"></div>
            <div class="product-description-container">
                <h1 class="product-title">Re:Zero - Rem Magician Figure</h1>
                <p class="product-price">$21.99</p>
                <div class="in-stock"></div>
                <div class="product-quantity-container">
                    <span class="quantity-less"></span>
                    <input class="quantity-input">
                    <span class="quantity-more"></span>
                </div>
                <buttom class="add-to-cart-button">Add to cart</buttom>
                <span class="product-code">CMX75</span>
                <p class="product-description"></p>
            </div>
        </div>`

        const pageWidth = document.createElement('div');
        pageWidth.classList.add("page-width");

        let productPhoto = document.getElementById("product-photo");
        productPhoto.addEventListener('click', function () {
            headerMobile.classList.toggle('active')
        });

        const productPhotos = document.getElementsByClassName("product-photo");
        for (let i = 0; i < productPhotos.length; i++) {
            productPhotos[i].addEventListener('click', function () {
                for (let j = 0; j < productPhotos.length; j++)
                    productPhotos[j].classList.remove('active');
                productPhotos[i].classList.toggle('active');
            })
        };
        
        pageWidth.appendChild(pathElement);
        pageWidth.appendChild(photoSection);
        export { pathElement, pageWidth };
    });
});