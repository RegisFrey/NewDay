// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _dotenv from 'dotenv/config'; // loads environment variables
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import vue from 'rollup-plugin-vue';
import postcss from 'rollup-plugin-postcss';
import typescript from 'rollup-plugin-typescript2'; // '@rollup/plugin-typescript'
import {
  chromeExtension,
  simpleReloader,
} from 'rollup-plugin-chrome-extension';
import { emptyDir } from 'rollup-plugin-empty-dir';
import zip from 'rollup-plugin-zip';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/manifest.json',
  output: {
    dir: 'dist',
    format: 'esm',
    chunkFileNames: 'chunks/[name]-[hash].js',
  },
  // watch: { clearScreen: false }, // for dev debug
  plugins: [
    // chromeExtension() must be first, in order to properly treat manifest.json as the entry point
    chromeExtension({
      publicKey: process.env.PUBLIC_KEY,
      extendManifest: {
        "oauth2": {
          "client_id": process.env.OAUTH_CLIENT_ID,
          "scopes": ["https://www.googleapis.com/auth/calendar.events.readonly"]
        }
      }
    }),
    !isProduction && simpleReloader(), // Adds a Chrome extension reloader during watch mode

    vue(),
    typescript(),
    postcss(),

    json(),
    resolve(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        isProduction ? 'production' : 'development',
      ),
      // https://github.com/vuejs/vue-next/tree/master/packages/vue#bundler-build-feature-flags
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: true,
    }),

    // Empties the output dir before a new build
    emptyDir(),
    // Outputs a zip file in ./releases
    isProduction && zip({ dir: 'releases' }),
  ],
};
