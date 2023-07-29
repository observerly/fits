/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { describe, expect, it, suite } from 'vitest'

import { I, J, hasDataUnit, swopEndian } from '..'

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
