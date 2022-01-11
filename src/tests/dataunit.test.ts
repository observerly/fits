import { describe, expect, it, suite } from 'vitest'

import { I, hasDataUnit } from '../dataunit'

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
