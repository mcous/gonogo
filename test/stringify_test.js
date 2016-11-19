'use strict'

const assert = require('assert')
const stringify = require('../lib/stringify')

suite('stringify', function () {
  test('primitives', function () {
    assert(stringify(42) === '42')
    assert(stringify(false) === 'false')
    assert(stringify('foo') === '"foo"')
  })

  test('functions', function () {
    const fn = () => 'foo'

    assert.equal(stringify(fn), fn.toString())
  })

  test('arrays', function () {
    const arr = [
      42,
      false,
      'foo',
      () => 'bar'
    ]

    assert.equal(stringify(arr), `[${42}, false, "foo", ${arr[3]}]`)
  })

  test('objects', function () {
    const obj = {
      foo: 'bar',
      baz: () => 'bar'
    }

    assert.equal(stringify(obj), `{"foo": "bar", "baz": ${obj.baz}}`)
  })

  test('circular objects', function () {
    const obj = {foo: 'bar'}

    obj.baz = {quux: obj}

    assert.equal(stringify(obj), '{"foo": "bar", "baz": {"quux": ~circular~}}')
  })

  test('circular arrays', function () {
    const arr = ['foo']

    arr.push(arr)

    assert.equal(stringify(arr), '["foo", ~circular~]')
  })

  test('circular objects and arrays and functions', function () {
    const obj = {foo: 'bar'}
    const arr = ['baz']
    const fn = () => 'quux'

    arr.push(fn, obj)
    obj.fn = fn
    obj.arr = arr

    assert.equal(stringify(obj), `{"foo": "bar", "fn": ${fn}, "arr": ["baz", ~circular~, ~circular~]}`)
  })
})
