import phantomjs from 'phantomjs-prebuilt';
import Horseman from 'node-horseman';

export default async search => new Horseman(phantomjs).open(`http://www.imdb.com/find?q=${search}&s=tt&ttype=fn_tt`)
    .evaluate(() => {
        const titles = [].slice.call(document.querySelectorAll('.result_text a')).slice(0, 10);
        return titles.map(title => ({
            name: title.text,
            value: title.text,
            // value: title.href.match(/tt[0-9]+/)[0],
        }));
    })
.close();
