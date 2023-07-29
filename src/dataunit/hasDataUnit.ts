/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

/**
 *
 * hasDataUnit()
 *
 * @param naxis of type number
 * @returns boolean if the NAXIS value is not zero (and therefore has an associated data unit)
 */
export const hasDataUnit = (naxis: number) => {
  return naxis !== 0
}

/*****************************************************************************************************************/
