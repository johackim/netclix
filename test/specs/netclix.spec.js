import getVodlockerLink from '../../src/vodlocker';
import getImdbId from '../../src/imdb';

describe('netclix', () => {
    it.skip('should get vodlocker link for movie by IMDB ID', async () => {
        const id = 'tt0133093';
        const link = await getVodlockerLink(id);

        assert.equal(link, 'https://docs.google.com/file/d/0B5MkJ0Jpf-poekdkOHgwNURNTlE/preview');
    });

    it('should get vodlocker link for movie by name', async () => {
        const name = 'The Matrix';
        const link = await getVodlockerLink(name);

        assert.equal(link, 'https://docs.google.com/file/d/0B5MkJ0Jpf-poekdkOHgwNURNTlE/preview');
    });

    it.skip('should get vodlocker link for series by IMDB ID', async () => {
        const id = 'tt013309';
        const season = 2;
        const episode = 4;
        const link = await getVodlockerLink(id, season, episode);

        assert.equal(link, 'https://openload.co/embed/jZFZBHZACe8');
    });

    it('should get vodlocker link for series by name', async () => {
        const name = 'Breaking Bad';
        const season = 2;
        const episode = 4;
        const link = await getVodlockerLink(name, season, episode);

        assert.equal(link, 'https://openload.co/embed/jZFZBHZACe8');
    });


    it('should get imdb movies', async () => {
        const search = 'Matrix';
        const media = await getImdbId(search);

        assert.equal(media.length, 10);
    });

    it('should get imdb series', async () => {
        const search = 'Breaking Bad';
        const media = await getImdbId(search);

        assert.equal(media.length, 10);
    });


    
});
