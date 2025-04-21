import { INTEGER, STRING } from 'sequelize';

export function initializePartDependencyModel (sequelize) {
  return sequelize.define('PartDependencies', {
    partDependencyId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'part_dependency_id'
    },
    name: {
      type: STRING
    },
    type: {
      type: STRING
    }
  }, {
    timestamps: false
  });
}
