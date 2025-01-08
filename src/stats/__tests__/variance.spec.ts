/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2025 observerly

/*****************************************************************************************************************/

import { describe, expect, it } from 'vitest'

import { variance } from '../variance'

/*****************************************************************************************************************/

describe('variance', () => {
  it('should calculate the variance with default normalization (uncorrected)', () => {
    const data = [1, 2, 3, 4, 5]
    const result = variance(data)
    expect(result).toBeCloseTo(2) // (2+1+0+1+2)/5 = 2
  })

  it('should calculate the variance with unbiased normalization', () => {
    const data = [1, 2, 3, 4, 5]
    const result = variance(data, 'unbiased')
    expect(result).toBeCloseTo(2.5) // (2+1+0+1+2)/4 = 2.5
  })

  it('should calculate the variance with biased normalization', () => {
    const data = [1, 2, 3, 4, 5]
    const result = variance(data, 'biased')
    expect(result).toBeCloseTo(1.6666666666666667) // (2+1+0+1+2)/6 = 1.666...
  })

  it('should handle an array with a single element', () => {
    const data = [42]
    const result = variance(data, 'unbiased')
    expect(result).toBeNaN() // n-1 divisor leads to division by 0
  })

  it('should handle an empty array gracefully', () => {
    const data: number[] = []
    const result = variance(data)
    expect(result).toBeNaN() // Empty array has no variance
  })

  it('should work with negative numbers', () => {
    const data = [-1, -2, -3, -4, -5]
    const result = variance(data, 'unbiased')
    expect(result).toBeCloseTo(2.5) // Same variance formula as for positive numbers
  })

  it('should work with floating-point numbers', () => {
    const data = [1.5, 2.5, 3.5, 4.5, 5.5]
    const result = variance(data, 'uncorrected')
    expect(result).toBeCloseTo(2) // (4+1+0+1+4)/5 = 2
  })

  it('should handle duplicate values correctly', () => {
    const data = [3, 3, 3, 3]
    const result = variance(data)
    expect(result).toBe(0) // All values are identical, variance = 0
  })

  it('should work with small arrays (e.g., two elements)', () => {
    const data = [10, 20]
    const resultUnbiased = variance(data, 'unbiased')
    const resultUncorrected = variance(data, 'uncorrected')
    expect(resultUnbiased).toBeCloseTo(50) // (10^2)/1 = 50
    expect(resultUncorrected).toBeCloseTo(25) // (10^2)/2 = 25
  })

  it('should not mutate the original array', () => {
    const data = [1, 2, 3, 4, 5]
    const original = [...data]
    variance(data)
    expect(data).toEqual(original) // Original array remains unchanged
  })
})

/*****************************************************************************************************************/
