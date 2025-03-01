/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2025 observerly

/*****************************************************************************************************************/

import { defineConfig } from 'tsup'

/*****************************************************************************************************************/

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  minify: true,
  splitting: false,
  sourcemap: true,
  treeshake: true,
  clean: true,
})

/*****************************************************************************************************************/