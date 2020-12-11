'use strict';
const dbUrl = "https://my-json-server.typicode.com/MalumDominum/AnimeInternetShopDb";

let constructor = async function(container) {
    const pageWidth = document.createElement('div');
    pageWidth.classList.add('page-width');
    pageWidth.innerHTML = `
    <div class="cart">
        <h2>Ваша корзина</h2>
        <div class="cart-items">
            <div class="cart-items-header">
                <div class="cart-items-header-product">Продукт</div>
                <div></div>
                <div class="cart-items-header-price">Цена и количество</div>
                <div class="cart-items-header-total">Сумма</div>
            </div>
        </div>
        <div class="cart-buttons">
            <button id="clearCart" class="okay-button red">Очистить корзину</button>
            <button id="order" class="okay-button">Заказать</button>
        </div>
    </div>
    `;
    container.appendChild(pageWidth);
    pageWidth.querySelector('#clearCart').addEventListener("click", function() {
        localStorage.setItem('cartData', '{}');
        document.querySelector('.header-link-cart').click();
    });
    const localStorageCartData = JSON.parse(localStorage.getItem('cartData'));
    let cartProductsRequest = '';
    for(let url in localStorageCartData) {
        cartProductsRequest += 'url=' + url + '&';
    }
    if(cartProductsRequest.length) {
        await fetch(new Request(dbUrl + '/products?' + cartProductsRequest))
        .then(function(response) {
        return response.blob();
        }).then(async function(blob) {
            let dbCartData = JSON.parse(await blob.text());
            let totalPrice = 0;
            dbCartData.forEach(function(currentCartProduct) {
                const currentCartEl = document.createElement('div');
                currentCartEl.classList.add('cart-items-single');
                let displayPrice = 0;
                let price = 0;
                const quantity = localStorageCartData[currentCartProduct.url];
                if(currentCartProduct.sale) {
                    displayPrice = (currentCartProduct.price).toFixed(2);
                    price = (currentCartProduct.price * (100 - currentCartProduct.sale) / 100).toFixed(2);
                } else {
                    displayPrice = null;
                    price = (currentCartProduct.price).toFixed(2);
                }
                totalPrice += +(price * quantity);

                currentCartEl.innerHTML = `
                    <img src="product-photos/${currentCartProduct.images[0]}"/>
                    <div class="cart-items-single-name">${currentCartProduct.name}</div>
                    ${currentCartProduct.sale ? `<div class="cart-items-single-price">${price} <span>(${displayPrice})</span> грн * ${quantity}</div>` 
                                    : `<div class="cart-items-single-price">${price} грн * ${quantity}</div>`}
                    ${currentCartProduct.sale ? ` <div class="cart-items-single-total">${price * quantity} <span>(${displayPrice * quantity})</span> грн</div>` 
                                    : `<div class="cart-items-single-total">${price * quantity} грн</div>`}
                `;
                pageWidth.querySelector('.cart-items').appendChild(currentCartEl);
            });
            const cartFooterEl = document.createElement('div');
            cartFooterEl.classList.add('cart-items-footer');
            cartFooterEl.innerHTML = `
                <div class="cart-items-header-product">Итог:</div>
                <div></div>
                <div class="cart-items-header-price"></div>
                <div class="cart-items-header-total">${totalPrice.toFixed(2)}грн</div>
            `;
            pageWidth.querySelector('.cart-items').appendChild(cartFooterEl);
        });
    } else {
        pageWidth.querySelector('.cart > h2').innerHTML = "Ваша корзина пуста";
        pageWidth.querySelector('.cart-buttons').innerHTML = '';
        pageWidth.querySelector('.cart-items').innerHTML = '';
    }
}

export { constructor };