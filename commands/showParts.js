import chalk from 'chalk';
import { calculateTotalPrice } from '../lib/getTotalPrice.js';
import { PartOption, ProductPart } from '../models/index.js';

function getAllPartOptionsOfSelectedBike (id) {
  return ProductPart.findAll({
    where: {
      productId: id
    },
    attributes: [],
    include: [
      {
        model: PartOption,
        as: 'partOption'
      }
    ],
    nest: true,
    raw: true
  });
}

export async function showPartsOptionsAndPrice (bike) {
  const bikeParts = await getAllPartOptionsOfSelectedBike(bike.productId);

  const optionIdList = bikeParts.map(bikePart => ({ partOptionId: bikePart.partOption.partOptionId }));

  const priceDetails = await calculateTotalPrice(optionIdList);

  const selectedOptions = priceDetails.selectedOptions.map(option => ({
    optionId: option.optionId,
    partName: option.partName,
    optionName: option.optionName,
    price: option.price
  }));

  console.log(chalk.blue(`Total price: ${priceDetails.totalPrice}`));
  console.table(selectedOptions);
}
