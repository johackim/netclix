#!/usr/bin/env node

import 'babel-polyfill';
import ora from 'ora';
import inquirer from 'inquirer';
import debug from 'debug';
import getImdbId from './imdb';
import getVodlockerLink from './vodlocker';

const log = debug('all');

(async () => {
    const media = await inquirer.prompt({
        type: 'list',
        name: 'type',
        message: 'Are you looking for a Movie or a Series?'
        choices: ['Movie', 'Series'],
        filter(val) {
            return val.toLowerCase();
        },

    });

    const search = await inquirer.prompt({
        type: 'input',
        name: 'search',
        message: 'What are you looking for?',
        validate: x => !!x || 'Please enter a valid search.',
    });

    let choices;

    try {
        const spinner = ora('Searching movies...').start();
        choices = await getImdbId(search.search);
        spinner.stop();

        if (!choices.length) {
            spinner.fail(`Couldn't find any results matching ${search.search}`);
            process.exit(0);
        }

    } catch (e) {
        log(e);
        console.error('\nUnknown error, please retry.');
        process.exit(0);
    }

    const media = await inquirer.prompt({
        type: 'list',
        name: 'name',
        message: 'Choose one from the choices below:',
        choices,
    });

    const spinner = ora('Searching streaming link...').start();

    if (media.type === 'series') {
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
            const link = await getVodlockerLink(media.name)
            spinner.succeed(`Your streaming link is here: ${link}`);
        } catch (e) {
            spinner.fail(e.message);
        }
    }

    spinner.stop();
})();
