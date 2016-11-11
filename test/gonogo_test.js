// main test suite
'use strict'

const assert = require('assert')
const describe = require('mocha').describe
const it = require('mocha').it

const gng = require('../')

describe('gonogo', function () {
  const pass = (value) => value === 'pass'
  const fail = (value) => value !== 'pass'

  it('should throw if the schema is not a function nor object', function () {
    assert.throws(() => gng(1), /expected function or object schema/)
    assert.throws(() => gng(false), /expected function or object schema/)
    assert.throws(() => gng(''), /expected function or object schema/)
  })

  it('should not throw if a target passes a validation function', function () {
    const schema = pass
    const validate = gng(schema)

    validate('pass')
  })

  it('should throw if a target does not pass a validation function', function () {
    const schema = fail
    const validate = gng(schema)

    assert.throws(
      () => validate('pass'),
      /value > pass < failed/)
  })

  it('should not throw if a target passes validation functions for all its keys', function () {
    const schema = {foo: pass, bar: pass, baz: pass}
    const validate = gng(schema)

    validate({foo: 'pass', bar: 'pass', baz: 'pass'})
  })

  it('should throw if a target fails validation functions for any of its keys', function () {
    const schema = {foo: pass, bar: fail, baz: pass}
    const validate = gng(schema)

    assert.throws(
      () => validate({foo: 'pass', bar: 'pass', baz: 'pass'}),
      /field > bar <, value > pass < failed/)
  })
})
