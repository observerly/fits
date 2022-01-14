/**
 *
 * readBlockAsArrayBuffer()
 *
 * @description asynchronously reads a file slice as an ArrayBuffer
 * and onloadend will pass the ArrayBuffer result to a callback function.
 *
 * @param block represents a File or File.slice
 * @param callback function callback to be called onloadend passing
 * @returns a Promise which resolves the callback of the callback function provided
 */
export const readBlockAsArrayBuffer = async (
  block: Blob,
  callback: (result: ArrayBuffer) => { s: string; end: boolean; parsed: boolean }
): Promise<{ s: string; end: boolean; parsed: boolean }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onloadend = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result && e.target.result instanceof ArrayBuffer) {
        resolve(callback(e.target.result))
      }

      resolve({
        s: '',
        end: false,
        parsed: false
      })
    }

    reader.onerror = reject

    reader.readAsArrayBuffer(block)
  })
}
