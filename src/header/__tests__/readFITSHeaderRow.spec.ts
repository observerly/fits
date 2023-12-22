/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { describe, expect, it, suite } from 'vitest'

import { readFITSHeaderFromBlocks } from '../'

/*****************************************************************************************************************/

suite('@observerly/fits Header', () => {
  describe('FITS File Header Blocks Reading', () => {
    it('readFITSHeaderFromBlocks should be defined', () => {
      expect(readFITSHeaderFromBlocks).toBeDefined()
    })
  })
})

/*****************************************************************************************************************/
