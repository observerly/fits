/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

import { readBlocksFromFile } from './readBlocksFromFile'

import { FITS_BLOCK_LENGTH } from './constants'

import { type FITSBlock, type FITSHeader } from '../types'

/*****************************************************************************************************************/

export class FITSFile {
  // The file object that is being parsed:
  protected file: Blob | File = new Blob()

  // The constructor for the FITS class:
  constructor(file: File | Blob) {
    // Set the file:
    this.file = file
  }

  public get size(): number {
    return this.file.size
  }

  public get name(): string {
    return this.file.name
  }
}

/*****************************************************************************************************************/

export class FITSImage extends FITSFile {
  // The blocks of the FITS file:
  private blocks: FITSBlock[] = []

  // The height dimension of the underlying FITS image:
  public height: number = 0

  // The width dimension of the underlying FITS image:
  public width: number = 0

  // The headers of the FITS file:
  public headers: Map<string, FITSHeader> = new Map()

  // The constructor for the FITS class:
  constructor(file: File) {
    super(file)
  }

  /**
   *
   * read()
   *
   * @description reads a file into the FITS class
   *
   */
  public async read(): Promise<FITSImage> {
    this.blocks = await this.parseBlocks()
    this.headers = await this.parseHeaders()
    // Parse the height and width of the FITS file:
    this.height = this.parseHeight()
    this.width = this.parseWidth()

    return this
  }

  /**
   *
   * parseBlocks()
   *
   * @returns the blocks of the FITS file
   */
  public async parseBlocks(): Promise<FITSBlock[]> {
    if (!this.file) {
      throw new Error('No file has been provided to parse.')
    }

    // Obtain the size of the file:
    const size = this.file.size

    // Ensure that the file size is a multiple of the FITS block length:
    if (size % FITS_BLOCK_LENGTH !== 0) {
      throw new Error(
        `The file size of ${size} bytes is not a multiple of the FITS block size of ${FITS_BLOCK_LENGTH} bytes.`
      )
    }

    // Read the blocks from the file:
    this.blocks = await readBlocksFromFile(this.file)

    return this.blocks
  }

  /**
   *
   * parseHeaders()
   *
   * @returns the headers of the FITS file
   */
  private async parseHeaders(): Promise<Map<string, FITSHeader>> {
    if (!this.blocks) {
      throw new Error('No blocks have been parsed.')
    }

    let previousKey: string | null = null
    let previousHeader: FITSHeader | null = null

    this.headers = this.blocks
      .flatMap(block => block.headers)
      .reduce((headers, header) => {
        // If the header is not a standard fits "CONTINUE" header:
        if (header.key !== 'CONTINUE') {
          headers.set(header.key, header)
          // Update previous key and value for future CONTINUE headers
          previousKey = header.key
          previousHeader = null
        }

        // If the header is a standard fits "CONTINUE" header, and we have previous values:
        if (header.key === 'CONTINUE' && previousKey !== null) {
          // Append the value to the previous header's value
          previousHeader = headers.get(previousKey)
        }

        // If we have a previous header, append the current value to the previous value:
        if (previousHeader) {
          previousHeader.value += ` ${header.value}`
        }

        return headers
      }, new Map())

    return this.headers
  }

  /**
   *
   * parseHeight()
   *
   * @returns the height of the FITS image file from the NAXIS1 header
   *
   */
  private parseHeight = (): number => {
    const height = this.getHeader('NAXIS1')?.value || 0

    // If the height is a boolean, it's probably a T/F value, so return 0:
    if (typeof height === 'boolean') {
      return 0
    }

    // If the height is a string, it's probably a comment, so attempt to parse it:
    if (typeof height === 'string') {
      return parseInt(height)
    }

    return height
  }

  /**
   *
   * parseWidth()
   *
   * @returns the width of the FITS image file from the NAXIS2 header
   *
   */
  private parseWidth = (): number => {
    const width = this.getHeader('NAXIS2')?.value || 0

    // If the width is a boolean, it's probably a T/F value, so return 0:
    if (typeof width === 'boolean') {
      return 0
    }

    // If the width is a string, it's probably a comment, so attempt to parse it:
    if (typeof width === 'string') {
      return parseInt(width)
    }

    return width
  }

  /**
   *
   * getHeader()
   *
   * @returns the header of the FITS file
   */
  public getHeader(key: string): FITSHeader | undefined {
    return this.headers.get(key)
  }

  /**
   *
   * destroy()
   *
   * @description destroys the current File instance of the FITS file, and the parsed blocks
   *
   */
  public destroy(): void {
    this.file = new File([], '')
    this.blocks = []
    this.headers = new Map()
  }
}

/*****************************************************************************************************************/
