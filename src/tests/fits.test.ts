import { describe, expect, it, suite } from 'vitest'

import { getFITSBlocks } from '../fits'

suite('@observerly/fits FITS', () => {
  describe('FITS File Parsing', () => {
    it('getFITSBlocks should be defined', () => {
      expect(getFITSBlocks).toBeDefined()
    })

    it('getFITSBlocks should return the correct number of blocks', () => {
      const { blocks } = getFITSBlocks(12594240)
      expect(blocks.length).toBe(12594240 / 2880)
    })
  })
})
