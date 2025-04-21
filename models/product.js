import { INTEGER, STRING, TEXT } from 'sequelize';

export function initializeProductModel (sequelize) {
  return sequelize.define('Products', {
    productId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'product_id'
    },
    name: {
      type: STRING,
      allowNull: false
    },
    description: {
      type: TEXT
    }
  }, {
    timestamps: false
  });
}
