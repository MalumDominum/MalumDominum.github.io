/* eslint-env jest */
import actionPage from '../actionPage';

describe('Action Page Module', () => {
    it('should return filled action page template', () => {
        const params = {
            img: 'image',
            date: 'date',
            title: 'title',
            desc: 'desc',
        };
        const expectedResult = `
    <div class = "container-fluid">
        <div class = "row">
            <div class="col-sm-12 col-md-8">
                <img src="img/image" id = "action_detal" alt="">
            </div>
            <div class="col-sm-12 col-md-4">
                <p>date</p>
                <h3>title</h3>
                <p> desc</p>
            </div>
        </div>
    </div>
    `;
        expect(actionPage(params)).toBe(expectedResult);
    });
});
