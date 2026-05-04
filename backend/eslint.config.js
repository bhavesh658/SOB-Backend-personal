export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",
        __dirname: "readonly"
      }
    },
    rules: {
      complexity: ["warn", 5]
    }
  }
];