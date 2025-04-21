import { Sequelize } from 'sequelize';
import { initializeCategoryModel } from './Category.js';
import { initializeProductPartModel } from './productPart.js';
import { initializeProductModel } from './Product.js';
import { initializePartModel } from './Part.js';
import { initializePartDependencyModel } from './PartDependency.js';
import { initializePartOptionModel } from './PartOption.js';
import { initializePriceRuleModel } from './PriceRule.js';

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

export const Category = initializeCategoryModel(sequelize);
export const ProductPart = initializeProductPartModel(sequelize);
export const Product = initializeProductModel(sequelize);
export const Part = initializePartModel(sequelize);
export const PartDependency = initializePartDependencyModel(sequelize);
export const PartOption = initializePartOptionModel(sequelize);
export const PriceRule = initializePriceRuleModel(sequelize);

Category.hasMany(Product, {
  foreignKey: {
    name: 'categoryId',
    field: 'category_id'
  }
});

Product.belongsTo(Category, {
  foreignKey: {
    name: 'categoryId',
    field: 'category_id'
  }
});

Part.belongsTo(Category, {
  foreignKey: {
    name: 'categoryId',
    field: 'category_id'
  }
});

Product.belongsToMany(Part, {
  through: {
    model: ProductPart,
    unique: false
  },
  foreignKey: 'productId',
  otherKey: 'partId'
});
Part.belongsToMany(Product, {
  through: {
    model: ProductPart,
    unique: false
  },
  foreignKey: 'partId',
  otherKey: 'productId'
});

ProductPart.belongsTo(PartOption, {
  foreignKey: 'partOptionId',
  as: 'partOption'
});
PartOption.hasMany(ProductPart, {
  foreignKey: 'partOptionId'
});
ProductPart.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(ProductPart, { foreignKey: 'productId', as: 'productPart' });


Part.hasMany(PartOption, {
  foreignKey: {
    name: 'partId',
    field: 'part_id'
  },
  as: 'options'
});
PartOption.belongsTo(Part, {
  foreignKey: {
    name: 'partId',
    field: 'part_id'
  },
  as: 'part'
});

PriceRule.belongsTo(PartOption, {
  foreignKey: 'partOptionId',
  as: 'primaryOption'
});
PriceRule.belongsTo(PartOption, {
  foreignKey: 'targetPartOptionId',
  as: 'dependentOption'
});

// PartDependency belongs to PartOption (as source)
PartDependency.belongsTo(PartOption, {
  foreignKey: 'partOptionId',
  as: 'sourcePart'
});
// PartOption has many PartDependencies (as source)
PartOption.hasMany(PartDependency, {
  foreignKey: 'partOptionId',
  as: 'sourceDependencies'
});

// PartDependency belongs to PartOption (as target)
PartDependency.belongsTo(PartOption, {
  foreignKey: 'targetPartOptionId',
  as: 'targetPart'
});
// PartOption has many PartDependencies (as target)
PartOption.hasMany(PartDependency, {
  foreignKey: 'targetPartOptionId',
  as: 'targetDependencies'
});



