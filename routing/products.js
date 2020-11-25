'use strict';
const dbUrl = "https://my-json-server.typicode.com/MalumDominum/MalumDominum.github.io";
const productsRequest = new Request(dbUrl + "/products");
const categoriesRequest = new Request(dbUrl + "/categories")

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
                    c.subCategories.forEach(s => { 
                        if (p.subCategoryId === s.id) p.subCategoryUrl = s.url; 
                    });
                };
            });
        });
        console.log(products);
        // products.array.forEach(element => {
        // if (element.categoryId === window.location.hash) 
        //     let categoryId = element.categoryId
        //})
    });
    // products.array.forEach(element => {
    //     if (element.url === getHashDetails()[3]) 

    // });
});