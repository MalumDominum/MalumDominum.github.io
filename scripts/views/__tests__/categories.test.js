/* eslint-env jest */
import categoriesPage from '../categories.js';

describe('Categories Page Module', () => {
    it('should return filled categories page template', () => {
        const params = { };
        const expectedResult;
        expect(categoriesPage(params)).toBe(expectedResult);
    });
});
