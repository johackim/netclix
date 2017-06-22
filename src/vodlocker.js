import debug from 'debug';
import Horseman from 'node-horseman';
import sleep from 'sleep-promise';

const log = debug('all');
let attempt = 0;
const maxAttempts = 5;

const vodlocker = async (id) => {
    if (attempt >= maxAttempts) {
        throw new Error('No streaming link');
    }

    const embed = await new Horseman().open(`http://vodlocker.to/embed?i=${id}`)
        .evaluate(() => {
            if (document.getElementById('player_frame')) {
                return document.getElementById('player_frame').innerHTML;
            }

            return null;
        })
    .close();

    if (!embed) {
        attempt += 1;
        log(`Attempt ${attempt} ${id}`);
        await sleep(1000);
        return vodlocker(id);
    }

    return embed.match(/(((http[s]?|ftp):\/)?\/?([^:/\s]+)((\/\w+)*\/)([\w\-.]+[^#?\s]+)(.*)?(#[\w-]+)?)&quot;,/)[1];
};

export default vodlocker;
