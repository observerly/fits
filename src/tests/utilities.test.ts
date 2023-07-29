/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { describe, expect, it, suite } from 'vitest'

import { getExcessByteSize } from '../utilities'

/*****************************************************************************************************************/

suite('@observerly/fits Utilities', () => {
  describe('FITS File Parsing Utilities', () => {
    it('getExcessByteSize should be defined', () => {
      expect(getExcessByteSize).toBeDefined()
    })

    it('getExcessByteSize should return the correct number of excess bytes', () => {
      const excess = getExcessByteSize(2880, 68)
      expect(excess).toBe(2880 - 68)
    })
  })
})

/*****************************************************************************************************************/
