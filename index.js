// gonogo simple object validator
'use strict'

const assert = require('assert')

module.exports = function gonogo (schema) {
  return (target) => assert(schema(target), `value > ${target} < failed validation function`)
}
