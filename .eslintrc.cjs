module.exports = {
  extends: ["eslint:recommended", "plugin:react/recommended"],
  plugins: ["react"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  }
};
