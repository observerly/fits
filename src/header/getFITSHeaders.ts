import type { FITSHeader } from '../types'

import { FITS_ROW_LENGTH } from '../fits/constants'

import { parseFITSHeaderRow } from '.'

/**
 *
 * getFITSHeaders()
 *
 * @description obtains the header for a specific FITS block of size 2880 bytes
 *
 * @see https://fits.gsfc.nasa.gov/standard40/fits_standard40aa.pdf
 *
 * @param block of type string
 * @returns the extracted headers relating to the parsing method
 */
export const getFITSHeaders = (block: string): FITSHeader[] => {
  // Empty storage for our headers:
  const headers: FITSHeader[] = []

  // Maximum amount of block lines to parse as headers can
  // become extremely large. This parameter limits the number
  // of lines that are parsed.Typically the important information
  // describing the structure of the associated data unit and
  // astrometry are near the top.
  const maximumBlockRow = 600

  let numberofRowPerBlock =
    block.length / FITS_ROW_LENGTH < maximumBlockRow
      ? block.length / FITS_ROW_LENGTH
      : maximumBlockRow

  // Iterate over the block to generate the slices of each of the
  // rows from the 2880 block size:
  for (
    let i = 0, end = numberofRowPerBlock - 1, asc = 0 <= end;
    asc ? i <= end : i >= end;
    asc ? i++ : i--
  ) {
    const row = block.slice(i * FITS_ROW_LENGTH, (i + 1) * FITS_ROW_LENGTH)
    headers.push(parseFITSHeaderRow(row))
  }

  return headers
}
