import { strict as assert } from 'assert'
import { inspect } from 'util'

class Cave {
  constructor (name, links = []) {
    this.name = name
    this.links = links
  }

  link (newLink) {
    const { name, links: existing } = this
    const currentLinks = [name].concat(existing.map(el => el.name))
    if (!currentLinks.includes(newLink.name)) existing.push(newLink)
  }

  explore (path) {
    return this.links
  }
}

function * visitSmallCavesAtMostOnce (data, config) {
  const { showIntermediate } = config
  const paths = config.explore(data.start)
  const routes = paths
    .filter(path => path.slice(-1)[0].name === 'end')
    .map(path => path.map(el => el.name).join(','))
  if (showIntermediate) yield inspect(routes)
  yield `Number of paths: ${routes.length}`
}

function exploreSmallCavesOnce (cave, path = []) {
  const paths = []
  const caveVisits = path.map(el => el.name)
  if (cave.name === 'end') return [[...path, cave]]
  for (const next of cave.explore()) {
    if (cave.name === cave.name.toLowerCase() && caveVisits.includes(cave.name)) return []
    paths.push(...exploreSmallCavesOnce(next, [...path, cave]))
  }
  return paths
}

function interpret (input) {
  const caves = {}
  for (const link of input) {
    const [name1, name2] = link.split('-')
    const cave1 = (caves[name1]) ? caves[name1] : new Cave(name1)
    const cave2 = (caves[name2]) ? caves[name2] : new Cave(name2)
    cave1.link(cave2)
    cave2.link(cave1)
    caves[name1] = cave1
    caves[name2] = cave2
  }
  assert(Boolean(caves.start), 'start cave is not defined')
  assert(Boolean(caves.end, 'end cave is not defined'))
  return caves
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
    for (const result of visitSmallCavesAtMostOnce(data, config)) yield result
  } else {
    config.explore = exploreSmallCavesOnce
    for (const result of visitSmallCavesAtMostOnce(data, config)) yield result
  }
}
