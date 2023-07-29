/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

export interface FITSBlock {
  /**
   *
   * ArrayBuffer of the block being read-in
   *
   */
  buffer: string | ArrayBuffer
  /**
   *
   * The ArrayBuffer as a raw parsed string
   *
   */
  s?: string
  /**
   *
   *
   * Have we parsed the current block?
   *
   */
  parsed?: boolean
  /**
   *
   * Some offset value giving the offset start in bytes of the current block
   *
   */
  offsetStart: number
  /**
   *
   * Some offset value giving the offset end in bytes of the current block
   *
   */
  offsetEnd: number
}

/*****************************************************************************************************************/
