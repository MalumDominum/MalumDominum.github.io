/* eslint-env jest */
import productPage from '../products.js';

describe('Product Page Module', () => {
    it('should return filled product page template', () => {
        const params = { };
        const expectedResult;
        expect(productPage(params)).toBe(expectedResult);
    });
});
