import type { FITSBlock } from '../types'

import { FITS_BLOCK_LENGTH } from './constants'

/**
 * getFITSBlocks()
 *
 * @see https://fits.gsfc.nasa.gov/standard40/fits_standard40aa.pdf
 *
 * @param size this is the filesize in bytes
 * @returns the partitioned file into the required number of blocks (and byte offsets) from the FITS standard block size (2880)
 */
export const getFITSBlocks = (size: number): { blocks: FITSBlock[] } => {
  const i: any[] = [...Array(size / FITS_BLOCK_LENGTH)]

  const blocks = i.map((_value, index: number) => {
    return {
      buffer: '-&1',
      offsetStart: index + FITS_BLOCK_LENGTH * index,
      offsetEnd: index + FITS_BLOCK_LENGTH + FITS_BLOCK_LENGTH * index
    }
  })

  return {
    blocks
  }
}
