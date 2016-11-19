// gonogo base
'use strict'

const is = require('./is')
const stringify = require('./stringify')

const assert = (ok, message) => {
  if (!ok) {
    throw new Error(`gng: ${message}`)
  }
}

const usage = (ok, expected, actual) => {
  assert(ok, `USAGE: expected ${expected}, found ${actual}`)
}

const run = (validator, value, prefix) => {
  if (!validator(value)) {
    return `${prefix} failed to satisfy ${validator}`
  }
}

module.exports = function gonogoBase (schema) {
  if (typeof schema === 'function') {
    return (value) => run(schema, value, `value ${stringify(value)}`)
  }

  usage(is.object(schema), 'schema to be a function or object', schema)

  const schemaKeys = Object.keys(schema)

  return (target) => schemaKeys.map((key) => {
    const value = target[key]
    const valueSchema = schema[key]

    usage(is.function(valueSchema), `schema.${key} to be a function`, valueSchema)

    return run(valueSchema, value, `"${key}" -> ${stringify(value)}`)
  }).filter(Boolean).join('; ')
}
