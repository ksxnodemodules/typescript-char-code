#! /usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const iter = require('iter-tools')

const mkstr = x => JSON.stringify(String(x))
const codestr = x => mkstr(String.fromCharCode(x))
const union = iterable => Array.from(iterable).join(' | ')
const declare = (name, definition) => `export type ${name} = ${definition};`

const ascii = Array.from(iter.range(255))
const lowerCaseAlphabetCodes = iter.range({ start: 'a'.charCodeAt(), end: 'z'.charCodeAt() + 1 })
const upperCaseAlphabetCodes = iter.range({ start: 'A'.charCodeAt(), end: 'Z'.charCodeAt() + 1 })

const Digit = union(iter.range({ start: 0, end: 10 }))
const Byte = union(iter.range({ start: -128, end: 128 }))
const SignedByte = 'Byte'
const UnsignedByte = union(ascii)
const AsciiNumber = 'UnsignedByte'
const AsciiCharacter = union(iter.map(codestr, ascii))
const LowerCaseAlphabet = union(iter.map(codestr, lowerCaseAlphabetCodes))
const UpperCaseAlphabet = union(iter.map(codestr, upperCaseAlphabetCodes))

const code = Object.entries({
  Digit,
  Byte,
  SignedByte,
  UnsignedByte,
  AsciiNumber,
  AsciiCharacter,
  LowerCaseAlphabet,
  UpperCaseAlphabet
})
  .map(([name, definition]) => declare(name, definition))
  .join('\n')

fs.writeFileSync(
  path.join(__dirname, 'index.d.ts'),
  code + '\n'
)
