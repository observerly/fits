import { B, I, J } from '../dataunit'

export const swopEndian = (bitpix: number): ((value: number) => number) => {
  switch (bitpix) {
    case 16:
      return I

    case 32:
      return J
  }

  return B
}
