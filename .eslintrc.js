module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    "prettier",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
  },
  settings: {
    "import/resolver": {
      "typescript": {}
    },
  },

  plugins: [
    '@typescript-eslint',
    'jest',
    'prettier'

  ],
  rules: {
    'prettier/prettier': 'error',
    'max-len': 0,
    "arrow-body-style": 0,
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        "ts": "never"
      }
    ],
    'no-continue': 0,
    'no-console': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': [2, { "allow": ["__filename", "__dirname"] }],
    'import/prefer-default-export': 0,
  },
};
