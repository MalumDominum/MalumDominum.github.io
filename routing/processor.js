'use strict';

let getHashDetails = function() {
    let splitedHash = window.location.hash.replace('#', '').split('/');
    switch (splitedHash.length) {
        case 1: return [ splitedHash[0] ];  //cart

        case 2: return [ splitedHash[0],    //categories | products
                         splitedHash[1] ];

        default: return [''];
    }
};

let cleanElement = function(element) {
    while(element.hasChildNodes())
        element.removeChild(element.lastChild);
}

export { getHashDetails, cleanElement };