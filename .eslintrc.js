module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ignores: ['output/', 'dist/'],
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['prettier', '@typescript-eslint'],
  extends: ['prettier'],
  env: {
    node: true,
    es6: true,
  },
  globals: {
    global: false,
    Promise: false,
  },
  rules: {
    'prettier/prettier': ['error'],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.tsx'],
      },
    },
  },
};
