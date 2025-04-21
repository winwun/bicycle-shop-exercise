import { INTEGER, STRING, DECIMAL, BOOLEAN } from 'sequelize';

export function initializePartOptionModel (sequelize) {
  return sequelize.define('PartOptions', {
    partOptionId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'part_option_id'
    },
    name: {
      type: STRING,
      allowNull: false
    },
    price: {
      type: DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    hasStock: {
      type: BOOLEAN,
      defaultValue: true,
      field: 'has_stock'
    }
  }, {
    timestamps: false
  });
}
