import debug from 'debug';
import phantomjs from 'phantomjs-prebuilt';
import Horseman from 'node-horseman';
import sleep from 'sleep-promise';

const log = debug('all');
let attempt = 0;
const maxAttempts = 5;

let embed;

const vodlocker = async (id, season, episode) => {
    if (attempt >= maxAttempts) {
        throw new Error(`No streaming link, try to test on http://vodlocker.to/embed?i=${id}`);
    }
    if (season !== 'undefined') {
        if (episode !== 'undefined') {
            embed = await new Horseman(phantomjs).open(`http://vodlocker.to/embed?i=${id}&season=${season}&episode=${episode}`)
           .evaluate(() => {
               if (document.getElementById('player_frame')) {
                   return document.getElementById('player_frame').innerHTML;
               }
               return null;
           })
           .close();
            if (!embed) {
                attempt += 1;
                log(`Attempt ${attempt} ${id} ${season} ${episode}`);
                await sleep(1000);
                return vodlocker(id, season, episode);
            }
        }
    } else {
        embed = await new Horseman(phantomjs).open(`http://vodlocker.to/embed?i=${id}`)
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
    }
    return embed.match(/(((http[s]?|ftp):\/)?\/?([^:/\s]+)((\/\w+)*\/)([\w\-.]+[^#?\s]+)(.*)?(#[\w-]+)?)&quot;,/)[1];
};

export default vodlocker;
