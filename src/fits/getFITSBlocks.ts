import { FITS_BLOCK_LENGTH } from './constants'

/**
 * getFITSBlocks()
 *
 * @see https://fits.gsfc.nasa.gov/standard40/fits_standard40aa.pdf
 *
 * @param size this is the filesize in bytes
 * @returns the partitioned file into the required number of blocks (and byte offsets) from the FITS standard block size (2880)
 */
export const getFITSBlocks = (size: number) => {
  const i: any[] = [...Array(size / FITS_BLOCK_LENGTH)]

  const blocks = i.map((_value, index: number) => {
    return {
      BYTES_OFFSET_START: index + FITS_BLOCK_LENGTH * index,
      BYTES_OFFSET_END: index + FITS_BLOCK_LENGTH + FITS_BLOCK_LENGTH * index
    }
  })

  return {
    blocks
  }
}
