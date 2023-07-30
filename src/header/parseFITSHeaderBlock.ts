/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { FITS_BLOCK_LENGTH, FITS_ROW_LENGTH } from '../fits/constants'

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

  let headers: string[] = []

  for (var i = 0; i < arr.length; i += FITS_ROW_LENGTH) {
    const row = arr.slice(i, i + FITS_ROW_LENGTH)

    const cchar = arr[i]

    if (cchar === 32) {
      continue
    }

    let header = ''

    for (let value of row) {
      header += String.fromCharCode(value)
    }

    const h = header.trim()

    if (h !== 'END') {
      headers.push(h)
    }
  }

  return {
    headers,
    end: true,
    parsed: true
  }
}

/*****************************************************************************************************************/
