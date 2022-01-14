import { FITS_BLOCK_LENGTH, FITS_ROW_LENGTH } from '../fits/constants'

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
): { s: string; end: boolean; parsed: boolean } => {
  const arr = new Uint8Array(block)

  let rows = FITS_BLOCK_LENGTH / FITS_ROW_LENGTH

  let s = ''

  // We need to mark when we are at the END of a FITS header:
  let end = false

  // Just a flag to distinguish between a block that has been parsed and a block
  // that hasn't:
  let parsed = false

  // Check the current block one row at a time starting from the end:
  while (rows--) {
    const rowIndex = rows * FITS_ROW_LENGTH

    const cchar = arr[rowIndex]

    if (cchar === 32) {
      continue
    }

    // Check for END keyword with trailing space (69 "E", 78 "N", 68 "D", 32 " ")
    if (
      cchar === 69 &&
      arr[rowIndex + 1] === 78 &&
      arr[rowIndex + 2] === 68 &&
      arr[rowIndex + 3] === 32
    ) {
      for (let value of Array.from(arr)) {
        s += String.fromCharCode(value)
      }
      end = true
      parsed = true
      break
    }
  }

  return {
    s,
    end,
    parsed
  }
}
