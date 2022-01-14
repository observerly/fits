export interface FITSBlock {
  /**
   *
   * ArrayBuffer of the block being read-in
   *
   */
  buffer: string | ArrayBuffer
  /**
   *
   *
   * Have we parsed the current block?
   *
   */
  parsed?: boolean
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
}
