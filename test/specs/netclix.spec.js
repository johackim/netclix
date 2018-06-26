import vodlocker from '../../src/vodlocker';
import imdb from '../../src/imdb';

describe('netclix', () => {
    it.skip('should get vodlocker link by IMDB ID', async () => {
        const id = 'tt0133093';
        const link = await vodlocker(id);

        assert.equal(link, 'http://openload.co/embed/x-lB6MFyx6c/The.Matrix.1999.720p.BrRip.264.YIFY.mp4');
    });

    it('should get vodlocker link by name', async () => {
        const name = 'The Matrix';
        const link = await vodlocker(name);

        assert.equal(link, 'http://openload.co/embed/x-lB6MFyx6c/The.Matrix.1999.720p.BrRip.264.YIFY.mp4');
    });

    it('should get imdb movies', async () => {
        const search = 'Matrix';
        const movies = await imdb(search);

        assert.equal(movies.length, 10);
    });
});
