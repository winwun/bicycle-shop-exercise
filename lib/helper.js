import { Part, PartOption } from '../models/index.js';

export function getPartsWithOptions() {
  return Part.findAll({
    where: {
      categoryId: 1
    },
    include: [
      {
        model: PartOption,
        as: 'options',
        attributes: ['partOptionId', 'name', 'price', 'hasStock']
      }
    ],
    raw: true,
    nest: true
  });
}

export function showAllOptionsForPart (allBikeParts, partId) {
  const frameTypesOptions = allBikeParts.find(part => part.partId === partId);

  return frameTypesOptions.options.map(option => ({ name: option.name, value: option.partOptionId }));
}
