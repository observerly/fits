/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

/**
 *
 * FITS File Header
 *
 * @see https://heasarc.gsfc.nasa.gov/docs/fcg/standard_dict.html
 *
 */
export interface FITSHeader {
  /**
   *
   * Header Key
   *
   */
  key: string
  /**
   *
   * Header Value
   *
   */
  value: string | number | boolean
  /**
   *
   * Header Comment
   *
   */
  comment: string
}

/*****************************************************************************************************************/
