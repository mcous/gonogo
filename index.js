// gonogo simple object validator
'use strict'

const assert = require('./lib/assert')
const is = require('./lib/is')
const validate = require('./lib/validate')

const run = (schema, target, prefix) => {
  const message = 'message' in schema
    ? `${prefix}; expected ${schema.message}`
    : prefix

  assert(schema(target), message)
}

const gng = function gonogo (schema) {
  if (typeof schema === 'function') {
    return (target) => run(schema, target, `value > ${target} < failed`)
  }

  assert(is.object(schema), `USAGE: expected function or object, found > ${schema} <`)

  const schemaKeys = Object.keys(schema)

  return (target) => schemaKeys.forEach((key) => {
    const value = target[key]
    const valueSchema = schema[key]

    run(valueSchema, value, `field > ${key} <, value > ${value} < failed`)
  })
}

module.exports = Object.assign(gng, validate)
