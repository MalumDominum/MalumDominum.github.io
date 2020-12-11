/* eslint-env jest */
import cartPage from '../cart.js';

describe('Cart Page Module', () => {
    it('should return filled cart page template', () => {
        const params = { };
        const expectedResult;
        expect(cartPage(params)).toBe(expectedResult);
    });
});
