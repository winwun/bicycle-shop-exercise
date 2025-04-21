import { PartOption, PriceRule } from '../models/index.js';
import { getPartsWithOptions } from './helper.js';

async function getPriceRulesForSelectedOptions(selectedOptionIds) {
  return await PriceRule.findAll({
    where: {
      partOptionId: selectedOptionIds
    },
    include: [
      {
        model: PartOption,
        as: 'dependentOption',
        attributes: ['partOptionId', 'name', 'price']
      }
    ],
    raw: true,
    nest: true
  });
}

function createPriceOverrideMap(priceRules) {
  const priceOverrideMap = {};

  priceRules.forEach(rule => {
    const targetOptionId = rule.targetPartOptionId;

    priceOverrideMap[targetOptionId] = {
      price: rule.newPrice,
      name: rule.name
    };
  });

  return priceOverrideMap;
}

export async function calculateTotalPrice(selectedOptions) {
  try {
    const parts = await getPartsWithOptions();

    const selectedOptionIds = selectedOptions.map(option => option.partOptionId);

    const priceRules = await getPriceRulesForSelectedOptions(selectedOptionIds);
    const isAffectedByPriceRule = priceRules?.find(rule => selectedOptionIds.includes(rule.partOptionId));

    let priceOverrideMap = {};

    if (isAffectedByPriceRule) {
      priceOverrideMap = createPriceOverrideMap(priceRules);
    }

    const selectedOptionsWithDetails = parts.filter(part => selectedOptionIds.includes(part.options.partOptionId));
    const selectedOptionsWithDetailsAndDependencies = selectedOptionsWithDetails.map(selectedOption => ({
      ...selectedOption,
      ...(priceOverrideMap[selectedOption.options.partOptionId] ? {
        priceRule: priceOverrideMap[selectedOption.options.partOptionId]
      } : {})
    }));

    let totalPrice = 0;

    const updatedPriceOfSelectedOptions = selectedOptionsWithDetailsAndDependencies.map(selectedOption => {
      let price;

      if (isAffectedByPriceRule && selectedOption.priceRule) {
        price = parseFloat(selectedOption.priceRule.price);
        totalPrice += price;
      } else {
        price = parseFloat(selectedOption.options.price);
        totalPrice += price;
      }

      return {
        ...selectedOption,
        options: {
          ...selectedOption.options,
          price
        }
      };
    });

    return {
      totalPrice: totalPrice.toFixed(2),
      selectedOptions: updatedPriceOfSelectedOptions.map(option => {
        return {
          partId: option.partId,
          partName: option.name,
          optionId: option.options.partOptionId,
          optionName: option.options.name,
          price: option.options.price
        };
      })
    };
  } catch (error) {
    console.error('Error calculating total price:', error);
    throw error;
  }
}

// Example usage
const selectedOptions = [
  { partOptionId: 1 },
  { partOptionId: 6 }
];

if (process.env.LOCAL) {
  calculateTotalPrice(selectedOptions).then(result => {
    console.log('Total Price:', result);
  }).catch(console.error);
}

