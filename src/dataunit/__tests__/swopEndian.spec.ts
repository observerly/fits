/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { describe, expect, it, suite } from 'vitest'

import { swopEndian } from '../'

/*****************************************************************************************************************/

suite('@observerly/fits Data Unit', () => {
  describe('FITS Swop Endian', () => {
    it('swopEndian should be defined', () => {
      expect(swopEndian).toBeDefined()
    })

    it('swopEndian should return the correct value', () => {
      const bitpix = 8
      const value = swopEndian(bitpix)(8)
      expect(value).toBe(8)
    })

    it('swopEndian should return the correct value', () => {
      const bitpix = 16
      const value = swopEndian(bitpix)(8)
      expect(value).toBe(2048)
    })

    it('swopEndian should return the correct value', () => {
      const bitpix = 32
      const value = swopEndian(bitpix)(8)
      expect(value).toBe(134217728)
    })
  })
})

/*****************************************************************************************************************/
