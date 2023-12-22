/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { describe, expect, it, suite } from 'vitest'

import { getFITSBlocks } from '../'

/*****************************************************************************************************************/

suite('@observerly/fits FITS', () => {
  describe('FITS File Parsing', () => {
    it('getFITSBlocks should be defined', () => {
      expect(getFITSBlocks).toBeDefined()
    })

    it('getFITSBlocks should return the correct number of blocks', () => {
      const blocks = getFITSBlocks(12594240)
      expect(blocks.length).toBe(12594240 / 2880)
    })
  })
})

/*****************************************************************************************************************/
