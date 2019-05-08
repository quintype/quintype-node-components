const babelOptions = { presets: ['@babel/env', '@babel/react'] };

module.exports = require('babel-jest').createTransformer(babelOptions);
