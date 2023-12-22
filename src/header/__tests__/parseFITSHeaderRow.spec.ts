/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { describe, expect, it, suite } from 'vitest'

import { parseFITSHeaderRow } from '../'

/*****************************************************************************************************************/

suite('@observerly/fits Header', () => {
  describe('FITS File Header Row Parsing', () => {
    it('parseFITSHeaderRow should be defined', () => {
      expect(parseFITSHeaderRow).toBeDefined()
    })

    it('parseFITSHeaderRow should return the correct key, value and comment', () => {
      const { key, value, comment } = parseFITSHeaderRow(
        'SIMPLE  =                    T / file does conform to FITS standard'
      )

      expect(key).toBe('SIMPLE')
      expect(value).toBe(true)
      expect(comment).toBe('file does conform to FITS standard')
    })

    it('parseFITSHeaderRow should return the correct key, value and comment', () => {
      const { key, value, comment } = parseFITSHeaderRow(
        'BITPIX  =                    8 / number of bits per data pixel'
      )

      expect(key).toBe('BITPIX')
      expect(value).toBe(8)
      expect(comment).toBe('number of bits per data pixel')
    })

    it('parseFITSHeaderRow should return the correct key, value and comment', () => {
      const { key, value, comment } = parseFITSHeaderRow(
        'NAXIS   =                    0 / number of array dimensions or data axes'
      )

      expect(key).toBe('NAXIS')
      expect(value).toBe(0)
      expect(comment).toBe('number of array dimensions or data axes')
    })

    it('parseFITSHeaderRow should return the correct key, value and comment', () => {
      const { key, value, comment } = parseFITSHeaderRow(
        'NAXIS   =                    0 / number of array dimensions or data axes'
      )

      expect(key).toBe('NAXIS')
      expect(value).toBe(0)
      expect(comment).toBe('number of array dimensions or data axes')
    })

    it('parseFITSHeaderRow should return the correct key, value and comment', () => {
      const { key, value, comment } = parseFITSHeaderRow('EXTEND  =                    T')

      expect(key).toBe('EXTEND')
      expect(value).toBe(true)
      expect(comment).toBe('')
    })

    it('parseFITSHeaderRow should return the correct key, value and comment', () => {
      const { key, value, comment } = parseFITSHeaderRow(
        "EPOCH   =             'Julian' / epoch of observation"
      )

      expect(key).toBe('EPOCH')
      expect(value).toBe('Julian')
      expect(comment).toBe('epoch of observation')
    })

    it('parseFITSHeaderRow should return the correct key, value and comment', () => {
      const { key, value, comment } = parseFITSHeaderRow('CONTINUE Continued value')

      expect(key).toBe('CONTINUE')
      expect(value).toBe('Continued value')
      expect(comment).toBe('Continued value')
    })

    it('parseFITSHeaderRow should return the correct key, value and comment', () => {
      const { key, value, comment } = parseFITSHeaderRow('COMMENT An unspecified comment')

      expect(key).toBe('COMMENT')
      expect(value).toBe('An unspecified comment')
      expect(comment).toBe('An unspecified comment')
    })

    it('parseFITSHeaderRow should return the correct key, value and comment', () => {
      const { key, value, comment } = parseFITSHeaderRow('HISTORY An unspecified record')

      expect(key).toBe('HISTORY')
      expect(value).toBe('An unspecified record')
      expect(comment).toBe('An unspecified record')
    })
  })
})

/*****************************************************************************************************************/
