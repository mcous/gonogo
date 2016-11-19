// function wraper test
'use strict'

const assert = require('assert')
const suite = require('mocha').suite
const beforeEach = require('mocha').beforeEach
const test = require('mocha').test
const td = require('testdouble')

const gng = require('../')
const wrap = require('../wrap')

suite('gonogo/wrap', function () {
  beforeEach(function () {
    td.reset()
  })

  test('calls wrapped function if target passes validation', function () {
    const schema = {foo: gng.string}
    const component = td.function('.wrapped')
    const wrapped = wrap(schema, component)

    wrapped({foo: 'bar'})
    td.verify(component({foo: 'bar'}))
  })

  test('throws and does not call function if target fails', function () {
    const schema = {foo: gng.string}
    const component = td.function('.wrapped')
    const wrapped = wrap(schema, component)

    assert.throws(() => wrapped({foo: 42}))
    td.verify(component(), {times: 0, ignoreExtraArgs: true})
  })
})
