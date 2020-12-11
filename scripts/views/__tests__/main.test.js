/* eslint-env jest */
import mainPage from '../main.js';

describe('Main Page Module', () => {
    it('should return filled main page template', () => {
        const params = { };
        const expectedResult;
        expect(mainPage(params)).toBe(expectedResult);
    });
});
