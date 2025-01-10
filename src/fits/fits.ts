/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2025 observerly

/*****************************************************************************************************************/

import type { FITSHeader } from '../types/header'

import type { FITSBlock } from '../types/block'

import { parseHeadersFromBlocks } from '../header'

import { FITS_BLOCK_LENGTH } from './constants'

import { readBlocksFromFile } from './readBlocksFromFile'

/*****************************************************************************************************************/

export class FITS {
  // The blocks of the FITS file (each 2880 bytes):
  private blocks: FITSBlock[] = []
  // The headers of the FITS file (keyword => FITSHeader):
  private headers: Map<string, FITSHeader> = new Map()
  // The raw image data from the FITS file:
  private image: Float32Array = new Float32Array()
  // The bits per pixel (BITPIX) of the underlying FITS image:
  public bitpix = 0
  // The height dimension (in pixels) of the underlying FITS image:
  public height = 0
  // The width dimension (in pixels) of the underlying FITS image:
  public width = 0
  // The declared number of axes (NAXIS):
  public naxis = 2
  // The BSCALE factor for pixel data:
  public bscale = 1
  // The BZERO offset for pixel data:
  public bzero = 0

  /**
   *
   * readFromFile(file: File)
   *
   * @description reads from a file into the FITS class, parses headers, width/height,
   * bitpix, BSCALE/BZERO, etc.
   * @returns the FITS instance
   */
  public async readFromFile(file: File): Promise<FITS> {
    const size = file.size
    // Ensure the file size is a multiple of FITS_BLOCK_LENGTH:
    if (size % FITS_BLOCK_LENGTH !== 0) {
      throw new Error(`File size ${size} is not a multiple of ${FITS_BLOCK_LENGTH}.`)
    }

    // Read the blocks from the file:
    this.blocks = await readBlocksFromFile(file)

    // Parse the headers from the blocks:
    this.headers = await this.parseHeaders()

    // Parse the dimensions from the headers:
    this.naxis = this.getFloatHeader('NAXIS') || 0

    // Parse the image width in pixels from the headers:
    this.width = this.getIntHeader('NAXIS1') || 0

    // Parse the image height in pixels from the headers:
    this.height = this.getIntHeader('NAXIS2') || 0

    // Parse the bits per pixe from the headers:
    this.bitpix = this.getFloatHeader('BITPIX') || -32

    // Parse the BSCALE value from the headers:
    this.bscale = this.getFloatHeader('BSCALE') || 1

    // Parse the BZERO value from the headers:
    this.bzero = this.getFloatHeader('BZERO') || 0

    // Parse the image data from the blocks:
    this.image = await this.parseDataFromFile(file)

    return this
  }

  /**
   *
   * readFromBlob(blob: Blob)
   *
   * @description reads from a blob into the FITS class, parses headers, width/height,
   * bitpix, BSCALE/BZERO, etc.
   * @returns the FITS instance
   */
  public async readFromBlob(blob: Blob, filename: string): Promise<FITS> {
    const file = new File([blob], filename, { type: blob.type })
    return await this.readFromFile(file)
  }

  /**
   *
   * readFromBuffer(buffer: ArrayBuffer)
   *
   * @description reads from a buffer into the FITS class, parses headers, width/height,
   * bitpix, BSCALE/BZERO, etc.
   * @returns the FITS instance
   */
  public async readFromBuffer(buffer: ArrayBuffer, filename: string): Promise<FITS> {
    const blob = new Blob([buffer], { type: 'application/octet-stream' })
    return await this.readFromBlob(blob, filename)
  }

  /**
   * parseHeaders()
   *
   * @description flattens out all headers from the blocks until 'END'
   * @returns a Map of FITSHeader objects
   */
  private async parseHeaders(): Promise<Map<string, FITSHeader>> {
    this.headers.clear()
    return parseHeadersFromBlocks(this.blocks)
  }

  /**
   *
   * getHeaderOffsetEnd()
   *
   * @description returns the offsetEnd of the last parsed block in the blocks array
   * @returns the offsetEnd of the last parsed block
   *
   */
  private getHeaderOffsetEnd() {
    const parsedBlocks = this.blocks.filter(b => b.parsed)

    if (parsedBlocks.length === 0) {
      return 0
    }

    const lastBlock = parsedBlocks[parsedBlocks.length - 1]

    return lastBlock.offsetEnd
  }

  /**
   *
   * getFloatHeader(key: string)
   *
   * @description returns a header value as a float
   * @returns the header value as a float
   */
  public getFloatHeader(key: string): number | undefined {
    const hdr = this.getHeader(key)
    if (!hdr) return
    const val = Number.parseFloat(String(hdr.value))
    return Number.isNaN(val) ? 0 : val
  }

