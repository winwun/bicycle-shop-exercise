
import { program } from 'commander';
import { showBikesForSale } from './commands/showBikesForSale.js';
import { customizeBike } from './commands/customizeBike.js';
import inquirer from 'inquirer';

program.version('1.0.0').description('Marcus Bicycle Shop');

export function initializeMenu () {
  const choices = {
    'View bikes for sale': showBikesForSale,
    'Customize my own bike': customizeBike
  };

  program.action(async () => {
    const answer = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'selectAction',
          message: 'Choose a bike or customize your own',
          choices: Object.keys(choices)
        },
      ]);

    await choices[answer.selectAction]();
  });

  program.parse(process.argv);
}

initializeMenu();
