export interface FITSBlock {
  /**
   *
   * Some offset value giving the offset start in bytes of the current block
   *
   */
  offsetStart: number
  /**
   *
   * Some offset value giving the offset end in bytes of the current block
   *
   */
  offsetEnd: number
  /**
   *
   * ArrayBuffer of the block being read-in
   *
   */
  buffer: string | ArrayBuffer
}
