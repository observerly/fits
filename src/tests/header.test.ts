import type { FITSHeader } from '../types'

import { describe, expect, it, suite } from 'vitest'

import {
  getFITSHeaders,
  parseFITSHeaderBlock,
  parseFITSHeaderRow,
  readFITSHeaderFromBlocks
} from '..'

suite('@observerly/fits Header', () => {
  describe('FITS File Header Extraction', () => {
    it('getFITSHeaders should be defined', () => {
      expect(getFITSHeaders).toBeDefined()
    })

    it('getFITSHeaders should return the headers for a give block correctly', () => {
      const block = `SIMPLE  =                    T / file does conform to FITS standard             BITPIX  =                    8 / number of bits per data pixel                  NAXIS   =                    0 / number of array dimensions or data axes        EPOCH   =             'Julian' / epoch of observation`

      const headers = getFITSHeaders(block)

      expect(headers[0].key).toBe('SIMPLE')
      expect(headers[0].value).toBe(true)
      expect(headers[0].comment).toBe('file does conform to FITS standard')

      expect(headers[1].key).toBe('BITPIX')
      expect(headers[1].value).toBe(8)
      expect(headers[1].comment).toBe('number of bits per data pixel')

      expect(headers[2].key).toBe('NAXIS')
      expect(headers[2].value).toBe(0)
      expect(headers[2].comment).toBe('number of array dimensions or data axes')
    })

    it('getFITSHeaders should return the headers for a give block correctly', () => {
      const block = `SIMPLE  =                    T / C# FITS                                        BITPIX  =                   16 /                                                NAXIS   =                    2 / Dimensionality                                 NAXIS1  =                 5496 /                                                NAXIS2  =                 3672 /                                                BZERO   =                32768 /                                                EXTEND  =                    T / Extensions are permitted                       IMAGETYP= 'LIGHT'              / Type of exposure                               EXPOSURE=                   60 / [s] Exposure duration                          DATE-LOC= 2020-01-21T21:29:08.357 / Time of observation (local)                 DATE-OBS= 2020-01-21T20:29:08.357 / Time of observation (UTC)                   XBINNING=                    1 / X axis binning factor                          YBINNING=                    1 / Y axis binning factor                          GAIN    =                   50 / Sensor gain                                    OFFSET  =                    8 / Sensor gain offset                             EGAIN   =    0.020356755703688 / [e-/ADU] Electrons per A/D unit                XPIXSZ  =                  2.4 / [um] Pixel X axis size                         YPIXSZ  =                  2.4 / [um] Pixel Y axis size                         INSTRUME= 'ZWO ASI183MM Pro'   / Imaging instrument name                        SET-TEMP=                  -20 / [degC] CCD temperature setpoint                CCD-TEMP=                  -20 / [degC] CCD temperature                         TELESCOP= 'Takahashi FC76-DCU' / Name of telescope                              FOCALLEN=                  456 / [mm] Focal length                              FOCRATIO=                    6 / Focal ratio                                    RA      =     84.0666666666667 / [deg] RA of telescope                          DEC     =    -5.37972222222222 / [deg] Declination of telescope                 SITEELEV=                  100 / [m] Observation site elevation                 SITELAT =                 49.3 / [deg] Observation site latitude                SITELONG=                 8.65 / [deg] Observation site longitude               FWHEEL  = 'ZWO FilterWheel (1' / Filter Wheel name                              FILTER  = 'L'                  / Active filter name                             OBJECT  = 'Great Orion Nebula' / Name of the object of interest                 OBJCTRA = '05 35 17'           / [H M S] RA of imaged object                    OBJCTDEC= '-05 23 28'          / [D M S] Declination of imaged object           SWCREATE= 'N.I.N.A. 1.9.0.900' / Software that created this file                END`

      const headers = getFITSHeaders(block)

      const BITPIX = headers.find((header: FITSHeader) => header.key === 'BITPIX')
      expect(BITPIX).toBeDefined()
      expect(BITPIX).toMatchObject({ key: 'BITPIX', value: 16, comment: '' })

      const NAXIS = headers.find((header: FITSHeader) => header.key === 'NAXIS')
      expect(NAXIS).toBeDefined()
      expect(NAXIS).toMatchObject({ key: 'NAXIS', value: 2, comment: 'Dimensionality' })

      const NAXIS1 = headers.find((header: FITSHeader) => header.key === 'NAXIS1')
      expect(NAXIS1).toBeDefined()
      expect(NAXIS1).toMatchObject({ key: 'NAXIS1', value: 5496, comment: '' })

      const NAXIS2 = headers.find((header: FITSHeader) => header.key === 'NAXIS2')
      expect(NAXIS2).toBeDefined()
      expect(NAXIS2).toMatchObject({ key: 'NAXIS2', value: 3672, comment: '' })
    })
  })

  describe('FITS File Header Block Parsing', () => {
    it('parseFITSHeaderBlock should be defined', () => {
      expect(parseFITSHeaderBlock).toBeDefined()
    })
  })

  describe('FITS File Header Row Parsing', () => {
    it('parseFITSHeaderRow should be defined', () => {
      expect(parseFITSHeaderRow).toBeDefined()
    })

    it('parseFITSHeaderRow should return the correct key, value and comment', () => {
      const { key, value, comment } = parseFITSHeaderRow(
        'SIMPLE  =                    T / file does conform to FITS standard'
      )

      expect(key).toBe('SIMPLE')
      expect(value).toBe(true)
      expect(comment).toBe('file does conform to FITS standard')
    })

    it('parseFITSHeaderRow should return the correct key, value and comment', () => {
      const { key, value, comment } = parseFITSHeaderRow(
        'BITPIX  =                    8 / number of bits per data pixel'
      )

      expect(key).toBe('BITPIX')
      expect(value).toBe(8)
      expect(comment).toBe('number of bits per data pixel')
    })

    it('parseFITSHeaderRow should return the correct key, value and comment', () => {
      const { key, value, comment } = parseFITSHeaderRow(
        'NAXIS   =                    0 / number of array dimensions or data axes'
      )

      expect(key).toBe('NAXIS')
      expect(value).toBe(0)
      expect(comment).toBe('number of array dimensions or data axes')
    })

    it('parseFITSHeaderRow should return the correct key, value and comment', () => {
      const { key, value, comment } = parseFITSHeaderRow('EXTEND  =                    T')

      expect(key).toBe('EXTEND')
      expect(value).toBe(true)
      expect(comment).toBe('')
    })

    it('parseFITSHeaderRow should return the correct key, value and comment', () => {
      const { key, value, comment } = parseFITSHeaderRow(
        "EPOCH   =             'Julian' / epoch of observation"
      )

      expect(key).toBe('EPOCH')
      expect(value).toBe('Julian')
      expect(comment).toBe('epoch of observation')
    })

    it('parseFITSHeaderRow should return the correct key, value and comment', () => {
      const { key, value, comment } = parseFITSHeaderRow('COMMENT An unspecified comment')

      expect(key).toBe('COMMENT')
      expect(value).toBe('An unspecified comment')
      expect(comment).toBe('An unspecified comment')
    })

    it('parseFITSHeaderRow should return the correct key, value and comment', () => {
      const { key, value, comment } = parseFITSHeaderRow('HISTORY An unspecified record')

      expect(key).toBe('HISTORY')
      expect(value).toBe('An unspecified record')
      expect(comment).toBe('An unspecified record')
    })
  })

  describe('FITS File Header Blocks Reading', () => {
    it('readFITSHeaderFromBlocks should be defined', () => {
      expect(readFITSHeaderFromBlocks).toBeDefined()
    })
  })
})
