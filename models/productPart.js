import { INTEGER } from 'sequelize';

export function initializeProductPartModel (sequelize) {
  return sequelize.define('ProductPart', {
    productPartId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'product_part_id'
    }
  }, {
    timestamps: false
  });
}
