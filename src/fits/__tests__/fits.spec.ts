/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/fits
// @license        Copyright © 2021-2025 observerly

/*****************************************************************************************************************/

import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { ImageData, createCanvas } from 'canvas'
import * as fs from 'node:fs'
import * as path from 'node:path'

import { FITS, ZScaleInterval } from '../..'

/*****************************************************************************************************************/

const filename = 'Rosetta_Nebula_[Ha]_Monochrome_M_300s_2024-11-26T17_20_00Z.fits'

/*****************************************************************************************************************/

const input = path.join(__dirname, `../../../samples/RosettaNebula/${filename}`)

/*****************************************************************************************************************/

const output = path.join(__dirname, '../../../output')

/*****************************************************************************************************************/

let file: File

/*****************************************************************************************************************/

beforeAll(() => {
  // Read the FITS file and create a File object
  const fileBuffer = fs.readFileSync(input)
  file = new File([fileBuffer], 'sample.fit', { type: 'application/octet-stream' })
})

/*****************************************************************************************************************/

afterAll(() => {
  // Clean up
  // fs.rmdirSync(output, { recursive: true })
})

/*****************************************************************************************************************/

describe('FITS', () => {
  it('should be defined', () => {
    expect(FITS).toBeDefined()
  })

  it('should create an instance of FITS', () => {
    const fits = new FITS()
    expect(fits).toBeInstanceOf(FITS)
  })

  it('should read a FITS file from a File object', async () => {
    const fits = new FITS()
    await fits.readFromFile(file)
    expect(fits.getHeaders()).toBeInstanceOf(Map)
  })

  it('should read a FITS file from a Blob object', async () => {
    const blob = new Blob([file], { type: 'application/octet-stream' })
    const fits = new FITS()
    await fits.readFromBlob(blob, filename)
    expect(fits.getHeaders()).toBeInstanceOf(Map)
  })

  it('should read a FITS file from an ArrayBuffer', async () => {
    const buffer = await file.arrayBuffer()
    const fits = new FITS()
    await fits.readFromBuffer(buffer, filename)
    expect(fits.getHeaders()).toBeInstanceOf(Map)
  })

  it('should correctly parse headers from a FITS file', async () => {
    const fits = new FITS()
    await fits.readFromFile(file)
    const headers = fits.getHeaders()

    expect(headers).toBeInstanceOf(Map)
    expect(headers.size).toBeGreaterThan(0)

    expect(headers.get('SIMPLE')).toEqual({
      key: 'SIMPLE',
      value: true,
      comment: 'FITS Standard 4.0'
    })

    expect(headers.get('BITPIX')).toEqual({
      key: 'BITPIX',
      value: -32,
      comment: 'Number of bits per data pixel'
    })

    expect(headers.get('NAXIS')).toEqual({
      key: 'NAXIS',
      value: 2,
      comment: '[1] Number of array dimensions'
    })

    expect(headers.get('NAXIS1')).toEqual({
      key: 'NAXIS1',
      value: 1463,
      comment: '[1] Length of data axis 1'
    })

    expect(headers.get('NAXIS2')).toEqual({
      key: 'NAXIS2',
      value: 1168,
      comment: '[1] Length of data axis 2'
    })

    expect(headers.get('BSCALE')).toEqual({
      key: 'BSCALE',
      value: 1,
      comment: ''
    })

    expect(headers.get('BZERO')).toEqual({
      key: 'BZERO',
      value: 0,
      comment: ''
    })
  })

  it('should correctly destroy the FITS instance', async () => {
    const fits = new FITS()
    await fits.readFromFile(file)
    fits.destroy()
    expect(fits.getHeaders()).toBeInstanceOf(Map)
    expect(fits.getHeaders().size).toBe(0)
    expect(fits.width).toBe(0)
    expect(fits.height).toBe(0)
    expect(fits.getImageHDU()).toBeInstanceOf(Float32Array)
    expect(fits.getImageHDU().length).toBe(0)
    expect(fits.bitpix).toBe(0)
    expect(fits.bzero).toBe(0)
    expect(fits.bscale).toBe(1)
  })
})

/*****************************************************************************************************************/

describe('FITS', () => {
  it('should parse FITS from file, retrieve normalized data, and write a JPEG', async () => {
    // Read the file from disk into a Buffer:
    const fitsBuffer = fs.readFileSync(input)
    const file = new File([fitsBuffer], 'test.fits')
    const fits = await new FITS().readFromFile(file)
    expect(fits.width).toBeGreaterThan(0)
    expect(fits.height).toBeGreaterThan(0)

    // Now, getImageHDU() returns a Float32Array of normalized [0..255] data:
    let data = fits.getImageHDU()

    // Compute the zscale interval for normalization giving us vmin and vmax:
    const { vmin, vmax } = ZScaleInterval(data)

    const resolution = fits.width * fits.height

    // Normalize the data to the [0..255] range
    const normalizedData = new Float32Array(resolution)

    for (let i = 0; i < resolution; i++) {
      normalizedData[i] = ((data[i] - vmin) / (vmax - vmin)) * 255
    }

    data = normalizedData

    // For consistency, confirm we have width*height pixels:
    const width = fits.width
    const height = fits.height
    const pixels = width * height
    expect(data.length).toBe(pixels)

    // Create a canvas and 2D context to paint the ImageData:
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Could not get 2D context from node-canvas.')
    }

    // Build an RGBA buffer from the normalized grayscale data:
    const rgba = new Uint8ClampedArray(pixels * 4)
    for (let i = 0; i < pixels; i++) {
      // Already scaled to [0..255] by getImageData():
      const gray = Math.floor(data[i])

      const idx = i * 4
      rgba[idx + 0] = gray // R
      rgba[idx + 1] = gray // G
      rgba[idx + 2] = gray // B
      rgba[idx + 3] = 255 // A
    }

    // Paint the ImageData on the canvas at (0, 0):
    const imageData = new ImageData(rgba, width, height)
    ctx.putImageData(imageData, 0, 0)

    // Convert to JPEG buffer with 90% quality:
    const image = canvas.toBuffer('image/jpeg', { quality: 0.9 })

    // Ensure the output directory exists before writing the JPEG file:
    if (!fs.existsSync(output)) {
      fs.mkdirSync(output, { recursive: true })
    }

    // Write the final JPEG file to disk:
    const outputPath = path.join(output, 'output.jpg')

    // Convert Buffer to Uint8Array for fs.writeFile():
    const uint8Array = new Uint8Array(image.buffer, image.byteOffset, image.byteLength)
    fs.writeFileSync(outputPath, uint8Array)

    // Confirm the output file is not empty:
    const stats = fs.statSync(outputPath)
    expect(stats.size).toBeGreaterThan(0)
  })
})

/*****************************************************************************************************************/
