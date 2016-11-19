'use strict'

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

  pass: {
    name: 'pass',
    thunk: true,
    message: (test) => `that passes "${test.toString()}"`,
    test: (value, test) => test(value)
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
    message: (schema) => `with the keys [${Object.keys(schema).join(', ')}]`,
    test: (value, schema) => Object.keys(schema).every((key) => schema[key](value[key]))
  },

  items: {
    name: 'items',
    thunk: true,
    message: (validateItem) => `with items that pass "${validateItem.toString()}"`,
    test: (value, validateItem) => value.every(validateItem)
  },

  match: {
    name: 'match',
    thunk: true,
    message: (expected) => `that matches ${expected}`,
    test: (value, expected) => new RegExp(expected).test(value)
  }
}
