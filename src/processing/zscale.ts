/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly>
// @package        @observerly/fits
// @license        Copyright © 2021-2025 observerly

/*****************************************************************************************************************/

import { type Point, median, performLinearRegression, variance } from '../stats'

/*****************************************************************************************************************/

export type ZScaleIntervalOptions = {
  /**
   *
   * The number of samples to take from the pixels array for efficiency.
   *
   * @default 1000
   *
   */
  sampleSize?: number
  /**
   *
   * The contrast adjustment factor; smaller values increase the contrast.
   *
   * @default 0.25
   *
   */
  contrastFactor?: number
  /**
   *
   * The maximum fraction of pixels to reject as outliers. Default is 20%.
   *
   * @default 0.2
   *
   */
  maxRejectionFraction?: number
  /**
   *
   * The number of standard deviations for k-sigma clipping.
   *
   * @default 2.5
   *
   */
  kSigmaClippingRejection?: number
  /**
   *
   * The number of iterations to perform for k-sigma clipping.
   * @default 3
   *
   */
  iterations?: number
}

/*****************************************************************************************************************/

/**
 *
 * ZScaleInterval
 *
 * Computes the Z-Scale normalization interval for image pixel data.
 * This method dynamically adjusts image contrast by selecting an optimal range of pixel values.
 *
 * @param pixels: An array of pixel values to normalize.
 * @param options: An object containing optional parameters for the normalization process.
 * @returns: An object containing `vmin` and `vmax` values for normalization.
 */
export function ZScaleInterval(
  pixels: Float32Array,
  options: ZScaleIntervalOptions = {}
): { vmin: number; vmax: number } {
  let {
    sampleSize = 1000,
    contrastFactor = 0.25,
    maxRejectionFraction = 0.2,
    kSigmaClippingRejection = 2.5,
    iterations = 3
  } = options || {}

  if (pixels.length === 0) {
    return { vmin: Number.NaN, vmax: Number.NaN }
  }

  if (pixels.length === 1) {
    return { vmin: pixels[0], vmax: pixels[0] }
  }

  if (pixels.length < sampleSize) {
    sampleSize = pixels.length
  }

  // Sample the pixel values uniformly to manage performance with large datasets:
  const stride = Math.max(1, Math.floor(pixels.length / sampleSize))

  // Extract the sampled pixel values and filter out undefined values, if any:
  const sampledValues = Array.from({ length: sampleSize }, (_, i) => pixels[i * stride])
    .filter(v => v !== undefined)
    .sort((a, b) => a - b)

  let minValue = sampledValues[0]
  let maxValue = sampledValues[sampleSize - 1]

  // Convert sampled pixel values into points for linear regression:
  const points: Point[] = sampledValues.map((y, x) => ({ x, y }))

  // Initialize variables for the iterative k-sigma clipping process:
  let currentGoodPixelCount = sampleSize
  let previousGoodPixelCount = currentGoodPixelCount + 1

  // Flags to mark pixels as outliers:
  const badPixelFlags = Array<boolean>(sampleSize).fill(false)

  // Determine the minimum number of good pixels required to proceed:
  const minimumGoodPixels = Math.max(5, Math.floor(sampleSize * maxRejectionFraction))

  // Placeholder for the results of the linear fit:
  let linearFitResult: { c: number; m: number } = { c: 0, m: 0 }

  // Perform iterative k-sigma clipping to exclude outliers from the data:
  for (let iteration = 0; iteration < iterations; iteration++) {
    // Exit the loop if the number of good pixels has stabilized or fallen below the minimum:
    if (
      currentGoodPixelCount >= previousGoodPixelCount ||
      currentGoodPixelCount < minimumGoodPixels
    ) {
      break
    }

    // Select points that are not flagged as bad:
    const goodPoints = points.filter((_, index) => !badPixelFlags[index])

    // Compute linear regression on the current set of good points:
    try {
      linearFitResult = performLinearRegression(goodPoints)
    } catch (error) {
      // If linear regression cannot be performed, terminate the clipping process:
      break
    }

    // Calculate residuals: the difference between actual and fitted y-values:
    const residuals = points.map(({ x, y }) => y - (linearFitResult.m * x + linearFitResult.c))

    // Extract residuals of good pixels to compute standard deviation:
    const goodResiduals = residuals.filter((_, index) => !badPixelFlags[index])
    const residualStdDev = Math.sqrt(variance(goodResiduals))

    // Define the threshold for identifying outliers based on the sigma rejection factor:
    const rejectionThreshold = kSigmaClippingRejection * residualStdDev

    // Update badPixelFlags based on residuals exceeding the threshold and count good pixels:
    currentGoodPixelCount = 0
    residuals.forEach((residual, index) => {
      if (Math.abs(residual) > rejectionThreshold) {
        badPixelFlags[index] = true
      } else {
        badPixelFlags[index] = false
        currentGoodPixelCount++
      }
    })

    // Update the count for the next iteration:
    previousGoodPixelCount = currentGoodPixelCount
  }

  // Adjust the scaling range based on the linear fit and contrast factor if sufficient good pixels remain:
  if (currentGoodPixelCount < minimumGoodPixels) {
    return { vmin: minValue, vmax: maxValue }
  }

  let adjustedSlope = linearFitResult.m
  if (contrastFactor > 0) {
    adjustedSlope /= contrastFactor
  }

  const medianValue = median(sampledValues)
  const medianPixelIndex = Math.floor((sampleSize - 1) / 2)

  // Expand the scaling range around the median value using the adjusted slope:
  minValue = Math.max(minValue, medianValue - (medianPixelIndex - 1) * adjustedSlope)
  maxValue = Math.min(maxValue, medianValue + (sampleSize - medianPixelIndex) * adjustedSlope)

  return { vmin: minValue, vmax: maxValue }
}

/*****************************************************************************************************************/
