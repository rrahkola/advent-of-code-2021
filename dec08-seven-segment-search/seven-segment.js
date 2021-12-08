import isEqual from 'lodash/isEqual.js'
export default class SevenSegment {
  static allMappings = []

  constructor (input) {
    this.training = input.training
    this.readout = input.readout
    if (SevenSegment.allMappings.length === 0)
      permutation(SevenSegment.allMappings, 'abcdefg'.split(''), 7)
  }

  static properSegments = [
    'abcefg', // '0'
    'cf', // '1'
    'acdeg', // '2'
    'acdfg', // '3'
    'bcdf', // '4'
    'abdfg', // '5'
    'abdefg', // '6'
    'acf', // '7'
    'abcdefg', // '8'
    'abcdfg' // '9'
  ]

  static parseLine (line) {
    const normalizeDigitStr = digitStr =>
      digitStr
        .trim()
        .split('')
        .sort()
        .join('')
    const [trainingStr, readoutStr] = line.split('|')
    const training = trainingStr
      .split(/\s+/)
      .filter((el = '') => Boolean(el.trim()))
      .map(normalizeDigitStr)
      .sort((el1, el2) => el1.length - el2.length)
    const readout = readoutStr
      .split(/\s+/)
      .filter((el = '') => Boolean(el.trim()))
      .map(normalizeDigitStr)
    return new SevenSegment({ training, readout })
  }

  train () {
    if (this.trained) return
    this.mapSegments = () => 'cf'
    const { training } = this
    const sortedProperSegments = [...SevenSegment.properSegments].sort()
    for (const mapping of SevenSegment.allMappings) {
      const mapSegments = segs => segs.split('').map(char => mapping['abcdefg'.indexOf(char)]).sort().join('')
      const converted = training.map(mapSegments).sort()
      if (isEqual(converted, sortedProperSegments)) {
        this.mapSegments = mapSegments
        break
      }
    }
    this.trained = true
  }

  convertReadout () {
    this.train()
    const { readout, mapSegments } = this
    const display = readout
      .map(mapSegments)
      .map(segments => SevenSegment.properSegments.indexOf(segments))
    return parseInt(display.join(''))
  }
}

// cf. https://stackoverflow.com/questions/66108781/finding-all-permutations-of-array-elements-as-concatenated-strings
export function permutation (result, arr, currentSize) {
  if (currentSize == 1) {
    // recursion base-case (end)
    result.push(arr.join(''))
    return result
  }

  for (let i = 0; i < currentSize; i++) {
    permutation(result, arr, currentSize - 1)
    if (currentSize % 2 == 1) {
      let temp = arr[0]
      arr[0] = arr[currentSize - 1]
      arr[currentSize - 1] = temp
    } else {
      let temp = arr[i]
      arr[i] = arr[currentSize - 1]
      arr[currentSize - 1] = temp
    }
  }
}
