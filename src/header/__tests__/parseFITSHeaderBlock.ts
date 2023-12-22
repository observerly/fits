/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { describe, expect, it, suite } from 'vitest'

import { parseFITSHeaderBlock } from '../'

/*****************************************************************************************************************/

suite('@observerly/fits Header', () => {
  describe('FITS File Header Block Parsing', () => {
    it('parseFITSHeaderBlock should be defined', () => {
      expect(parseFITSHeaderBlock).toBeDefined()
    })
  })
})

/*****************************************************************************************************************/
