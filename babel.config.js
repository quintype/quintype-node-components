"use strict";

module.exports = function(api) {
  const env = api.env();
  let envOptions = {modules: false};
  let plugins = [
    "annotate-pure-calls",
    "@babel/plugin-syntax-object-rest-spread",
    "transform-react-remove-prop-types",
    "@babel/plugin-syntax-dynamic-import",
    ["@babel/plugin-transform-runtime", {
      "corejs": false,
      "helpers": false,
      "regenerator": true,
      "useESModules": false
    }]
  ];

  if (env === 'esmodules') {
    envOptions = {"targets": {"esmodules": true}};
  }
  
  if (env === 'test') {
    envOptions = {"targets": {"node": true}};
    plugins.push("babel-plugin-quintype-assets");
  }

  let config = {
    presets: [
      "@babel/preset-react",
      [
        "@babel/preset-env", 
        envOptions
      ],
    ],
    plugins: plugins
  };
  
  return config;
}