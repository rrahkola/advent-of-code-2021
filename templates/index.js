import { strict as assert } from 'assert'

function * part1 (data, config) {
  const { showIntermediate } = config
  yield 'Howdy'
}

function interpret (input) { return input }

export default function * pickPart (input, config) {
  assert(
    Array.isArray(input) && input.length > 0,
    'Must provide data as array of strings, use options "-t array"'
  )
  const { part } = config
  assert(part <= 2, 'Valid parts are 1 or 2')
  const data = part === 2 ? interpret(input) : input
  if (config.showIntermediate) yield data.join('\n')
  for (const result of part1(data, config)) yield result
}
