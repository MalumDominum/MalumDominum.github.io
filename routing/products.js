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
    })
    let currentCategory = 
        [[products, categories].reduce((p, c) => 
        (c.forEach(o => m.has(o.id) &&
        Object.assign(p.get(o.id), {"categoryUrl": o.url}) || 
        p.set(o.CategoryId, o)), p), new Map).values()];
    console.log(currentCategory);
    let currentSubCategory = [[products, categories].reduce((m, a) => 
        (a.forEach(o => m.has(o.CategoryId) &&
        Object.assign(m.get(o.CategoryId), o) || 
        m.set(o.CategoryId, o)), m), new Map).values()];
    products.array.forEach(element => {
        // if (element.categoryId == window.location.hash) 
        //     let categoryId = element.categoryId
    });
    // products.array.forEach(element => {
    //     if (element.url == getHashDetails()[3]) 

    // });
});