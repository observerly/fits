# @observerly/fits

## Introduction

🌌 fits is observerly's lightweight (~1.9 KB min+gzip), zero-dependency\*, type safe FITS image library written in TypeScript. It is aimed to be a modern and simple tool to use in the browser, for reading the FITS file format according to the 4th version of the [FITS specification](./docs/fits/standard/).

The key tenants of the library is to use as JavaScript primatives, where we do not rely on, or enforce reliance on, any third-party related libraries. This is to ensure that the library can be used in any environment, and that the user can supplement usage with their own datetime libraries of choice, if required.

The final output image is a 2D array of pixel values, which can be used to render the image in a canvas, or any other image rendering library of choice. The final output image pixel values is a ZScaleInterval of the original pixel values, returned as a Float32Array.

The library makes no opinion of what you can do with the resulting image data, and is designed to be as flexible as possible to allow the user to use the data in any way they see fit, whether that be rendering the image, or processing the data in some other way. However, it is more than possible to convert the values to an RGBA Uint8ClampedArray for use with the HTMLCanvasElement, the [Canvas_API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) or any other image rendering library of choice.
 
### Installation

You can install fits using your favorite package manager:

```bash
npm install @observerly/fits
```

or

```bash
yarn add @observerly/fits
```

```bash
pnpm add @observerly/fits
```

```bash
bun add @observerly/fits
```

### Documentation

TBD

### Usage

The two below examples demonstrate how to load a FITS file from a local file or a URL, respectively, in a browser environment.

#### Load from Local File

```ts
import { FITS } from '@observerly/fits'

const fileInput = document.getElementById('fitsFileInput')

fileInput.addEventListener('change', async (event) => {
  const file = (event.target as HTMLInputElement).files[0]

  const buffer = await file.arrayBuffer()

  const fits = await new FITS().readFromBuffer(buffer)

  const headers = fits.getHeaders()

  const image = fits.getImageHDU() // of type Float32Array
})
```

#### Load from URL

```ts
import { FITS } from '@observerly/fits'

const url = `fits.observerly.com/Rosetta_Nebula_[Ha]_Monochrome_M_300s_2024-11-26T17_20_00Z`

const response = await fetch(url)

if (!response.ok) {
  throw new Error(`HTTP error! Status: ${response.status}`)
}

const buffer = await response.arrayBuffer()

const fits = await new FITS().readFromBuffer(buffer)

const headers = fits.getHeaders()

const image = fits.getImageHDU() // of type Float32Array
```

#### 2D CanvasHTMLElement Rendering

```ts
// ... load FITS file as above

const image = fits.getImageHDU() // of type Float32Array

const canvas = document.createElement('canvas')

canvas.width = fits.getHeader('NAXIS1')

canvas.height = fits.getHeader('NAXIS2')

const ctx = canvas.getContext('2d')

const imageData = ctx.createImageData(canvas.width, canvas.height)

const data = imageData.data

for (let i = 0; i < image.length; i++) {
  const value = image[i]
  data[i * 4] = value
  data[i * 4 + 1] = value
  data[i * 4 + 2] = value
  data[i * 4 + 3] = 255
}

ctx.putImageData(imageData, 0, 0)
```

## Miscellany

\*It is dependency-free to ensure it can be used safely within both node, deno, bun and browser environments.

## License

@observerly/FITS is licensed under the MIT license. See [MIT](./LICENSE) for details.