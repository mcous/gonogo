// main test suite
'use strict'

const assert = require('assert')
const describe = require('mocha').describe
const it = require('mocha').it
const gng = require('../')

describe('gonogo', function () {
  it('should not throw if a target passes a validation function', function () {
    const schema = () => true
    const validate = gng(schema)

    validate(null)
  })

  it('should throw if a target does not pass a validation function', function () {
    const schema = () => false
    const validate = gng(schema)

    assert.throws(() => validate(null), /value > null < failed validation function/)
  })
})
