import babel from 'rollup-plugin-babel'

export default {
  input: 'index.js',
  output: [
    {format: "cjs", file: "dist/index.cjs.js"},
    {format: "es", file: "dist/index.es.js"}
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: ["react"]
    })
  ],
  external: ["react","redux","react-redux","react-soundcloud-widget","superagent-bluebird-promise","lodash","url","prop-types","quintype-js","classnames","get-youtube-id","react-youtube","papaparse", "react-table", "react-dfp"]
};
