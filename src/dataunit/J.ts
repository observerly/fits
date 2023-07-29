/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

/**
 *
 * J()
 *
 * Endian swaps are needed for performance.
 *
 * All FITS images are stored in big endian format, but typed arrays
 * initialize based on the endianness of the CPU (typically little endian).
 *
 * Endian swaps will need to be processed to recover the correct values.
 *
 * @param value
 * @returns endian swapped value
 */
export const J = (value: number): number => {
  return (
    ((value & 0xff) << 24) |
    ((value & 0xff00) << 8) |
    ((value >> 8) & 0xff00) |
    ((value >> 24) & 0xff)
  )
}

/*****************************************************************************************************************/
