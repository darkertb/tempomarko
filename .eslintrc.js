module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-empty-function': 'off',
    'semi': 'warn',
    'max-len': ['warn', { code: 200, tabWidth: 2 }],
    'no-unused-vars': 'warn',
    'indent': ['warn', 2],
    'quotes': ['warn', 'single', { 'avoidEscape': true, 'allowTemplateLiterals': true }],
    'comma-dangle': ['warn', 'always-multiline'],
    'eol-last': ['warn', 'always'],
    'arrow-parens': ['warn', 'always'],
    'no-constant-condition': 'off',
    'no-empty': 'off',
    'complexity': ['error', { 'max': 15 }],
  },
};
