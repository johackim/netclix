import vodlocker from '../../src/vodlocker';
import imdb from '../../src/imdb';

describe('netclix', () => {
    it('should get vodlocker link', async () => {
        const id = 'tt0133093';
        const link = await vodlocker(id);

        assert.equal(link, 'https://docs.google.com/file/d/0B5MkJ0Jpf-poekdkOHgwNURNTlE/preview');
    });

    it('should get imdb movies', async () => {
        const search = 'Matrix';
        const movies = await imdb(search);

        assert.equal(movies.length, 10);
    });
});
