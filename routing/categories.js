'use strict';

const dbUrl = "https://my-json-server.typicode.com/MalumDominum/MalumDominum.github.io";
import { getHashDetails } from "./processor.js";

let constructor = async function(container) {
    const pageWidth = document.createElement('div');
    pageWidth.classList.add('page-width');
    pageWidth.innerHTML = `
    <div class="categories">
        <ul class="collection-grid">
        </ul>
    </div>
    `;
    container.appendChild(pageWidth);
    let hash = getHashDetails();
    await fetch(new Request(dbUrl + '/categories?url=' + hash[1]))
    .then(function(response) {
        return response.blob();
    }).then(async function(blob) {
        const categoryData = JSON.parse(await blob.text())[0];
        await fetch(new Request(dbUrl + '/products?categoryId=' + categoryData.id))
        .then(function(response) {
        return response.blob();
        }).then(async function(blob) {
            const products = JSON.parse(await blob.text());
            const productsListEl = pageWidth.querySelector('.categories > ul.collection-grid');
            products.forEach(function (currentProduct){
                const currentProductEl = document.createElement('li');
                currentProductEl.classList.add('collection-item');
                currentProductEl.innerHTML = `
                <div data-route="#products/${currentProduct.url}" class="box-image">
                    <a class="collection-item-photo-container">
                        ${currentProduct.sale ? `<p class="sale-label in-collection">${currentProduct.sale}%</p>` : ``}
                        <img class="collection-item-photo" src="product-photos/${currentProduct.images[0]}">
                    </a>
                </div>
                <div class="collection-item-meta">
                    ${currentProduct.inStock ? `<div class="in-stock little">В наличии</div>` 
                                    : `<div class="not-in-stock little">Нет в наличии</div>`}
                    <p class="collection-item-title">${currentProduct.name}</p>
                    <div class="collection-item-price-container">
                        ${currentProduct.sale ? 
                            `<p class="product-price crossed-out">${(currentProduct.price).toFixed(2)} грн</p>
                            <p class="product-price discounted">${(currentProduct.price * (100 - currentProduct.sale) / 100).toFixed(2)} грн</p>` 
                            : `<p class="product-price">${(currentProduct.price).toFixed(2)} грн</p>`}
                    </div>
                    <button ${currentProduct.inStock ? `` : `disabled` } class="add-to-cart-button little" data-addtocart="${currentProduct.url}">В корзину</button>
                </div>
                `;
                productsListEl.appendChild(currentProductEl);
            });
        });
    });
}

export { constructor };



