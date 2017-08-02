#!/usr/bin/env node

import 'babel-polyfill';
import ora from 'ora';
import inquirer from 'inquirer';
import getImdbId from './imdb';
import getVodlockerLink from './vodlocker';

(async () => {
    const media = await inquirer.prompt({
        type: 'list',
        name: 'type',
        message: 'Do you want a movie or show?',
        choices: ['Movie', 'Show'],
        filter(val) {
            return val.toLowerCase();
        },
    });
    const search = await inquirer.prompt({
        type: 'input',
        name: 'search',
        message: 'What media are you looking for?',
        validate: x => !!x || 'Please enter a valid search.',
    });

    let choices;

    try {
        const spinner = ora('Searching media...').start();
        choices = await getImdbId(search.search);
        spinner.stop();

        if (!choices.length) {
            spinner.fail(`Couldn't find any results matching ${search.search}`);
            process.exit(0);
        }
    } catch (e) {
        console.error('\nOops! Unknown error, please retry...');
        process.exit(0);
    }

    const video = await inquirer.prompt({
        type: 'list',
        name: 'id',
        message: 'Choose one of the choices:',
        choices,
    });

    const spinner = ora('Searching streaming link...').start();

    if (media.type === 'show') {
        const season = await inquirer.prompt({
            type: 'input',
            name: 'season',
            message: 'Which season?',
        });

        const episode = await inquirer.prompt({
            type: 'input',
            name: 'episode',
            message: 'Which episode?',
        });
        try {
            const link = await getVodlockerLink(video.id, season.season, episode.episode);
            spinner.succeed(`Your streaming link is here: ${link}`);
        } catch (e) {
            spinner.fail(e.message);
        }
    } else {
        try {
            const link = await getVodlockerLink(video.id);
            spinner.succeed(`Your streaming link is here: ${link}`);
        } catch (e) {
            spinner.fail(e.message);
        }
    }


    spinner.stop();
})();
