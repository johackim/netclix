#!/usr/bin/env node

import 'babel-polyfill';
import ora from 'ora';
import inquirer from 'inquirer';
import debug from 'debug';
import imdb from './imdb';
import vodlocker from './vodlocker';

const log = debug('all');

(async () => {
    const search = await inquirer.prompt({
        type: 'input',
        name: 'search',
        message: 'What movie are you looking for?',
        validate: x => !!x || 'Please enter a valid search.',
    });

    let choices;

    try {
        const spinner = ora('Searching movies...').start();
        choices = await imdb(search.search);
        spinner.stop();

        if (!choices.length) {
            spinner.fail(`Couldn't find any results matching ${search.search}`);
            process.exit(0);
        }
    } catch (e) {
        log(e);
        console.error('\nOups! Unknow error, please retry...');
        process.exit(0);
    }

    const movie = await inquirer.prompt({
        type: 'list',
        name: 'name',
        message: 'Choose one of the movies:',
        choices,
    });

    const spinner = ora('Searching streaming link...').start();

    try {
        const link = await vodlocker(movie.name);
        spinner.succeed(`Your streaming link is here: ${link}`);
    } catch (e) {
        spinner.fail(e.message);
    }

    spinner.stop();
})();
