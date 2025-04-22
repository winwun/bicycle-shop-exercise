
import { Category, Product, Part, PartOption, PriceRule, PartDependency, ProductPart } from '../models/index.js';
import { sequelize } from '../models/index.js';


initializeDb();

async function initializeDb() {
  try {
    await sequelize.sync({ force: true });
    await seedDb();
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await sequelize.close();
  }
}

async function seedDb() {
  try {
    const categories = [
      { categoryId: 1, name: 'Bicycle', description: 'All bicycle related products' },
      { categoryId: 2, name: 'Surfboard', description: 'All surfboard related products' },
      { categoryId: 3, name: 'Skateboard', description: 'All skateboard related products' }
    ];

    const products = [
      { productId: 1, name: 'Mountain Bike', description: 'This a basic mountain bike', categoryId: 1 },
      { productId: 2, name: 'Road Bike', description: 'This is a road bike', categoryId: 1 }
    ];

    const parts = [
      { partId: 1, name: 'Frame type', categoryId: 1 },
      { partId: 2, name: 'Frame finish', categoryId: 1  },
      { partId: 3, name: 'Wheels', categoryId: 1  },
      { partId: 4, name: 'Rim color', categoryId: 1  },
      { partId: 5, name: 'Chain', categoryId: 1  }
    ];

    const partOptions = [
      { partOptionId: 1, name: 'Full-suspension', price: 40, hasStock: true, partId: 1 },
      { partOptionId: 2, name: 'Diamond', price: 60, hasStock: true, partId: 1 },
      { partOptionId: 3, name: 'Step-through', price: 30, hasStock: true, partId: 1 },
      { partOptionId: 4, name: 'Matte', price: 15, hasStock: true, partId: 2 },
      { partOptionId: 5, name: 'Shiny', price: 20, hasStock: true, partId: 2 },
      { partOptionId: 6, name: 'Road wheels', price: 20, hasStock: true, partId: 3 },
      { partOptionId: 7, name: 'Mountain wheels', price: 30, hasStock: true, partId: 3 },
      { partOptionId: 8, name: 'Fat bike wheels', price: 40, hasStock: true, partId: 3 },
      { partOptionId: 9, name: 'Red', price: 7, hasStock: false, partId: 4 },
      { partOptionId: 10, name: 'Black', price: 5, hasStock: true, partId: 4 },
      { partOptionId: 11, name: 'Blue', price: 7, hasStock: true, partId: 4 },
      { partOptionId: 12, name: 'Single-speed chain', price: 15, hasStock: true, partId: 5 },
      { partOptionId: 13, name: '8-speed chain', price: 20, hasStock: true, partId: 5 }
    ];

    const partDependencies = [
      { partDependencyId: 1, name: 'sample', type: 'exclude', partOptionId: 6, targetPartOptionId: 10 }
    ];

    const priceRules = [
      { priceRuleId: 1, name: 'Diamond price', partOptionId: 1, targetPartOptionId: 6, newPrice: 30 },
      { priceRuleId: 2, name: 'sam price', partOptionId: 6, targetPartOptionId: 1, newPrice: 30 }
    ];

    const productParts = [
      { productPartId: 1, productId: 1, partId: 1, partOptionId: 1 },
      { productPartId: 2, productId: 1, partId: 2, partOptionId: 4 },
      { productPartId: 3, productId: 1, partId: 3, partOptionId: 6 },
      { productPartId: 4, productId: 1, partId: 4, partOptionId: 9 },
      { productPartId: 5, productId: 2, partId: 1, partOptionId: 2 },
      { productPartId: 6, productId: 2, partId: 2, partOptionId: 5 },
      { productPartId: 7, productId: 2, partId: 3, partOptionId: 7 },
      { productPartId: 8, productId: 2, partId: 4, partOptionId: 10 },

    ];

    await Category.bulkCreate(categories);
    await Product.bulkCreate(products);
    await Part.bulkCreate(parts);
    await PartOption.bulkCreate(partOptions);
    await PriceRule.bulkCreate(priceRules);
    await PartDependency.bulkCreate(partDependencies);
    await ProductPart.bulkCreate(productParts);

  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
