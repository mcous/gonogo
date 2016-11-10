// gonogo simple object validator
'use strict'

const assert = require('assert')

module.exports = function gonogo (schema) {
  if (typeof schema === 'function') {
    return (target) => {
      assert(schema(target), `gonogo: value > ${target} < failed validation function`)
    }
  }

  assert(
    typeof schema === 'object',
    `gonogo: USAGE: expected function or object schema, found > ${schema} <`)

  const schemaKeys = Object.keys(schema)

  return (target) => schemaKeys.forEach((key) => {
    assert(schema[key](target[key]), `gonogo: field '${key}' failed validation function`)
  })
}
