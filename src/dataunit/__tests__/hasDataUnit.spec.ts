/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { describe, expect, it, suite } from 'vitest'

import { hasDataUnit } from '../'

/*****************************************************************************************************************/

suite('@observerly/fits Data Unit', () => {
  describe('FITS Data Unit', () => {
    it('hasDataUnit should be defined', () => {
      expect(hasDataUnit).toBeDefined()
    })

    it('hasDataUnit should return false if NAXIS = 0', () => {
      const NAXIS0 = hasDataUnit(0)
      expect(NAXIS0).toBe(false)
    })

    it('hasDataUnit should return true if NAXIS > 0', () => {
      const NAXIS1 = hasDataUnit(1)
      expect(NAXIS1).toBe(true)

      const NAXIS2 = hasDataUnit(2)
      expect(NAXIS2).toBe(true)
    })
  })
})

/*****************************************************************************************************************/
