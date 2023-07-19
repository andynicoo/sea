module.exports = {
  root: true,
  extends: ['plugin:vue/essential', '@vue/standard', '@vue/eslint-config-prettier'],

  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'no-undef': 'off',
    camelcase: 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
