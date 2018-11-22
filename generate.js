#! /usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const iter = require('iter-tools')

const mkstr = x => JSON.stringify(String(x))
const codestr = x => mkstr(String.fromCharCode(x))
const dclfn = (name, param, ret) => `export declare function ${name} (x: ${param}): ${ret}`
const docstr = comments => ['/**', ...comments.map(x => ' * ' + x), ' */'].join('\n')

const ascii = Array.from(iter.range(1 << 8))

const pairs = ascii
  .map(code => ({ code, char: codestr(code) }))
  .concat({ code: 'number', char: 'string' })

const docOrd = docstr([
  'Return the Unicode code point for one-character string',
  '@param {string} x A one-character string',
  '@returns {number} Code point of `x`'
])

const fnOrd = pairs
  .map(({ code, char }) => dclfn('ord', char, code))
  .map(fn => docOrd + '\n' + fn)
  .join('\n')

const docChr = docstr([
  'Return a Unicode string of one character with ordinal `x`',
  '@param {number} x An ordinal number between `0` and `0x10FFFF`',
  '@returns {string} A string of one character with ordinal `x`'
])

const fnChr = pairs
  .map(({ code, char }) => dclfn('chr', code, char))
  .map(fn => docChr + '\n' + fn)
  .join('\n')

const code = [fnChr, fnOrd].join('\n\n')

fs.writeFileSync(
  path.join(__dirname, 'index.d.ts'),
  code + '\n'
)
