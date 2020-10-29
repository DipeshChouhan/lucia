/**
 * @file fnv.ts
 * @copyright (c) 2020 The Lucia Authors
 */

const FNV_PRIME = 0x01000193;
const FNV_OFFSET_BASIS = 0x811c9dc5;

/**
 * This is a non cryptographic hashing algorithm DO NOT USE for security applications
 * @param val
 * @param variant1a
 */
export default function fnv_1(val: number[] | Uint8Array, variant1a: boolean = false): number {
  let hash = FNV_OFFSET_BASIS;
  if (!variant1a) {
    val.forEach((byte: number) => {
      hash *= FNV_PRIME;
      hash ^= byte;
    });
  } else {
    val.forEach((byte: number) => {
      hash ^= byte;
      hash *= FNV_PRIME;
    });
  }

  return hash;
}
