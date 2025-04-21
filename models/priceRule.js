import { INTEGER, STRING, DECIMAL } from 'sequelize';

export function initializePriceRuleModel (sequelize) {
  return sequelize.define('PriceRules', {
    priceRuleId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'price_rule_id'
    },
    name: {
      type: STRING
    },
    newPrice: {
      type: DECIMAL(10, 2),
      allowNull: false,
      field: 'new_price'
    }
  }, {
    timestamps: false
  });
}
