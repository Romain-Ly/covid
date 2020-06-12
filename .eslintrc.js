module.exports = {
  'env': {
    'browser': true,
    'es6': true,
  },
  'extends': [
    'plugin:react/recommended',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    "react-hooks",
    '@typescript-eslint',
  ],
  'rules': {
    'eol-last': ['error', 'always'],
    'guard-for-in': 'error',
    'linebreak-style': 'error',
    'no-unexpected-multiline': 'off',
    'no-extra-semi': 'error',
    'no-trailing-spaces': 'error',
    "@typescript-eslint/no-unused-vars": ['warn', { "argsIgnorePattern": "^_" }],
    'no-unreachable': 'error',
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn" // Checks effect dependencies
  },
};
