#! /usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const iter = require('iter-tools')

const mkstr = x => JSON.stringify(String(x))
const codestr = x => mkstr(String.fromCharCode(x))
const dclfn = (name, param, ret) => `export declare function ${name} (x: ${param}): ${ret}`
const docstr = (fn, comments) => ['/**', ...comments.map(x => ' * ' + x), ' */', fn].join('\n')

const ascii = Array.from(iter.range(255))

const pairs = ascii
  .map(code => ({ code, char: codestr(code) }))
  .concat({ code: 'number', char: 'string' })

const fnOrd = pairs
  .map(({ code, char }) => dclfn('ord', char, code))
  .join('\n')

const fnChr = pairs
  .map(({ code, char }) => dclfn('chr', code, char))
  .join('\n')

const code = [
  docstr(fnOrd, [
    'Return the Unicode code point for one-character string',
    '@param {string} x A one-character string',
    '@returns {number} Code point of `x`'
  ]),

  docstr(fnChr, [
    'Return a Unicode string of one character with ordinal `x`',
    '@param {number} x An ordinal number between `0` and `0x10FFFF`',
    '@returns {string} A string of one character with ordinal `x`'
  ])
].join('\n\n')

fs.writeFileSync(
  path.join(__dirname, 'index.d.ts'),
  code + '\n'
)
