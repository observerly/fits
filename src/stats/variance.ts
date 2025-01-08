/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2025 observerly

/*****************************************************************************************************************/

import { mean } from './mean'

/*****************************************************************************************************************/

export const variance = (
  arr: number[],
  normalization: 'unbiased' | 'uncorrected' | 'biased' = 'uncorrected'
): number => {
  // Calculate the mean of the array:
  const average = mean(arr)
  // Calculate the number of elements in the array:
  const n = arr.length
  // Correct for the number of degrees of freedom:
  const divisor = normalization === 'unbiased' ? n - 1 : normalization === 'biased' ? n + 1 : n
  // Calculate the sum of the squared differences between each element and the mean:
  return arr.reduce((acc, val) => acc + (val - average) ** 2, 0) / divisor
}

/*****************************************************************************************************************/
