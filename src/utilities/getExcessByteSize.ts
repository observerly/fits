/**
 *
 * getExcessByteSize()
 *
 * @param length the padded byte size
 * @param size the actual byte size
 * @returns the excess number of bytes padded to some unit
 */
export const getExcessByteSize = (length: number, size: number): number => {
  return (length - (size % length)) % length
}
