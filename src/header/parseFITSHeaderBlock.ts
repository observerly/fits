/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { FITS_ROW_LENGTH } from '../fits/constants'

/*****************************************************************************************************************/

/**
 *
 * parseFITSHeaderBlock()
 *
 * parses a FITS block specifically as a header (looking for the "END" of the
 * FITS header)
 *
 * @param block
 * @returns the raw parsed string value for the ArrayBuffer, and two booleans
 * specifying that the block has both been parsed and the END has been located.
 */
export const parseFITSHeaderBlock = (
  block: ArrayBuffer
): { headers: string[]; end: boolean; parsed: boolean } => {
  const arr = new Uint8Array(block)
  const headers: string[] = []

  let foundEnd = false

  for (let i = 0; i < arr.length; i += FITS_ROW_LENGTH) {
    // Extract 80 bytes for the row
    const row = arr.slice(i, i + FITS_ROW_LENGTH)
    const rowText = String.fromCharCode(...row)

    // Trim the row for easier checking
    const trimmed = rowText.trim()

    // If row is all blanks, skip it
    if (trimmed.length === 0) {
      continue
    }

    if (trimmed.startsWith('END')) {
      foundEnd = true
      break
    }

    headers.push(trimmed)
  }

  return {
    headers,
    end: foundEnd, // So we only set end = true if we found the END keyword
    parsed: headers.length > 0
  }
}

/*****************************************************************************************************************/
