module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    requireConfigFile: false,
  },
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: [],
  // add your custom rules here
  rules: {},
}
