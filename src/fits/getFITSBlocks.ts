/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import type { FITSBlock } from '../types'

import { FITS_BLOCK_LENGTH } from './constants'

/*****************************************************************************************************************/

/**
 * getFITSBlocks()
 *
 * @see https://fits.gsfc.nasa.gov/standard40/fits_standard40aa.pdf
 *
 * @param size this is the filesize in bytes
 * @returns the partitioned file into the required number of blocks (and byte offsets) from the FITS standard block size (2880)
 */
export const getFITSBlocks = (size: number): FITSBlock[] => {
  const blocks = [...Array(size / FITS_BLOCK_LENGTH)].map((_value, index: number) => {
    return {
      buffer: '-&1',
      parsed: false,
      headers: [],
      offsetStart: index + FITS_BLOCK_LENGTH * index,
      offsetEnd: index + FITS_BLOCK_LENGTH + FITS_BLOCK_LENGTH * index
    }
  })

  return blocks
}

/*****************************************************************************************************************/
