/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { describe, expect, it, suite } from 'vitest'

import { I } from '../'

/*****************************************************************************************************************/

suite('@observerly/fits Data Unit', () => {
  describe('FITS Big Endian Swop', () => {
    it('I should be defined', () => {
      expect(I).toBeDefined()
    })

    it('I should return the correct value', () => {
      const value = I(8)
      expect(value).toBe(2048)
    })

    it('I should return the correct value', () => {
      const value = I(32)
      expect(value).toBe(8192)
    })

    it('I should return the correct value', () => {
      const value = I(64)
      expect(value).toBe(16384)
    })
  })
})

/*****************************************************************************************************************/
