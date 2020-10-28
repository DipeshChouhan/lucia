'use strict';
/**
 * @file fnv.ts
 * @copyright (c) 2020 the lucia project
 */
exports.__esModule = true;
var FNV_PRIME = 0x01000193;
var FNV_OFFSET_BASIS = 0x811c9dc5;
/**
 * This is a non cryptographic hashing algorithm DO NOT USE for security applications
 * @param val
 * @param variant1a
 */
function fnv_1(val, variant1a) {
  if (variant1a === void 0) {
    variant1a = false;
  }
  var hash = FNV_OFFSET_BASIS;
  if (!variant1a) {
    val.forEach(function (byte) {
      hash *= FNV_PRIME;
      hash ^= byte;
    });
  } else {
    val.forEach(function (byte) {
      hash ^= byte;
      hash *= FNV_PRIME;
    });
  }
  return hash;
}
exports['default'] = fnv_1;
