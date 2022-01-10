/**
 *
 * FITS_BLOCK_LENGTH
 *
 * A sequence of 2880 8-bit bytes aligned on 2880 byte boundaries
 * in the FITS file, most commonly either a header block or a data
 * block. Special records are another infrequently used type of
 * FITS block. This block length was chosen because it is evenly
 * divisible by the byte and word lengths of all known computer
 * systems at the time FITS was developed in 1979.
 *
 */
export const FITS_BLOCK_LENGTH = 2880
