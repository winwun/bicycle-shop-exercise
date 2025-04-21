import inquirer from 'inquirer';
import { getAvailableOptionsByDependency } from '../lib/getAvailableOptionsByDependency.js';
import { showAllOptionsForPart } from '../lib/helper.js';
import { calculateTotalPrice } from '../lib/getTotalPrice.js';
import chalk from 'chalk';

async function promptSelection ({ name, message, choices }) {
  const answer = await inquirer
    .prompt([
      {
        type: 'list',
        name,
        message,
        choices
      },
    ]);

  return answer[name];
}

export async function customizeBike () {
  let availableBikeParts = [];
  availableBikeParts = await getAvailableOptionsByDependency();

  let selectedOptions = [];

  const frameTypes = showAllOptionsForPart(availableBikeParts, 1);
  const selectedFrameType = await promptSelection({ name: 'frameType', message: 'Choose a frame type', choices: frameTypes });
  selectedOptions.push({ partOptionId: selectedFrameType });

  availableBikeParts = await getAvailableOptionsByDependency(selectedOptions);

  const frameFinish = showAllOptionsForPart(availableBikeParts, 2);
  const selectedFrameFinish = await promptSelection({ name: 'frameFinish', message: 'Choose a frame finish', choices: frameFinish });
  selectedOptions.push({ partOptionId: selectedFrameFinish });

  availableBikeParts = await getAvailableOptionsByDependency(selectedOptions);

  const frameColor = showAllOptionsForPart(availableBikeParts, 3);
  const selectedFrameColor = await promptSelection({ name: 'frameColor', message: 'Choose a frame color', choices: frameColor });
  selectedOptions.push({ partOptionId: selectedFrameColor });

  availableBikeParts = await getAvailableOptionsByDependency(selectedOptions);

  const frameSize = showAllOptionsForPart(availableBikeParts, 4);
  const selectedFrameSize = await promptSelection({ name: 'frameSize', message: 'Choose a frame size', choices: frameSize });
  selectedOptions.push({ partOptionId: selectedFrameSize });

  availableBikeParts = await getAvailableOptionsByDependency(selectedOptions);

  const frameMaterial = showAllOptionsForPart(availableBikeParts, 5);
  const selectedFrameMaterial = await promptSelection({ name: 'frameMaterial', message: 'Choose a frame material', choices: frameMaterial });
  selectedOptions.push({ partOptionId: selectedFrameMaterial });

  const priceDetails = await calculateTotalPrice(selectedOptions);

  const finalOptions = priceDetails.selectedOptions.map(option => ({
    optionId: option.optionId,
    partName: option.partName,
    optionName: option.optionName,
    price: option.price
  }));

  console.log(chalk.blue(`Total price: ${priceDetails.totalPrice}`));
  console.table(finalOptions);
}
