module.exports = {
  extends: ["eslint:recommended"],
  plugins: ["prettier"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2018
  },
  env: {
    es6: true,
    node: true
  },
  rules: {
    "prettier/prettier": "error",
    "no-constant-condition": ["error", { checkLoops: false }],
    "require-atomic-updates": "off",
    "no-shadow": "error",
    "no-warning-comments": "error"
  }
};
