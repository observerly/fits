import type { FITSHeader } from '../types'

/**
 *
 * parseFITSHeaderRow()
 *
 * @description Parses a FITS header row string into it's consituent key, value and comment pair.
 *
 * @note Can handle both KEYWORD key, as well as COMMENT and HISTORY keys.
 *
 * @param line
 * @returns header in foramtted FITSHeader object { key, value, comment }
 */
export const parseFITSHeaderRow = (line: string): FITSHeader => {
  // bytes 1 to 8 will contain the key or whitespace
  const key: string = line.slice(0, 8).trim()

  // Let's sepcify some blank value
  let value: string | number | boolean = ''

  // Check to see if our header has key = value separator:
  const indicator = line.slice(8, 10)

  if (indicator !== '= ') {
    // If it doesn't, we're probably dealing with a COMMENT / HISTORY record
    value = line.slice(8).trim()

    return {
      key,
      value,
      comment: value
    }
  }

  // Let's slice the record from byte 10, and split on the comment separator '/
  let [v, c] = line.slice(10).split('/')

  v = v.trim()

  if (v[0] === "'") {
    value = v.slice(1, -1).trim()
  }

  if (!isNaN(parseFloat(v))) {
    value = parseFloat(v)
  }

  if (v.length === 1 && ['T', 'F'].includes(v)) {
    value = 'T' ? true : false
  }

  const comment = c ? c.trim() : ''

  return {
    key,
    value,
    comment
  }
}
