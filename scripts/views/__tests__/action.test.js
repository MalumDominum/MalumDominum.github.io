/* eslint-env jest */
import actionPage from '../action.js';

describe('Action Page Module', () => {
    it('should return filled action page template', () => {
        const params = { };
        const expectedResult;
        expect(actionPage(params)).toBe(expectedResult);
    });
});
