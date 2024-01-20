/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { FITSBlock, FITSHeader } from '../types'

import { parseFITSHeaderRow, parseFITSHeaderBlock } from '../header'

import { readBlockAsArrayBuffer } from '../utilities'

/*****************************************************************************************************************/

/**
 *
 * readFITSHeaderFromBlocks()
 *
 * @param file the File Object handling the FITS file
 * @param blocks the pre-identified FITSBlocks from total filesize and the default block length.
 * @returns the read into buffer parsed header blocks for the given FITs file.
 */
export const readFITSHeaderFromBlocks = async (
  file: File,
  blocks: FITSBlock[]
): Promise<{
  headers: FITSHeader[]
  blocks: FITSBlock[]
}> => {
  for (const block of blocks) {
    // obtain the individual slices of the file:
    const blob = file.slice(block.offsetStart, block.offsetEnd)

    // read the block from the array buffer asynchronously:
    const { headers, end, parsed } = await readBlockAsArrayBuffer(blob, parseFITSHeaderBlock)

    // the raw parsed string from the array buffer:
    for (const header of headers) {
      block.headers.push(parseFITSHeaderRow(header))
    }

    // make a note of the block that has been parsed:
    block.parsed = parsed

    // If we are at the end of the header, let's exit gracefully:
    if (end) break
  }

  // return the original blocks:
  return {
    blocks,
    headers: blocks.flatMap(block => block.headers)
  }
}
