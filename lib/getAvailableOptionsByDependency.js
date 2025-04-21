import { getPartsWithOptions } from './helper.js';
import { PartDependency } from '../models/index.js';

function groupOptionsByParts(parts) {
  return parts.reduce((acc, part) => {
    const partId = part.partId;

    if (!acc[partId]) {
      acc[partId] = {
        partId: part.partId,
        name: part.name,
        options: []
      };
    }

    if (part.options) {
      const option = {
        partOptionId: part.options.partOptionId,
        name: part.options.name,
        price: part.options.price,
        hasStock: part.options.hasStock
      };

      acc[partId].options.push(option);
    }

    return acc;
  }, {});
}

function getDependenciesForSelectedOptions(selectedOptionIds) {
  return PartDependency.findAll({
    where: {
      partOptionId: selectedOptionIds
    },
    attributes: ['partDependencyId', 'partOptionId', 'targetPartOptionId', 'type'],
    raw: true
  });
}

function createTargetDependencyMap(dependencies) {
  const targetDependencyMap = {};

  dependencies.forEach(dependency => {
    const targetOptionId = dependency.targetPartOptionId;

    if (!targetDependencyMap[targetOptionId]) {
      targetDependencyMap[targetOptionId] = {
        exclude: false,
        include: false
      };
    }

    if (dependency.type === 'exclude') {
      targetDependencyMap[targetOptionId].exclude = true;
    } else if (dependency.type === 'include') {
      targetDependencyMap[targetOptionId].include = true;
    }
  });

  return targetDependencyMap;
}

function filterOptionsByDependencies(part, targetDependencyMap) {
  const includedOptions = part.options.filter(option =>
    targetDependencyMap[option.partOptionId]?.include
  );

  if (includedOptions.length) {
    return includedOptions;
  }

  return part.options.filter(option => {
    const dependencyInfo = targetDependencyMap[option.partOptionId];
    const noDependencyInfoAndExclude = !dependencyInfo || !dependencyInfo.exclude;

    if (noDependencyInfoAndExclude) {
      return true;
    }

    return false;
  });
}


export async function getAvailableOptionsByDependency(selectedOptions) {
  try {
    const parts = await getPartsWithOptions();

    const partWithOptionsLookup = groupOptionsByParts(parts);
    const partsWithOptionsList = Object.values(partWithOptionsLookup);

    const hasNoSelectedOptions = !selectedOptions || !selectedOptions.length;

    if (hasNoSelectedOptions) {
      return partsWithOptionsList.map(part => ({
        partId: part.partId,
        name: part.name,
        options: part.options
      }));
    }

    const selectedOptionIds = selectedOptions.map(option => option.partOptionId);

    const dependencies = await getDependenciesForSelectedOptions(selectedOptionIds);
    const targetDependencyMap = createTargetDependencyMap(dependencies);

    const filteredPartsByDependency = partsWithOptionsList.map(part => {
      const availableOptions = filterOptionsByDependencies(part, targetDependencyMap);

      return {
        partId: part.partId,
        name: part.name,
        options: availableOptions
      };
    });

    return filteredPartsByDependency;
  } catch (error) {
    console.error('Error fetching parts:', error);
    throw error;
  }
}

// Example usage
const selectedOptions = [
  { partOptionId: 6 }
];

if (process.env.LOCAL) {
  getAvailableOptionsByDependency(selectedOptions).then(result => {
    console.log('Available options:', JSON.stringify(result, null, 2));
  }).catch(console.error);
}

