import { strict as assert } from 'assert'
import { inspect } from 'util'
import sortBy from 'lodash/sortBy.js'
import sum from 'lodash/sum.js'
import range from 'lodash/range.js'

function * crabFuel (data, config) {
  const { showIntermediate } = config
  const attempts = range(
    Math.min(data.median, data.mean, ...data.modes),
    Math.max(data.median, data.mean, ...data.modes) + .5
  )
  const totalCost = {}
  for (const goal of attempts) {
    const cost = data.positions.map(pos => Math.abs(pos - goal))
    totalCost[goal] = sum(cost)
    if (showIntermediate) yield inspect({ goal, cost, totalCost })
  }
  yield `Calculated fuel: ${inspect(totalCost)}`
}

function characterize (positions) {
  const centerIdx = Math.floor(positions.length / 2) - 1
  const sorted = sortBy(positions)
  const mean = Math.round(sum(positions) / positions.length)
  const median = sorted[centerIdx]
  const modes = mode(sorted)
  console.log({ mean, median, modes })
  return { mean, median, modes }
}

function mode (sorted) {
  let maxFrequency = 0
  const frequencies = []
  sorted.reduce(
    ([count, val], cur) => {
      if (val === cur) return [count + 1, val]
      else {
        maxFrequency = Math.max(maxFrequency, count)
        if (frequencies[count]) frequencies[count].push(val)
        else frequencies[count] = [val]
        return [1, cur]
      }
    },
    [0, -Infinity]
  )
  return frequencies.pop()
}

function interpret (input) {
  const positions = input[0].split(/\s*,\s*/).map(el => parseInt(el))
  const { mean, median, modes } = characterize(positions)
  return { positions, mean, median, modes }
}

export default function * pickPart (input, config) {
  assert(
    Array.isArray(input) &&
      input.length > 0 &&
      (typeof input[0] === 'string' || input[0] instanceof String),
    'Must provide data as array of strings, use options "-t lines"'
  )
  const { part } = config
  assert(part <= 2, 'Valid parts are 1 or 2')
  const data = interpret(input)
  if (config.showIntermediate) yield inspect(data)
  if (part === 2) {
    for (const result of crabFuel(data, config)) yield result
  } else {
    for (const result of crabFuel(data, config)) yield result
  }
}
