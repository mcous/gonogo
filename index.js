// gonogo simple object validator
'use strict'

const assign = require('object-assign')
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

module.exports = assign(gng, validate)
