/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2025 observerly

/*****************************************************************************************************************/

/// <reference types="vitest" />

/*****************************************************************************************************************/

import { defineConfig } from 'vite'

import typescript from '@rollup/plugin-typescript'

import { resolve } from 'node:path'

/*****************************************************************************************************************/

export default defineConfig({
  plugins: [
    typescript({
      tsconfig: './tsconfig.json'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, '/src')
    }
  },
  build: {
    outDir: './dist',
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@observerly/fits',
      // the proper extensions will be added
      fileName: 'fits'
    },
    rollupOptions: {
      external: ['./playground/*.ts'],
      output: {
        sourcemap: true
      }
    }
  }
})

/*****************************************************************************************************************/
