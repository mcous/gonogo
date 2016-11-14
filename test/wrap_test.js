// function wraper test
'use strict'

const assert = require('assert')
const describe = require('mocha').describe
const beforeEach = require('mocha').beforeEach
const it = require('mocha').it
const td = require('testdouble')

const gng = require('../')
const wrap = require('../wrap')

describe('gonogo/wrap', function () {
  beforeEach(function () {
    td.reset()
  })

  it('should pass target to the wrapped function if it passes validation', function () {
    const schema = {foo: gng.string}
    const component = td.function('.wrapped')
    const wrapped = wrap(schema, component)

    wrapped({foo: 'bar'})
    td.verify(component({foo: 'bar'}))
  })

  it('should pass throw if it fails validation', function () {
    const schema = {foo: gng.string}
    const component = td.function('.wrapped')
    const wrapped = wrap(schema, component)

    assert.throws(() => wrapped({foo: 42}))
    td.verify(component(), {times: 0, ignoreExtraArgs: true})
  })
})
