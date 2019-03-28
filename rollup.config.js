/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs',
  },
  plugins: [
    babel({
      babelrc: false,
      configFile: false,
      presets: ['@babel/preset-flow'],
    }),
    json(),
  ],
};
