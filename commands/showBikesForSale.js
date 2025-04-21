import chalk from 'chalk';
import { Product } from '../models/index.js';
import inquirer from 'inquirer';
import { showPartsOptionsAndPrice } from './showParts.js';

function getAllBikes () {
  return Product.findAll({
    where: {
      categoryId: 1
    },
    raw: true
  });
}

export async function showBikesForSale () {
  console.log(chalk.green('Here are the bikes that are available:'));
  const products = await getAllBikes();

  const bikeList = products.map(bike => ({
    name: bike.name,
    value: bike
  }));

  const answer = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'bike',
        message: 'Choose a bike',
        choices: bikeList
      },
    ]);

  await showPartsOptionsAndPrice(answer.bike);
}
