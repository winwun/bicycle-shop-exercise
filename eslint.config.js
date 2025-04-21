// eslint.config.js
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'double'],
      semi: ['error', 'always'],
      'no-unused-vars': ['warn'],
      'no-console': 'off',
      'no-restricted-syntax': 'off',
      'quotes': ['error', 'single']
    },
  },
];
