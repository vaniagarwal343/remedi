module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018, // Ensure this matches your project's ECMAScript version
  },
  extends: [
    "eslint:recommended",
    "google", // Using Google style guide
  ],
  rules: {
    "no-restricted-globals": ["error", "name", "length"], // Disallow specific globals
    "prefer-arrow-callback": "error", // Encourage arrow functions
    "quotes": ["error", "double", { "allowTemplateLiterals": true }], // Allow template literals
    "object-curly-spacing": ["error", "always"], // Ensure consistent spacing in objects
    "max-len": ["error", { "code": 120 }], // Increase line length limit (default is 80)
    "eol-last": ["error", "always"], // Ensure a newline at the end of files
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true, // Allow Mocha-specific globals for test files
      },
      rules: {},
    },
  ],
  globals: {},
};