/*
<div class="page-width">
    <div class="categories">
        <div class="shop-sidebar">
            <div class="shop-sidebar-section">
                <h5 class="categories-header">
                    Цена
                    <div class="quantity plus slidebar"></div>
                </h5>
                <form class="price-filter-form">
                    <div class="price-filter-inner">
                        <input class="price-filter-input" type="text" maxlength="20">
                        <span class="price-filter-divider"> — </span>
                        <input class="price-filter-input" type="text" maxlength="20">
                        <a class="okay-button">Ок</a>
                    </div>
                </form>
            </div>
            <div class="shop-sidebar-section">
                <h5 class="categories-header">
                    Сортировать по
                    <a class="quantity plus slidebar"></a>
                </h5>
                <form class="radio-form">
                    <input type="radio" name="category" value="manga" class="radio">
                    <label for="manga" class="radio-label">Цене</label>
                    <svg class="arrow-right rotating-arrow sliding" viewBox="0 0 478.448 478.448">
                        <path fill="#010002" d="M131.659 0l-31.165 32.035 213.31 207.197-213.31 207.141 31.156 32.075 246.304-239.216z"></path>
                    </svg><br>
                    <input type="radio" name="category" value="comics" class="radio">
                    <label for="comics" class="radio-label">Скидкам</label><br>
                    <input type="radio" name="category" value="artbook" class="radio">
                    <label for="artbook" class="radio-label">Названию</label><br>
                    <input type="radio" name="category" value="ranobe" class="radio">
                    <label for="ranobe" class="radio-label">Наличии</label>
                </form>
            </div>
            <div class="shop-sidebar-section">
                <h5 class="categories-header">
                    Литература
                    <a class="quantity plus slidebar"></a>
                </h5>
                <form class="checkbox-form hidden">
                    <input type="checkbox" name="category" value="manga" class="checkbox">
                    <label for="manga" class="checkbox-label">Манга</label><br>
                    <input type="checkbox" name="category" value="comics" class="checkbox">
                    <label for="comics" class="checkbox-label">Комиксы</label><br>
                    <input type="checkbox" name="category" value="artbook" class="checkbox">
                    <label for="artbook" class="checkbox-label">Артбуки</label><br>
                    <input type="checkbox" name="category" value="ranobe" class="checkbox">
                    <label for="ranobe" class="checkbox-label">Ранобэ</label>
                </form>
            </div>
        </div>

        <ul class="collection-grid">
            <li class="collection-item">
                <div class="box-image">
                    <a class="collection-item-photo-container">
                        <p class="sale-label in-collection">30%</p>
                        <img class="collection-item-photo" src="product-photos/adventure-time-of-marceline-and-the-scream-queen.jpg">
                    </a>
                </div>
                <div class="collection-item-meta">
                    <div class="in-stock little">В наличии</div>
                    <p class="collection-item-title">Re:Zero - Rem Fallen Angel LPM Prize Figure</p>
                    <div class="collection-item-price-container">
                        <p class="product-price crossed-out">400 грн</p>
                        <p class="product-price discounted">200 грн</p>
                    </div>
                    <button class="add-to-cart-button little">В корзину</button>
                </div>
            </li>
            <li class="collection-item">
                <div class="box-image">
                    <a class="collection-item-photo-container">
                        <p class="sale-label in-collection">30%</p>
                        <img class="collection-item-photo" src="product-photos/adventure-time-of-marceline-and-the-scream-queen.jpg">
                    </a>
                </div>
                <div class="collection-item-meta">
                    <div class="in-stock little">В наличии</div>
                    <p class="collection-item-title">Re:Zero - Rem Fallen Angel LPM Prize Figure</p>
                    <div class="collection-item-price-container">
                        <p class="product-price crossed-out">400 грн</p>
                        <p class="product-price discounted">200 грн</p>
                    </div>
                    <button class="add-to-cart-button little">В корзину</button>
                </div>
            </li>
            <li class="collection-item">
                <div class="box-image">
                    <a class="collection-item-photo-container">
                        <p class="sale-label in-collection">30%</p>
                        <img class="collection-item-photo" src="product-photos/asuna-sao.jpg">
                    </a>
                </div>
                <div class="collection-item-meta">
                    <div class="in-stock little">В наличии</div>
                    <p class="collection-item-title">Re:Zero - Rem Fallen Angel LPM Prize Figure</p>
                    <div class="collection-item-price-container">
                        <p class="product-price crossed-out">400 грн</p>
                        <p class="product-price discounted">200 грн</p>
                    </div>
                    <button class="add-to-cart-button little">В корзину</button>
                </div>
            </li>
            <li class="collection-item">
                <div class="box-image">
                    <a class="collection-item-photo-container">
                        <p class="sale-label in-collection">30%</p>
                        <img class="collection-item-photo" src="product-photos/character-design-quarterly-.jpg">
                    </a>
                </div>
                <div class="collection-item-meta">
                    <div class="in-stock little">В наличии</div>
                    <p class="collection-item-title">Re:Zero - Rem Fallen Angel LPM Prize Figure</p>
                    <div class="collection-item-price-container">
                        <p class="product-price crossed-out">400 грн</p>
                        <p class="product-price discounted">200 грн</p>
                    </div>
                    <button class="add-to-cart-button little">В корзину</button>
                </div>
            </li>
        </ul>
    </div>
</div>
*/