import { strict as assert } from 'assert'
import { inspect } from 'util'

function * part1 (data, config) {
  const { showIntermediate } = config
  const direction = expected => ([dir]) => dir === expected
  const total = (arr) => arr.reduce((total, cur) => total + cur[1], 0)
  const totalForward = total(data.filter(direction('forward')))
  const totalUp = total(data.filter(direction('up')))
  const totalDown = total(data.filter(direction('down')))
  const result = {
    depth: totalDown - totalUp,
    breadth: totalForward
  }
  yield inspect(result)
  yield `Multiplied: ${result.breadth * result.depth}`
}

function * part2 (data, config) {
  const { showIntermediate } = config
  const total = (arr) => arr.reduce((obj, [breadth, depth]) => {
    obj.breadth = obj.breadth + breadth
    obj.depth = obj.depth + depth
    return obj
  }, { depth: 0, breadth: 0 })
  const movement = []
  data.reduce((aim, [dir, step]) => {
    if (dir === 'up') aim = aim - step
    if (dir === 'down') aim = aim + step
    if (dir === 'forward') {
      movement.push([step, aim * step]) // [breadth, depth]
    }
    return aim
  }, 0)
  yield inspect(movement)
  const result = total(movement)
  yield inspect(result)
  yield `Multiplied: ${result.breadth * result.depth}`
}

function interpret (input) {
  return input.map(el => {
    const directions = el.split(' ')
    return [directions[0], parseInt(directions[1])]
  })
}

export default function * pickPart (input, config) {
  assert(
    Array.isArray(input) && input.length > 0,
    'Must provide data as array of strings, use options "-t array"'
  )
  const { part } = config
  assert(part <= 2, 'Valid parts are 1 or 2')
  const data = interpret(input)
  if (config.showIntermediate) yield data.join('\n')
  if (part === 2) {
    for (const result of part2(data, config)) yield result
  } else {
    for (const result of part1(data, config)) yield result
  }
}
