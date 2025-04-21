import { INTEGER, STRING } from 'sequelize';

export function initializePartModel (sequelize) {
  return sequelize.define('Parts', {
    partId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'part_id'
    },
    name: {
      type: STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });
}
