
import { TEXT, STRING, INTEGER } from 'sequelize';

export function initializeCategoryModel(sequelize) {
  return sequelize.define('Categories', {
    categoryId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'category_id'
    },
    name: {
      type: STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: TEXT,
      allowNull: true
    }
  }, {
    timestamps: false
  });
}
