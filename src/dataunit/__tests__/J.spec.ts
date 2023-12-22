/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { describe, expect, it, suite } from 'vitest'

import { J } from '../'

/*****************************************************************************************************************/

suite('@observerly/fits Data Unit', () => {
  describe('FITS Big Endian Swop', () => {
    it('J should be defined', () => {
      expect(J).toBeDefined()
    })

    it('J should return the correct value', () => {
      const value = J(8)
      expect(value).toBe(134217728)
    })

    it('J should return the correct value', () => {
      const value = J(32)
      expect(value).toBe(536870912)
    })

    it('J should return the correct value', () => {
      const value = J(64)
      expect(value).toBe(1073741824)
    })
  })
})

/*****************************************************************************************************************/
