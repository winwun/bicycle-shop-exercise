
export default {
  transform: {
    '^.+\\.js$': 'babel-jest', // Use Babel to transform JavaScript files
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'node',
};
