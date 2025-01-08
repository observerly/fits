/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2025 observerly

/*****************************************************************************************************************/

import { describe, expect, it } from 'vitest'

import { median } from '../median'

/*****************************************************************************************************************/

describe('median', () => {
  it('should return the median for an odd-length array', () => {
    const input = [3, 1, 4, 1, 5]
    const result = median(input)
    expect(result).toBe(3) // Sorted: [1, 1, 3, 4, 5]
  })

  it('should return the median for an even-length array', () => {
    const input = [3, 1, 4, 1]
    const result = median(input)
    expect(result).toBe(2) // Sorted: [1, 1, 3, 4], Median: (1 + 3) / 2
  })

  it('should handle a single-element array', () => {
    const input = [42]
    const result = median(input)
    expect(result).toBe(42)
  })

  it('should handle an empty array gracefully', () => {
    const input: number[] = []
    expect(median(input)).toBeNaN()
  })

  it('should work with negative numbers', () => {
    const input = [-3, -1, -4, -2]
    const result = median(input)
    expect(result).toBe(-2.5) // Sorted: [-4, -3, -2, -1], Median: (-3 + -2) / 2
  })

  it('should work with already sorted arrays', () => {
    const input = [1, 2, 3, 4, 5]
    const result = median(input)
    expect(result).toBe(3) // Sorted: [1, 2, 3, 4, 5]
  })

  it('should work with reverse-sorted arrays', () => {
    const input = [5, 4, 3, 2, 1]
    const result = median(input)
    expect(result).toBe(3) // Sorted: [1, 2, 3, 4, 5]
  })

  it('should handle arrays with duplicate values', () => {
    const input = [1, 2, 2, 2, 3]
    const result = median(input)
    expect(result).toBe(2) // Sorted: [1, 2, 2, 2, 3]
  })

  it('should handle floating-point numbers', () => {
    const input = [1.5, 2.5, 0.5]
    const result = median(input)
    expect(result).toBe(1.5) // Sorted: [0.5, 1.5, 2.5]
  })

  it('should not mutate the original array', () => {
    const input = [3, 1, 4, 1, 5]
    const original = [...input]
    median(input)
    expect(input).toEqual(original)
  })
})

/*****************************************************************************************************************/
