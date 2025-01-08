/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly>
// @package        @observerly/fits
// @license        Copyright © 2021-2025 observerly

/*****************************************************************************************************************/

export type Point = {
  x: number
  y: number
}

/*****************************************************************************************************************/

/**
 *
 * performLinearRegression
 *
 * Calculates the linear regression (slope and intercept) for a set of points.
 * This is crucial for identifying the trend within the pixel data, enabling effective contrast adjustment.
 *
 * @param points: Array of points containing x and y coordinates.
 * @returns: An object containing the y-intercept (`c`) and the slope (`m`) of the fitted line.
 * @throws Will throw an error if there is insufficient variation in the x-values.
 */
export function performLinearRegression(points: Point[]): { m: number; c: number } {
  const n = points.length

  if (n === 0) {
    throw new Error('No valid points provided for linear regression.')
  }

  // Aggregate sums required for calculating slope and intercept using reduce for immutability and clarity:
  const { sumX, sumY, sumXY, sumX2 } = points.reduce(
    (acc, { x, y }) => ({
      sumX: acc.sumX + x,
      sumY: acc.sumY + y,
      sumXY: acc.sumXY + x * y,
      sumX2: acc.sumX2 + x ** 2
    }),
    { sumX: 0, sumY: 0, sumXY: 0, sumX2: 0 }
  )

  // Calculate the denominator to ensure there is enough variation in x-values for a valid regression:
  const denominator = n * sumX2 - sumX ** 2

  if (denominator === 0) {
    throw new Error('Denominator is zero. Cannot compute linear regression.')
  }

  // Compute the slope (m) of the best-fit line:
  const m = (n * sumXY - sumX * sumY) / denominator

  // Compute the y-intercept (c) of the best-fit line:
  const c = (sumY - m * sumX) / n

  return { m, c }
}

/*****************************************************************************************************************/
