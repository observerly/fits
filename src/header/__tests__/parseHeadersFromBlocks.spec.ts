/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { describe, expect, it } from 'vitest'

import type { FITSBlock } from '../../types'
import { parseHeadersFromBlocks } from '../parseHeadersFromBlocks'

/*****************************************************************************************************************/

describe('parseHeadersFromBlocks', () => {
  it('should correctly parse standard headers without CONTINUE keys', () => {
    const blocks: FITSBlock[] = [
      {
        buffer: '...',
        headers: [
          {
            key: 'SIMPLE',
            value: true,
            comment: 'file conforms to FITS standard'
          },
          {
            key: 'BITPIX',
            value: 16,
            comment: 'number of bits per data pixel'
          },
          {
            key: 'NAXIS',
            value: 2,
            comment: 'number of data axes'
          }
        ],
        offsetStart: 0,
        offsetEnd: 2880
      }
    ]

    const headersMap = parseHeadersFromBlocks(blocks)

    expect(headersMap.size).toBe(3)
    expect(headersMap.get('SIMPLE')).toEqual({
      key: 'SIMPLE',
      value: true,
      comment: 'file conforms to FITS standard'
    })
    expect(headersMap.get('BITPIX')).toEqual({
      key: 'BITPIX',
      value: 16,
      comment: 'number of bits per data pixel'
    })
    expect(headersMap.get('NAXIS')).toEqual({
      key: 'NAXIS',
      value: 2,
      comment: 'number of data axes'
    })
  })

  it('should correctly handle CONTINUE keys by appending their values to the previous header', () => {
    const blocks: FITSBlock[] = [
      {
        buffer: '...',
        headers: [
          {
            key: 'COMMENT',
            value: 'This is a long comment that spans multiple',
            comment: 'initial part'
          },
          {
            key: 'CONTINUE',
            value: 'lines for better readability.',
            comment: 'continued part'
          },
          {
            key: 'END',
            value: true,
            comment: 'end of header'
          }
        ],
        offsetStart: 0,
        offsetEnd: 2880
      }
    ]

    const headersMap = parseHeadersFromBlocks(blocks)

    expect(headersMap.size).toBe(2)
    expect(headersMap.get('COMMENT')).toEqual({
      key: 'COMMENT',
      value: 'This is a long comment that spans multiple lines for better readability.',
      comment: 'initial part'
    })
    expect(headersMap.get('END')).toEqual({ key: 'END', value: true, comment: 'end of header' })
  })

  it('should handle multiple CONTINUE keys sequentially', () => {
    const blocks: FITSBlock[] = [
      {
        buffer: '...',
        headers: [
          {
            key: 'COMMENT',
            value: 'First part of the comment',
            comment: 'initial'
          },
          {
            key: 'CONTINUE',
            value: 'second part',
            comment: 'continued'
          },
          {
            key: 'CONTINUE',
            value: 'third part',
            comment: 'continued'
          },
          {
            key: 'BITPIX',
            value: -32,
            comment: 'number of bits per data pixel'
          }
        ],
        offsetStart: 0,
        offsetEnd: 2880
      }
    ]

    const headersMap = parseHeadersFromBlocks(blocks)

    expect(headersMap.size).toBe(2)
    expect(headersMap.get('COMMENT')).toEqual({
      key: 'COMMENT',
      value: 'First part of the comment second part third part',
      comment: 'initial'
    })
    expect(headersMap.get('BITPIX')).toEqual({
      key: 'BITPIX',
      value: -32,
      comment: 'number of bits per data pixel'
    })
  })

  it('should return an empty map when no headers are provided', () => {
    const blocks: FITSBlock[] = [
      {
        buffer: '...',
        headers: [],
        offsetStart: 0,
        offsetEnd: 2880
      }
    ]

    const headersMap = parseHeadersFromBlocks(blocks)

    expect(headersMap.size).toBe(0)
  })

  it('should handle multiple blocks with overlapping headers and CONTINUE keys', () => {
    const blocks: FITSBlock[] = [
      {
        buffer: '...',
        headers: [
          {
            key: 'COMMENT',
            value: 'Block1 comment part1',
            comment: 'initial'
          },
          {
            key: 'CONTINUE',
            value: 'part2',
            comment: 'continued'
          }
        ],
        offsetStart: 0,
        offsetEnd: 2880
      },
      {
        buffer: '...',
        headers: [
          {
            key: 'COMMENT',
            value: 'Block2 comment part1',
            comment: 'initial'
          },
          {
            key: 'CONTINUE',
            value: 'part2',
            comment: 'continued'
          }
        ],
        offsetStart: 2880,
        offsetEnd: 5760
      }
    ]

    const headersMap = parseHeadersFromBlocks(blocks)

    expect(headersMap.size).toBe(1)
    expect(headersMap.get('COMMENT')).toEqual({
      key: 'COMMENT',
      value: 'Block2 comment part1 part2',
      comment: 'initial'
    })
  })

  it('should ignore CONTINUE keys if there is no previous header', () => {
    const blocks: FITSBlock[] = [
      {
        buffer: '...',
        headers: [
          {
            key: 'CONTINUE',
            value: 'orphaned continue',
            comment: 'no previous header'
          },
          {
            key: 'BITPIX',
            value: 8,
            comment: 'number of bits per data pixel'
          }
        ],
        offsetStart: 0,
        offsetEnd: 2880
      }
    ]

    const headersMap = parseHeadersFromBlocks(blocks)

    expect(headersMap.size).toBe(1)
    expect(headersMap.get('BITPIX')).toEqual({
      key: 'BITPIX',
      value: 8,
      comment: 'number of bits per data pixel'
    })
    // The 'CONTINUE' key should be ignored as there is no previous header
  })
})

/*****************************************************************************************************************/
