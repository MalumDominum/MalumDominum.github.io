'use strict';
const dbUrl = "https://my-json-server.typicode.com/MalumDominum/MalumDominum.github.io";
const productsRequest = new Request(dbUrl + "/products");
const categoriesRequest = new Request(dbUrl + "/categories")

let getHashDetails = function() {
    let splitedHash = window.location.hash.replace('#', '').split('/');
    switch (splitedHash.length) {
        case 1: return [ splitedHash[0] ];  //cart

        case 2: return [ splitedHash[0],    //categories | products
                         splitedHash[1] ];

        case 4: return [ splitedHash[2],    // products
                         splitedHash[3],    // product name
                         splitedHash[1] ];  // category
                         
        default: return [''];
    }
};

function binarySearch(value, list) {
    let first = 0;    //left endpoint
    let last = list.length - 1;   //right endpoint
    let position = -1;
    let found = false;
    let middle;
 
    while (found === false && first <= last) {
        middle = Math.floor((first + last)/2);
        if (list[middle] == value) {
            found = true;
            position = middle;
        } else if (list[middle] > value) {  //if in lower half
            last = middle - 1;
        } else {  //in in upper half
            first = middle + 1;
        }
    }
    return position;
}

async function getProducts() {
    let products;
    await fetch(productsRequest)
    .then(function(response) {
      return response.blob();
    }).then(async function(blob) {
        products = JSON.parse(await blob.text());
        await fetch(categoriesRequest)
        .then(function(response) {
            return response.blob();
        }).then(async function(blob) {
            let categories = JSON.parse(await blob.text());
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
        });
    });
    return products;
}

export { getProducts, getHashDetails };