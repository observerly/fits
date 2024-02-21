/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2024 observerly

/*****************************************************************************************************************/

import { describe, expect, it, suite } from 'vitest'

import { sanitizeString } from '../..'

/*****************************************************************************************************************/

suite('@observerly/fits Utilities', () => {
  describe('FITS String Parsing Utilities', () => {
    it('sanitizeString should be defined', () => {
      expect(sanitizeString).toBeDefined()
    })

    it('should remove non-UTF-8 characters, apostrophes, newlines, and carriage returns', () => {
      const input = "Test\nString with 'special' characters\r\n"
      const expectedOutput = 'TestString with special characters'
      expect(sanitizeString(input)).toEqual(expectedOutput)
    })

    it('should remove leading and trailing whitespace', () => {
      const input = '  leading and trailing whitespace    '
      const expectedOutput = 'leading and trailing whitespace'
      expect(sanitizeString(input)).toEqual(expectedOutput)
    })

    it('should handle empty input', () => {
      const input = ''
      const expectedOutput = ''
      expect(sanitizeString(input)).toEqual(expectedOutput)
    })

    it('should handle input with only special characters', () => {
      const input = '!!@#$%^&*()'
      const expectedOutput = ''
      expect(sanitizeString(input)).toEqual(expectedOutput)
    })

    it('should handle input with only whitespace', () => {
      const input = '      \n\n\n\t\t\t'
      const expectedOutput = ''
      expect(sanitizeString(input)).toEqual(expectedOutput)
    })

    it('should handle input with special characters and whitespace', () => {
      const input = '    test!!@#$%^&*() with spaces   '
      const expectedOutput = 'test with spaces'
      expect(sanitizeString(input)).toEqual(expectedOutput)
    })
  })
})

/*****************************************************************************************************************/
