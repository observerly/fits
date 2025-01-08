/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2025 observerly

/*****************************************************************************************************************/

import { describe, expect, it } from 'vitest'

import { mean } from '../mean'

/*****************************************************************************************************************/

describe('mean', () => {
  it('should calculate the mean of an array with positive numbers', () => {
    const input = [1, 2, 3, 4, 5]
    const result = mean(input)
    expect(result).toBe(3) // (1 + 2 + 3 + 4 + 5) / 5 = 3
  })

  it('should calculate the mean of an array with negative numbers', () => {
    const input = [-1, -2, -3, -4, -5]
    const result = mean(input)
    expect(result).toBe(-3) // (-1 + -2 + -3 + -4 + -5) / 5 = -3
  })

  it('should calculate the mean of an array with mixed positive and negative numbers', () => {
    const input = [-3, -2, -1, 1, 2, 3]
    const result = mean(input)
    expect(result).toBe(0) // (-3 + -2 + -1 + 1 + 2 + 3) / 6 = 0
  })

  it('should calculate the mean of an array with a single element', () => {
    const input = [42]
    const result = mean(input)
    expect(result).toBe(42) // Mean of a single element is the element itself
  })

  it('should handle an empty array gracefully', () => {
    const input: number[] = []
    expect(mean(input)).toBeNaN()
  })

  it('should calculate the mean of an array with floating-point numbers', () => {
    const input = [1.5, 2.5, 3.5, 4.5]
    const result = mean(input)
    expect(result).toBe(3) // (1.5 + 2.5 + 3.5 + 4.5) / 4 = 3
  })

  it('should handle arrays with repeated values', () => {
    const input = [2, 2, 2, 2]
    const result = mean(input)
    expect(result).toBe(2) // Mean of identical values is the value itself
  })

  it('should not mutate the original array', () => {
    const input = [1, 2, 3, 4]
    const original = [...input]
    mean(input)
    expect(input).toEqual(original)
  })
})

/*****************************************************************************************************************/
