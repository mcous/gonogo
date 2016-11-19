'use strict'

const schemaToString = (schema) => {
  return Object.keys(schema).map((key) => `${key} -> ${schema[key]}`).join(', ')
}

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
    message: (test) => `that satisfies ${test}`,
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
    message: (schema) => `with the keys {${schemaToString(schema)}}`,
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
