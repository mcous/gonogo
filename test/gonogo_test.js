// main test suite
'use strict'

const assert = require('assert')
const gng = require('../')

suite('gonogo', function () {
  const isPass = (value) => value === 'pass'
  const isFail = (value) => value === 'fail'
  const isFoo = (value) => value === 'foo'

  isFoo.toString = () => '[the value "foo"]'

  test('throws if schema is not a function nor object', function () {
    assert.throws(() => gng(1), /expected.+function or object/)
    assert.throws(() => gng(false), /expected.+function or object/)
    assert.throws(() => gng(''), /expected.+function or object/)
  })

  test('does not throw if value passes validation function', function () {
    const schema = isPass
    const validate = gng(schema)

    validate('pass')
  })

  test('throws if value does not pass validation function', function () {
    const schema = isFail
    const validate = gng(schema)
    const run = () => validate('pass')

    assert.throws(run, /value "pass" failed/)
  })

  test('does not throw if keys of object pass validation functions', function () {
    const schema = {foo: isPass, bar: isPass, baz: isPass}
    const validate = gng(schema)

    validate({foo: 'pass', bar: 'pass', baz: 'pass'})
  })

  test('throws if any key of object fails validation function', function () {
    const schema = {foo: isPass, bar: isFail, baz: isPass}
    const validate = gng(schema)
    const run = () => validate({foo: 'pass', bar: 'pass', baz: 'pass'})

    assert.throws(run, /"bar" -> "pass" failed/)
  })

  test('calls toString of validation function for error message', function () {
    const schema = isFoo
    const validate = gng(schema)
    const run = () => validate('bar')

    assert.throws(run, /\[the value "foo"\]/)
  })

  test('calls toString of validation function of key for error', function () {
    const schema = {foo: isFoo}
    const validate = gng(schema)
    const run = () => validate({foo: 'bar'})

    assert.throws(run, /\[the value "foo"\]/)
  })
})
