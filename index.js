// gonogo simple object validator
'use strict'

const base = require('./lib/base')
const validate = require('./lib/validate')

const gng = function gonogo (schema) {
  const validate = base(schema)

  return (value) => {
    const message = validate(value)

    if (message) {
      throw new Error(`gng: ${message}`)
    }
  }
}

module.exports = Object.assign(gng, validate)
