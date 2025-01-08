/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2025 observerly

/*****************************************************************************************************************/

import { describe, expect, it } from 'vitest'

import { type Point, performLinearRegression } from '../regression'

/*****************************************************************************************************************/

describe('performLinearRegression', () => {
  it('should correctly compute slope and intercept for a simple linear relationship', () => {
    const points: Point[] = [
      { x: 0, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 5 },
      { x: 3, y: 7 }
    ]

    const { m, c } = performLinearRegression(points)

    expect(m).toBeCloseTo(2)
    expect(c).toBeCloseTo(1)
  })

  it('should handle floating point values accurately', () => {
    const points: Point[] = [
      { x: 0.5, y: 2.1 },
      { x: 1.5, y: 3.9 },
      { x: 2.5, y: 5.8 },
      { x: 3.5, y: 7.7 }
    ]

    const { m, c } = performLinearRegression(points)

    expect(m).toBeCloseTo(1.867, 2)
    expect(c).toBeCloseTo(1.135, 2)
  })

  it('should correctly compute slope and intercept for a vertical line-like data', () => {
    const points: Point[] = [
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 },
      { x: 4, y: 8 }
    ]

    const { m, c } = performLinearRegression(points)
    expect(m).toBeCloseTo(2)
    expect(c).toBeCloseTo(0)
  })

  it('should handle negative slopes correctly', () => {
    const points: Point[] = [
      { x: 0, y: 10 },
      { x: 1, y: 8 },
      { x: 2, y: 6 },
      { x: 3, y: 4 }
    ]

    const { m, c } = performLinearRegression(points)
    expect(m).toBeCloseTo(-2)
    expect(c).toBeCloseTo(10)
  })

  it('should handle points with zero variance in y', () => {
    const points: Point[] = [
      { x: 0, y: 5 },
      { x: 1, y: 5 },
      { x: 2, y: 5 },
      { x: 3, y: 5 }
    ]

    const { m, c } = performLinearRegression(points)
    expect(m).toBeCloseTo(0)
    expect(c).toBeCloseTo(5)
  })

  it('should compute correct values for a random set of points', () => {
    const points: Point[] = [
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 5 },
      { x: 4, y: 4 },
      { x: 5, y: 6 }
    ]

    const { m, c } = performLinearRegression(points)
    expect(m).toBeCloseTo(0.9)
    expect(c).toBeCloseTo(1.3)
  })

  it('should throw an error when no points are provided', () => {
    const points: Point[] = []

    expect(() => performLinearRegression(points)).toThrow(
      'No valid points provided for linear regression.'
    )
  })

  it('should throw an error when all x values are the same', () => {
    const points: Point[] = [
      { x: 2, y: 3 },
      { x: 2, y: 4 },
      { x: 2, y: 5 }
    ]

    expect(() => performLinearRegression(points)).toThrow(
      'Denominator is zero. Cannot compute linear regression.'
    )
  })
})

/*****************************************************************************************************************/
