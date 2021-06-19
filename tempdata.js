/* eslint-disable import/no-extraneous-dependencies */
/* generates randomized mock data */

/* eslint-disable no-console */
const { resolve } = require('json-schema-faker');
const fs = require('fs');
const chalk = require('chalk');

const books = {
  type: 'array',
  minItems: 3,
  maxItems: 5,
  items: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
      },
      genre: {
        type: 'string',
      },
      author: {
        type: 'string',
        faker: 'name.findName',
      },
    },
    required: ['title', 'genre', 'author'],
  },
};

resolve(books).then((sample) => {
  fs.writeFile('./db.json', JSON.stringify(sample), (err) => {
    if (err) {
      console.log(chalk.red(err));
    } else {
      console.log(chalk.green('Mock Data generated'));
    }
  });
});
