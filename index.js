// gonogo simple object validator
'use strict'

const assert = (valid, message) => {
  if (!valid) {
    throw new Error(message)
  }
}

const run = (schema, target, prefix) => {
  assert(schema(target), `${prefix} ${schema._gngMessage || 'failed'}`)
}

const gng = module.exports = function gonogo (schema) {
  if (typeof schema === 'function') {
    return (target) => run(schema, target, `gng: value > ${target} <`)
  }

  assert(
    typeof schema === 'object',
    `gng: USAGE: expected function or object schema, found > ${schema} <`)

  const schemaKeys = Object.keys(schema)

  return (target) => schemaKeys.forEach((key) => {
    const value = target[key]
    const valueSchema = schema[key]

    run(valueSchema, value, `gng: field > ${key} <, value > ${value} <`)
  })
}

gng.pass = (schema) => (target) => schema(target)
gng.string = (target) => typeof target === 'string'
gng.number = (target) => typeof target === 'number'
gng.boolean = (target) => typeof target === 'boolean'
gng.func = (target) => typeof target === 'function'
gng.object = (target) => typeof target === 'object' && !gng.array(target)
gng.array = (target) => Array.isArray(target)

gng.string._gngMessage = 'is not a string'
gng.number._gngMessage = 'is not a number'
gng.boolean._gngMessage = 'is not a boolean'
gng.func._gngMessage = 'is not a function'
gng.object._gngMessage = 'is not an object'
gng.array._gngMessage = 'is not an array'
