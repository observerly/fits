/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { parseFITSHeaderBlock, parseFITSHeaderRow } from '../header'

import { FITS_BLOCK_LENGTH } from './constants'

import { type FITSBlock } from '../types'

/*****************************************************************************************************************/

export const readBlocksFromFile = async (file: File | Blob): Promise<FITSBlock[]> => {
  let parsedHeadersFromBlocks = false

  const size = file.size

  const blocks: FITSBlock[] = []

  const blob = new Blob([file])

  for (let index = 0; index < size / FITS_BLOCK_LENGTH; index += 1) {
    const offsetStart = index + FITS_BLOCK_LENGTH * index
    const offsetEnd = index + FITS_BLOCK_LENGTH + FITS_BLOCK_LENGTH * index

    const block: FITSBlock = {
      buffer: '-&1',
      parsed: false,
      headers: [],
      offsetStart,
      offsetEnd
    }

    // If we've reached the end of the headers, we can stop parsing the headers:
    if (!parsedHeadersFromBlocks) {
      // Slice the file into a blob, from the start to the end of the block:
      const buffer = await blob.slice(offsetStart, offsetEnd).arrayBuffer()

      const { headers, end, parsed } = parseFITSHeaderBlock(buffer)

      parsedHeadersFromBlocks = end

      block.parsed = parsed
      block.headers = headers.map(parseFITSHeaderRow)
    }

    blocks.push(block)
  }

  return blocks
}

/*****************************************************************************************************************/
