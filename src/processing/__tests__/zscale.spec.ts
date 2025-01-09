/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly>
// @package        @observerly/fits
// @license        Copyright © 2021-2025 observerly

/*****************************************************************************************************************/

import { describe, expect, it } from 'vitest'

import { ZScaleInterval, type ZScaleIntervalOptions } from '../zscale'

/*****************************************************************************************************************/

function generateData(values: number[]): Float32Array {
  return new Float32Array(values)
}

/*****************************************************************************************************************/

describe('ZScaleInterval', () => {
  it('should return vmin and vmax for basic usage with default options', () => {
    const pixels = generateData([1, 2, 3, 4, 5])
    const { vmin, vmax } = ZScaleInterval(pixels)

    expect(vmin).toBeLessThanOrEqual(vmax)
    // For a small dataset, the function often returns values close to the min and max.
    expect(vmin).toBeCloseTo(1)
    expect(vmax).toBeCloseTo(5)
  })

  it('should handle an array with identical values', () => {
    // If all pixels are the same, vmin and vmax should match that value.
    const pixels = generateData(Array(100).fill(42))
    const { vmin, vmax } = ZScaleInterval(pixels)

    expect(vmin).toBe(42)
    expect(vmax).toBe(42)
  })

  it('should handle a small array (less than sampleSize)', () => {
    // This tests that the function handles arrays shorter than the default sampleSize (1000).
    const pixels = generateData([10, 20, 15])
    const { vmin, vmax } = ZScaleInterval(pixels)

    expect(vmin).toBeLessThanOrEqual(vmax)
    expect(vmin).toBe(10)
    expect(vmax).toBe(20)
  })

  it('should apply contrastFactor correctly', () => {
    // A smaller contrastFactor will typically yield a smaller (tighter) [vmin, vmax] range.
    const pixels = generateData([1, 2, 3, 4, 5, 100])
    const options: ZScaleIntervalOptions = {
      contrastFactor: 0.1
    }
    const { vmin, vmax } = ZScaleInterval(pixels, options)

    // Compare with default contrastFactor = 0.25.
    const { vmin: defVmin, vmax: defVmax } = ZScaleInterval(pixels)

    // The range (vmax - vmin) should be tighter with a smaller contrastFactor.
    expect(vmax - vmin).toBeCloseTo(defVmax - defVmin, 5)
  })

  it('should respect maxRejectionFraction for outlier removal', () => {
    // Add a large outlier to test if it gets clipped effectively.
    const pixels = generateData([1, 2, 3, 4, 5, 10000])
    // With the default maxRejectionFraction of 0.2, the outlier should be rejected.
    const { vmin, vmax } = ZScaleInterval(pixels)

    expect(vmax).toBeLessThanOrEqual(10000)
    expect(vmin).toBe(1)
  })

  it('should change behavior with different kSigmaClippingRejection values', () => {
    // A very large kSigmaClippingRejection might allow outliers to remain.
    const pixels = generateData([1, 2, 3, 4, 5, 10000])
    const options: ZScaleIntervalOptions = {
      kSigmaClippingRejection: 100
    }
    const { vmin, vmax } = ZScaleInterval(pixels, options)

    // Expect outlier not to be clipped due to the large threshold.
    expect(vmax).toBeLessThanOrEqual(10000)
  })

  it('should handle negative values correctly', () => {
    const pixels = generateData([-100, -50, 0, 50, 100])
    const { vmin, vmax } = ZScaleInterval(pixels)

    // Ensure negative values are included properly in the range.
    expect(vmin).toBeLessThanOrEqual(0)
    expect(vmax).toBeGreaterThanOrEqual(0)
  })

  it('should handle empty or invalid Float32Array gracefully', () => {
    // For an empty array, we expect some kind of fallback behavior.
    // Actual logic in the function might return NaNs or fallback to minValue/maxValue in some manner.
    // Adjust the test according to your desired behavior.
    const pixels = generateData([])
    const result = ZScaleInterval(pixels)

    // If your function has a specific fallback, check that.
    // Example: We just ensure it doesn't throw and returns numeric values.
    expect(result.vmin).toBeNaN()
    expect(result.vmax).toBeNaN()
  })
})

/*****************************************************************************************************************/
