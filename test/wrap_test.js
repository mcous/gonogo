// function wraper test
'use strict'

const assert = require('assert')
const td = require('testdouble')
const gng = require('../')
const wrap = require('../wrap')

suite('gonogo/wrap', function () {
  test('calls wrapped function if target passes validation', function () {
    td.reset()

    const schema = {foo: gng.string}
    const contents = td.function('.wrapped')
    const wrapped = wrap(schema, contents)

    wrapped({foo: 'bar'})
    td.verify(contents({foo: 'bar'}))
  })

  test('throws and does not call function if target fails', function () {
    td.reset()

    const schema = {foo: gng.string}
    const contents = td.function('.wrapped')
    const wrapped = wrap(schema, contents)

    assert.throws(() => wrapped({foo: 42}), /"foo" -> 42.+a string/)
    td.verify(contents(), {times: 0, ignoreExtraArgs: true})
  })

  test('passes many arguments to the function', function () {
    td.reset()

    const contents = td.function('.wrapped')
    const wrapped = wrap(gng.string, gng.number, gng.boolean, contents)

    wrapped('foo', 42, false)
    td.verify(contents('foo', 42, false))
  })

  test('throws if one of many arguments to the function fails', function () {
    td.reset()

    const contents = td.function('.wrapped')
    const wrapped = wrap(gng.string, gng.number, gng.boolean, contents)

    assert.throws(() => wrapped('foo', 42, 'bar'), /"bar".+a boolean/)
    td.verify(contents(), {times: 0, ignoreExtraArgs: true})
  })
})
