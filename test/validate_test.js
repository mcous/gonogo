'use strict'

const assert = require('assert')
const validate = require('../lib/validate')

const EXAMPLE_STRING = 'foo'
const EXAMPLE_NUMBER = 42
const EXAMPLE_BOOLEAN = false
const EXAMPLE_OBJECT = {foo: 'bar'}
const EXAMPLE_ARRAY = ['foo', 'bar', 'baz']
const EXAMPLE_FUNCTION = () => 'foo'
const EXAMPLE_NULL = null
const EXAMPLE_UNDEFINED = undefined

const isFoo = (value) => value === 'foo'
const isBar = (value) => value === 'bar'
const is42 = (value) => value === 42
const isTrue = (value) => value === true
const hasArity2 = (fn) => fn.length === 2
const has3Keys = (obj) => Object.keys(obj).length === 3
const startsWithFoo = (arr) => arr[0] === 'foo'

suite('validate', function () {
  suite('any', function () {
    test('any', function () {
      assert(validate.any(EXAMPLE_STRING) === true)
      assert(validate.any(EXAMPLE_NUMBER) === true)
      assert(validate.any(EXAMPLE_BOOLEAN) === true)
      assert(validate.any(EXAMPLE_OBJECT) === true)
      assert(validate.any(EXAMPLE_ARRAY) === true)
      assert(validate.any(EXAMPLE_FUNCTION) === true)
      assert(validate.any(EXAMPLE_NULL) === false)
      assert(validate.any(EXAMPLE_UNDEFINED) === false)
    })

    test('any - optional and nullable', function () {
      assert(validate.any.optional(EXAMPLE_STRING) === true)
      assert(validate.any.optional(EXAMPLE_NULL) === false)
      assert(validate.any.optional(EXAMPLE_UNDEFINED) === true)

      assert(validate.any.nullable(EXAMPLE_STRING) === true)
      assert(validate.any.nullable(EXAMPLE_NULL) === true)
      assert(validate.any.nullable(EXAMPLE_UNDEFINED) === false)

      assert(validate.any.optional.nullable(EXAMPLE_STRING) === true)
      assert(validate.any.optional.nullable(EXAMPLE_NULL) === true)
      assert(validate.any.optional.nullable(EXAMPLE_UNDEFINED) === true)
    })

    test('any - pass', function () {
      assert(validate.any.pass(isFoo)('foo') === true)
      assert(validate.any.pass(isFoo)('bar') === false)
      assert(validate.any.pass(isFoo).optional(undefined) === true)
      assert(validate.any.pass(isFoo).nullable(null) === true)
    })
  })

  suite('string', function () {
    test('string', function () {
      assert(validate.string(EXAMPLE_STRING) === true)
      assert(validate.string(EXAMPLE_NUMBER) === false)
      assert(validate.string(EXAMPLE_BOOLEAN) === false)
      assert(validate.string(EXAMPLE_OBJECT) === false)
      assert(validate.string(EXAMPLE_ARRAY) === false)
      assert(validate.string(EXAMPLE_FUNCTION) === false)
      assert(validate.string(EXAMPLE_NULL) === false)
      assert(validate.string(EXAMPLE_UNDEFINED) === false)
    })

    test('string - optional and nullable', function () {
      assert(validate.string.optional(EXAMPLE_STRING) === true)
      assert(validate.string.optional(EXAMPLE_NULL) === false)
      assert(validate.string.optional(EXAMPLE_UNDEFINED) === true)

      assert(validate.string.nullable(EXAMPLE_STRING) === true)
      assert(validate.string.nullable(EXAMPLE_NULL) === true)
      assert(validate.string.nullable(EXAMPLE_UNDEFINED) === false)

      assert(validate.string.optional.nullable(EXAMPLE_STRING) === true)
      assert(validate.string.optional.nullable(EXAMPLE_NULL) === true)
      assert(validate.string.optional.nullable(EXAMPLE_UNDEFINED) === true)
    })

    test('string - pass', function () {
      assert(validate.string.pass(isFoo)('foo') === true)
      assert(validate.string.pass(isFoo)('bar') === false)
      assert(validate.string.pass(isFoo).optional(undefined) === true)
      assert(validate.string.pass(isFoo).nullable(null) === true)
    })

    test('string - length', function () {
      assert(validate.string.lengthOf(10)('0123456789') === true)
      assert(validate.string.lengthOf(10)('0123456') === false)
      assert(validate.string.lengthOf(10).optional(undefined) === true)
      assert(validate.string.lengthOf(10).nullable(null) === true)
    })

    test('string - match', function () {
      assert(validate.string.match(/foo/)('___foo___') === true)
      assert(validate.string.match(/foo/)('___bar___') === false)
      assert(validate.string.match(/foo/).optional(undefined) === true)
      assert(validate.string.match(/foo/).nullable(null) === true)
    })
  })

  suite('number', function () {
    test('number', function () {
      assert(validate.number(EXAMPLE_STRING) === false)
      assert(validate.number(EXAMPLE_NUMBER) === true)
      assert(validate.number(EXAMPLE_BOOLEAN) === false)
      assert(validate.number(EXAMPLE_OBJECT) === false)
      assert(validate.number(EXAMPLE_ARRAY) === false)
      assert(validate.number(EXAMPLE_FUNCTION) === false)
      assert(validate.number(EXAMPLE_NULL) === false)
      assert(validate.number(EXAMPLE_UNDEFINED) === false)
    })

    test('number - optional and nullable', function () {
      assert(validate.number.optional(EXAMPLE_NUMBER) === true)
      assert(validate.number.optional(EXAMPLE_NULL) === false)
      assert(validate.number.optional(EXAMPLE_UNDEFINED) === true)

      assert(validate.number.nullable(EXAMPLE_NUMBER) === true)
      assert(validate.number.nullable(EXAMPLE_NULL) === true)
      assert(validate.number.nullable(EXAMPLE_UNDEFINED) === false)

      assert(validate.number.optional.nullable(EXAMPLE_NUMBER) === true)
      assert(validate.number.optional.nullable(EXAMPLE_NULL) === true)
      assert(validate.number.optional.nullable(EXAMPLE_UNDEFINED) === true)
    })

    test('number - pass', function () {
      assert(validate.number.pass(is42)(42) === true)
      assert(validate.number.pass(is42)(41) === false)
      assert(validate.number.pass(is42).optional(undefined) === true)
      assert(validate.number.pass(is42).nullable(null) === true)
    })
  })

  suite('boolean', function () {
    test('boolean', function () {
      assert(validate.boolean(EXAMPLE_STRING) === false)
      assert(validate.boolean(EXAMPLE_NUMBER) === false)
      assert(validate.boolean(EXAMPLE_BOOLEAN) === true)
      assert(validate.boolean(EXAMPLE_OBJECT) === false)
      assert(validate.boolean(EXAMPLE_ARRAY) === false)
      assert(validate.boolean(EXAMPLE_FUNCTION) === false)
      assert(validate.boolean(EXAMPLE_NULL) === false)
      assert(validate.boolean(EXAMPLE_UNDEFINED) === false)
    })

    test('boolean - optional and nullable', function () {
      assert(validate.boolean.optional(EXAMPLE_BOOLEAN) === true)
      assert(validate.boolean.optional(EXAMPLE_NULL) === false)
      assert(validate.boolean.optional(EXAMPLE_UNDEFINED) === true)

      assert(validate.boolean.nullable(EXAMPLE_BOOLEAN) === true)
      assert(validate.boolean.nullable(EXAMPLE_NULL) === true)
      assert(validate.boolean.nullable(EXAMPLE_UNDEFINED) === false)

      assert(validate.boolean.optional.nullable(EXAMPLE_BOOLEAN) === true)
      assert(validate.boolean.optional.nullable(EXAMPLE_NULL) === true)
      assert(validate.boolean.optional.nullable(EXAMPLE_UNDEFINED) === true)
    })

    test('boolean - pass', function () {
      assert(validate.boolean.pass(isTrue)(true) === true)
      assert(validate.boolean.pass(isTrue)(false) === false)
      assert(validate.boolean.pass(isTrue).optional(undefined) === true)
      assert(validate.boolean.pass(isTrue).nullable(null) === true)
    })
  })

  suite('object', function () {
    test('object', function () {
      assert(validate.object(EXAMPLE_STRING) === false)
      assert(validate.object(EXAMPLE_NUMBER) === false)
      assert(validate.object(EXAMPLE_BOOLEAN) === false)
      assert(validate.object(EXAMPLE_OBJECT) === true)
      assert(validate.object(EXAMPLE_ARRAY) === false)
      assert(validate.object(EXAMPLE_FUNCTION) === false)
      assert(validate.object(EXAMPLE_NULL) === false)
      assert(validate.object(EXAMPLE_UNDEFINED) === false)
    })

    test('object - optional and nullable', function () {
      assert(validate.object.optional(EXAMPLE_OBJECT) === true)
      assert(validate.object.optional(EXAMPLE_NULL) === false)
      assert(validate.object.optional(EXAMPLE_UNDEFINED) === true)

      assert(validate.object.nullable(EXAMPLE_OBJECT) === true)
      assert(validate.object.nullable(EXAMPLE_NULL) === true)
      assert(validate.object.nullable(EXAMPLE_UNDEFINED) === false)

      assert(validate.object.optional.nullable(EXAMPLE_OBJECT) === true)
      assert(validate.object.optional.nullable(EXAMPLE_NULL) === true)
      assert(validate.object.optional.nullable(EXAMPLE_UNDEFINED) === true)
    })

    test('object - pass', function () {
      assert(validate.object.pass(has3Keys)({a: 1, b: 2, c: 3}) === true)
      assert(validate.object.pass(has3Keys)({a: 1, b: 2}) === false)
      assert(validate.object.pass(has3Keys).optional(undefined) === true)
      assert(validate.object.pass(has3Keys).nullable(null) === true)
    })

    test('object - keys', function () {
      const keys = {foo: isFoo, bar: isBar}

      assert(validate.object.keys(keys)({foo: 'foo', bar: 'bar'}) === true)
      assert(validate.object.keys(keys)({foo: 'bar', bar: 'bar'}) === false)
      assert(validate.object.keys(keys).nullable(EXAMPLE_NULL) === true)
      assert(validate.object.keys(keys).optional(EXAMPLE_UNDEFINED) === true)
    })
  })

  suite('array', function () {
    test('array', function () {
      assert(validate.array(EXAMPLE_STRING) === false)
      assert(validate.array(EXAMPLE_NUMBER) === false)
      assert(validate.array(EXAMPLE_BOOLEAN) === false)
      assert(validate.array(EXAMPLE_OBJECT) === false)
      assert(validate.array(EXAMPLE_ARRAY) === true)
      assert(validate.array(EXAMPLE_FUNCTION) === false)
      assert(validate.array(EXAMPLE_NULL) === false)
      assert(validate.array(EXAMPLE_UNDEFINED) === false)
    })

    test('array - optional and nullable', function () {
      assert(validate.array.optional(EXAMPLE_ARRAY) === true)
      assert(validate.array.optional(EXAMPLE_NULL) === false)
      assert(validate.array.optional(EXAMPLE_UNDEFINED) === true)

      assert(validate.array.nullable(EXAMPLE_ARRAY) === true)
      assert(validate.array.nullable(EXAMPLE_NULL) === true)
      assert(validate.array.nullable(EXAMPLE_UNDEFINED) === false)

      assert(validate.array.optional.nullable(EXAMPLE_ARRAY) === true)
      assert(validate.array.optional.nullable(EXAMPLE_NULL) === true)
      assert(validate.array.optional.nullable(EXAMPLE_UNDEFINED) === true)
    })

    test('array - pass', function () {
      assert(validate.array.pass(startsWithFoo)(['foo', 'bar']) === true)
      assert(validate.array.pass(startsWithFoo)(['bar', 'foo']) === false)
      assert(validate.array.pass(startsWithFoo).optional(undefined) === true)
      assert(validate.array.pass(startsWithFoo).nullable(null) === true)
    })

    test('array - items', function () {
      assert(validate.array.items(isFoo)(['foo', 'foo', 'foo']) === true)
      assert(validate.array.items(isFoo)(['foo', 'bar', 'foo']) === false)
      assert(validate.array.items(isFoo).optional(EXAMPLE_UNDEFINED) === true)
      assert(validate.array.items(isFoo).nullable(EXAMPLE_NULL) === true)
    })

    test('array - length', function () {
      assert(validate.array.lengthOf(4)([0, 1, 2, 3]) === true)
      assert(validate.array.lengthOf(4)([0, 1, 2]) === false)
      assert(validate.array.lengthOf(4).optional(undefined) === true)
      assert(validate.array.lengthOf(4).nullable(null) === true)
    })
  })

  suite('function', function () {
    test('function', function () {
      assert(validate.function(EXAMPLE_STRING) === false)
      assert(validate.function(EXAMPLE_NUMBER) === false)
      assert(validate.function(EXAMPLE_BOOLEAN) === false)
      assert(validate.function(EXAMPLE_OBJECT) === false)
      assert(validate.function(EXAMPLE_ARRAY) === false)
      assert(validate.function(EXAMPLE_FUNCTION) === true)
      assert(validate.function(EXAMPLE_NULL) === false)
      assert(validate.function(EXAMPLE_UNDEFINED) === false)
    })

    test('function - optional and nullable', function () {
      assert(validate.function.optional(EXAMPLE_FUNCTION) === true)
      assert(validate.function.optional(EXAMPLE_NULL) === false)
      assert(validate.function.optional(EXAMPLE_UNDEFINED) === true)

      assert(validate.function.nullable(EXAMPLE_FUNCTION) === true)
      assert(validate.function.nullable(EXAMPLE_NULL) === true)
      assert(validate.function.nullable(EXAMPLE_UNDEFINED) === false)

      assert(validate.function.optional.nullable(EXAMPLE_FUNCTION) === true)
      assert(validate.function.optional.nullable(EXAMPLE_NULL) === true)
      assert(validate.function.optional.nullable(EXAMPLE_UNDEFINED) === true)
    })

    test('function - pass', function () {
      assert(validate.function.pass(hasArity2)((a, b) => a + b) === true)
      assert(validate.function.pass(hasArity2)((a, b, c) => a + b + c) === false)
      assert(validate.function.pass(hasArity2).optional(undefined) === true)
      assert(validate.function.pass(hasArity2).nullable(null) === true)
    })

    test('function - length', function () {
      assert(validate.function.lengthOf(2)((a, b) => a + b) === true)
      assert(validate.function.lengthOf(2)((a) => a) === false)
      assert(validate.function.lengthOf(2).optional(undefined) === true)
      assert(validate.function.lengthOf(2).nullable(null) === true)
    })
  })
})
