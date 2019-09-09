module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "jest/globals": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "qlitics": true
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "jest",
        "react"
    ],
    "rules": {
      "no-unused-vars": "warn",
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
    }
};
