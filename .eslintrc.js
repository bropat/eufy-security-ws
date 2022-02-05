module.exports = {
  extends: ["prettier"],
  env: {
    es2020: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  rules: {
    "indent": "off",
    "@typescript-eslint/indent": [
        "error",
        4,
        {
            "SwitchCase": 1
        }
    ],
    "quotes": [
        "error",
        "double",
        {
            "avoidEscape": true,
            "allowTemplateLiterals": true
        }
    ],
  }
};
