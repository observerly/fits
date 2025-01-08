/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import type { FITSBlock, FITSHeader } from '../types'

/*****************************************************************************************************************/

/**
 *
 * parseHeadersFromBlocks
 *
 * @param blocks - Array of FITS blocks to parse headers from
 * @returns Map of headers parsed from the blocks
 */
export const parseHeadersFromBlocks = (blocks: FITSBlock[]): Map<string, FITSHeader> => {
  const headers = new Map<string, FITSHeader>()

  // Flatten all headers from blocks into a single array
  const headerLines = blocks.flatMap(block => block.headers)

  // Keep track of the previous header for handling 'CONTINUE' keys
  let previousHeader: FITSHeader | null = null

  for (const header of headerLines) {
    if (header.key !== 'CONTINUE') {
      // Add the new header to the map and update the previous header reference
      headers.set(header.key, header)
      previousHeader = header
    } else if (previousHeader) {
      // Append 'CONTINUE' values to the previous header's value
      previousHeader.value += ` ${header.value}`
    }
  }

  return headers
}

/*****************************************************************************************************************/
