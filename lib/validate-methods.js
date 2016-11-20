'use strict'

const stringify = require('./stringify')

module.exports = {
  optional: {
    name: 'optional',
    message: 'or undefined',
    shortCircuit: true,
    test: (value) => typeof value === 'undefined'
  },

  nullable: {
    name: 'nullable',
    message: 'or null',
    shortCircuit: true,
    test: (value) => value === null
  },

  and: {
    name: 'and',
    thunk: true,
    message: (test) => `and satisfy ${test}`,
    test: (value, test) => test(value)
  },

  or: {
    name: 'or',
    thunk: true,
    shortCircuit: true,
    message: (test) => `or satisfy ${test}`,
    test: (value, test) => test(value)
  },

  not: {
    name: 'not',
    thunk: true,
    message: (test) => `that is not ${test}`,
    test: (value, test) => !test(value)
  },

  values: {
    name: 'values',
    thunk: true,
    message: (acceptable) => `that equals one of ${stringify(acceptable)}`,
    test: (value, acceptable) => acceptable.some((candidate) => value === candidate)
  },

  lengthOf: {
    name: 'lengthOf',
    thunk: true,
    message: (length) => `with length ${length}`,
    test: (value, length) => value.length === length
  },

  keys: {
    name: 'keys',
    thunk: true,
    message: (schema) => `with the keys {${stringify(schema)}}`,
    test: (value, schema) => Object.keys(schema).every((key) => schema[key](value[key]))
  },

  items: {
    name: 'items',
    thunk: true,
    message: (validateItem) => `with items that satisfy ${validateItem}`,
    test: (value, validateItem) => value.every(validateItem)
  },

  match: {
    name: 'match',
    thunk: true,
    message: (expected) => `that matches ${expected}`,
    test: (value, expected) => new RegExp(expected).test(value)
  }
}