  /**
   * getStringHeader(key: string)
   *
   * @description returns a header value as a string
   * @returns the header value as a string
   */
  public getStringHeader(key: string): string | undefined {
    const hdr = this.getHeader(key)
    if (!hdr) return
    const val = String(hdr.value)
    return val
  }

  /**
   *
   * getBooleanHeader(key: string)
   *
   * @description returns a header value as a boolean
   * @returns true if the value is truthy, false if the value is falsy, or undefined if the value is not found
   */
  public getBooleanHeader(key: string): boolean | undefined {
    const hdr = this.getHeader(key)
    if (!hdr) return
    const val = Boolean(hdr.value)
    return val
  }

  /**
   *
   * getIntHeader(key: string)
   *
   * @description returns a header value as an integer
   * @returns the integer value, or 0 if the value is not a number
   */
  public getIntHeader(key: string): number | undefined {
    const hdr = this.getHeader(key)
    if (!hdr) return
    const val = Number.parseInt(String(hdr.value), 10)
    return Number.isNaN(val) ? 0 : val
  }

  /**
   *
   * getHeader(key: string)
   *
   * @description returns the FITSHeader for the given key, if it exists
   */
  public getHeader(key: string): FITSHeader {
    const header = this.headers.get(key)
    if (!header) {
      throw new Error(`Header not found: ${key}`)
    }
    return header
  }

  /**
   *
   * getHeaders()
   *
   * @description returns all headers as a Map<string, FITSHeader>
   *
   */
  public getHeaders(): Map<string, FITSHeader> {
    return this.headers
  }

  /**
   * getImageHDU()
   *
   * @description returns the normalized image data as a Float32Array
   */
  public getImageHDU(): Float32Array {
    return this.image
  }

  /**
   *
   * parseDataFromFile(file: File)
   *
   * @description extracts raw image data from the file, applies BSCALE / BZERO,
   * then normalizes it using a zscale approach (matching your advanced snippet).
   * @returns a Float32Array of normalized [0..255] data.
   */
  private async parseDataFromFile(file: File): Promise<Float32Array> {
    // Ensure we have valid dimensions:
    if (!this.width || !this.height) {
      throw new Error(`Invalid dimensions: ${this.width}x${this.height}`)
    }

    // Ensure we have a valid BITPIX before proceeding:
    if (!this.bitpix) {
      throw new Error(`Invalid BITPIX: ${this.bitpix}`)
    }

    // Find where the header ends and the data begins:
    const start = this.getHeaderOffsetEnd()

    const resolution = this.width * this.height

    // Calculate the number of bytes per pixel based on BITPIX:
    const bytesPerPixel = Math.abs(this.bitpix) / 8

    // Calculate the size of the buffer based on the dimensions and bytes per pixel:
    const size = this.width * this.height * bytesPerPixel

    // Slice the file to the data section:
    const buffer = await file.slice(start, start + size).arrayBuffer()

    // Create a DataView to read the data:
    const dataView = new DataView(buffer)

    // We'll read the data into a Float32Array for display convenience:
    const data = new Float32Array(resolution)

    // Initialize the offset to 0:
    let offset = 0

    for (let i = 0; i < resolution; i++) {
      let value: number

      // Determine the value based on BITPIX using a switch statement for clarity
      switch (this.bitpix) {
        case 8:
          value = dataView.getUint8(offset)
          break
        case 16:
          // Use the 'false' flag to indicate big-endian byte order:
          value = dataView.getInt16(offset, false)
          break
        case 32:
          // Use the 'false' flag to indicate big-endian byte order:
          value = dataView.getInt32(offset, false)
          break
        case -32:
          // Use the 'false' flag to indicate big-endian byte order:
          value = dataView.getFloat32(offset, false)
          break
        case -64:
          // Use the 'false' flag to indicate big-endian byte order:
          value = dataView.getFloat64(offset, false)
          break
        default:
          // Throw an error for unsupported BITPIX values (this should never happen):
          throw new Error(`Unsupported BITPIX value: ${this.bitpix}`)
      }

      // Increment the offset based on bytes per pixel
      offset += bytesPerPixel

      // Apply BSCALE and BZERO to calculate the final data value:
      data[i] = value * this.bscale + this.bzero
    }

    return data
  }

  /**
   * destroy()
   *
   * @description clears out references to file, blocks, headers, etc.
   */
  public destroy(): void {
    this.blocks = []
    this.headers.clear()
    this.image = new Float32Array()
    this.bitpix = 0
    this.height = 0
    this.width = 0
    this.bscale = 1
    this.bzero = 0
  }
}

/*****************************************************************************************************************/
