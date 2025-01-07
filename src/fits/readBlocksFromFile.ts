/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2025 observerly

/*****************************************************************************************************************/

import type { FITSBlock } from '../types/block'

import { parseFITSHeaderBlock, parseFITSHeaderRow } from '../header'

import { FITS_BLOCK_LENGTH } from './constants'

/*****************************************************************************************************************/

export const readBlocksFromFile = async (file: File): Promise<FITSBlock[]> => {
  let parsedHeadersFromBlocks = false
  const size = file.size
  const blocks: FITSBlock[] = []
  const blob = new Blob([file])

  const totalBlocks = Math.ceil(size / FITS_BLOCK_LENGTH)
  for (const index of [...Array(totalBlocks)].keys()) {
    const offsetStart = index * FITS_BLOCK_LENGTH
    const offsetEnd = (index + 1) * FITS_BLOCK_LENGTH

    const buffer = await blob.slice(offsetStart, offsetEnd).arrayBuffer()

    const block: FITSBlock = {
      buffer: buffer, // Store the actual buffer
      parsed: false,
      headers: [],
      offsetStart,
      offsetEnd
    }

    if (!parsedHeadersFromBlocks) {
      const { headers, end, parsed } = parseFITSHeaderBlock(buffer)
      parsedHeadersFromBlocks = end
      block.parsed = parsed
      block.headers = [...block.headers, ...headers.map(parseFITSHeaderRow)]
    }

    blocks.push(block)
  }

  return blocks
}

/*****************************************************************************************************************/
