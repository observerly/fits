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
