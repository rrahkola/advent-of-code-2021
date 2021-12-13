import { strict as assert } from 'assert'
import { inspect } from 'util'
import Chunk from './chunk.js'

const CLOSERS = {
  '(': ')',
  '{': '}',
  '[': ']',
  '<': '>'
}

const SCORES = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137
}

function * part1 (data, config) {
  const { showIntermediate } = config
  if (showIntermediate) yield inspect(data.transformed)
  const corrupted = []
  for (const line of data.transformed) {
    const match = line.match(/(\)|\]|\}|\>)/)
    if (match) corrupted.push(match)
  }
  if (showIntermediate) yield inspect(corrupted)
  const syntaxScore = corrupted
    .map(match => SCORES[match[0]])
    .reduce((sum, el) => sum + el, 0)
  yield `Syntax Score: ${syntaxScore}`
}


function removePairs (str = '') {
  const pairsRegex = /(\(\)|\[\]|\{\}|\<\>)/g
  let copy = str
  let next = copy.replace(pairsRegex, '')
  while (next && copy !== next) {
    copy = next
    next = copy.replace(pairsRegex, '')
    // console.log({ copy, next }, 'iterating')
  }
  return next
}

function interpret (input) {
  const original = input
  // const parsed = input.map(line => Chunk.parseString(line))
  const transformed = original.map(removePairs)
  return { original, transformed }
}

export default function * pickPart (input, config) {
  assert(
    Array.isArray(input) && input.length > 0,
    'Must provide data as array of strings, use options "-t lines"'
  )
  const { part } = config
  assert(part <= 2, 'Valid parts are 1 or 2')
  const data = interpret(input)
  if (config.showIntermediate) yield inspect(data)
  if (part === 2) {
    for (const result of part1(data, config)) yield result
  } else {
    for (const result of part1(data, config)) yield result
  }
}
