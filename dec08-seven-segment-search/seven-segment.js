
export default class SevenSegment {
  constructor (input) {
    this.training = input.training
    this.readout = input.readout
  }

  static properSegments = [
    'abcefg',   // '0'
    'cf',       // '1'
    'acdeg',    // '2'
    'acdfg',    // '3'
    'bcdf',     // '4'
    'abdfg',    // '5'
    'abdefg',   // '6'
    'acf',      // '7'
    'abcdefg',  // '8'
    'abcdfg'    // '9'
  ]

  static parseLine (line) {
    const normalizeDigitStr = digitStr => digitStr.trim().split('').sort().join('')
    const [trainingStr, readoutStr] = line.split('|')
    const training = trainingStr
      .split(/\s+/)
      .filter((el = '') => Boolean(el.trim()))
      .map(normalizeDigitStr)
    const readout = readoutStr
      .split(/\s+/)
      .filter((el = '') => Boolean(el.trim()))
      .map(normalizeDigitStr)
    return new SevenSegment({ training, readout })
  }
}