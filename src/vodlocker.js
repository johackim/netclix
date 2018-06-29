import debug from 'debug';
import phantomjs from 'phantomjs-prebuilt';
import Horseman from 'node-horseman';
import sleep from 'sleep-promise';

const log = debug('all');
let attempt = 0;
const maxAttempts = 5;

let embed;

const vodlocker = async (name, season, episode) => {
    const nameEncoded = encodeURIComponent(name).toLowerCase();

    if (attempt >= maxAttempts) {
        throw new Error(`No streaming link, try to test on https://vodlocker.to/embed?t=${nameEncoded}`);
    }

    if (!!season && !!episode) {
        embed = await new Horseman(phantomjs).open(`https://vodlocker.to/embed?referrer=link&t=${nameEncoded}&season=${season}&episode=${episode}`)
        .evaluate(() => {
            if (document.getElementById('player_frame')) {
                return document.getElementById('player_frame').innerHTML;
            }

            return null;
        })
        .close();

        if (!embed) {
            attempt += 1;
            log(`Attempt ${attempt} ${name} ${season} ${episode}`);
            await sleep(1000);
            return vodlocker(name, season, episode);
        }
    } else {
        embed = await new Horseman(phantomjs).open(`http://vodlocker.to/embed?t=${name}`)
            .evaluate(() => {
                if (document.getElementById('player_frame')) {
                 return document.getElementById('player_frame').innerHTML;
             }

            return null;
        })
        .close();
        if (!embed) {
            attempt += 1;
            log(`Attempt ${attempt} ${name}`);
            await sleep(1000);
            return vodlocker(name);
        }
    }
    return embed.match(/(((http[s]?|ftp):\/)?\/?([^:/\s]+)((\/\w+)*\/)([\w\-.]+[^#?\s]+)(.*)?(#[\w-]+)?)&quot;,/)[1];
};

export default vodlocker;
