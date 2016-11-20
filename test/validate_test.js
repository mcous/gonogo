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

// example test functions
const isFoo = (value) => value === 'foo'
const isBar = (value) => value === 'bar'
const is42 = (value) => value === 42
const is41 = (value) => value === 41
const isTrue = (value) => value === true
const isFalse = (value) => value === false
const hasArity2 = (fn) => fn.length === 2
const hasArity1 = (fn) => fn.length === 1
const has3Keys = (obj) => Object.keys(obj).length === 3
const has2Keys = (obj) => Object.keys(obj).length === 2
const startsWithFoo = (arr) => arr[0] === 'foo'
const startsWithBar = (arr) => arr[0] === 'bar'

suite('validate', function () {
  suite('any', function () {
    test('any', function () {
      assert.equal(validate.any(EXAMPLE_STRING), true)
      assert.equal(validate.any(EXAMPLE_NUMBER), true)
      assert.equal(validate.any(EXAMPLE_BOOLEAN), true)
      assert.equal(validate.any(EXAMPLE_OBJECT), true)
      assert.equal(validate.any(EXAMPLE_ARRAY), true)
      assert.equal(validate.any(EXAMPLE_FUNCTION), true)
      assert.equal(validate.any(EXAMPLE_NULL), false)
      assert.equal(validate.any(EXAMPLE_UNDEFINED), false)
    })

    test('any - optional and nullable', function () {
      assert.equal(validate.any.optional(EXAMPLE_STRING), true)
      assert.equal(validate.any.optional(EXAMPLE_NULL), false)
      assert.equal(validate.any.optional(EXAMPLE_UNDEFINED), true)

      assert.equal(validate.any.nullable(EXAMPLE_STRING), true)
      assert.equal(validate.any.nullable(EXAMPLE_NULL), true)
      assert.equal(validate.any.nullable(EXAMPLE_UNDEFINED), false)

      assert.equal(validate.any.optional.nullable(EXAMPLE_STRING), true)
      assert.equal(validate.any.optional.nullable(EXAMPLE_NULL), true)
      assert.equal(validate.any.optional.nullable(EXAMPLE_UNDEFINED), true)
    })

    test('any - and', function () {
      assert.equal(validate.any.and(isFoo)('foo'), true)
      assert.equal(validate.any.and(isFoo)('bar'), false)
      assert.equal(validate.any.and(isFoo).optional(undefined), true)
      assert.equal(validate.any.and(isFoo).nullable(null), true)
    })

    test('any - or', function () {
      assert.equal(validate.any.and(isFoo).or(isBar)('foo'), true)
      assert.equal(validate.any.and(isFoo).or(isBar)('bar'), true)
      assert.equal(validate.any.and(isFoo).or(isBar)('baz'), false)
      assert.equal(validate.any.and(isFoo).or(isBar).optional(undefined), true)
      assert.equal(validate.any.and(isFoo).or(isBar).nullable(null), true)
    })

    test('any - not', function () {
      assert.equal(validate.any.not(isFoo)('foo'), false)
      assert.equal(validate.any.not(isFoo)('bar'), true)
      assert.equal(validate.any.not(isFoo).optional(undefined), true)
      assert.equal(validate.any.not(isFoo).nullable(null), true)
    })

    test('any - values', function () {
      assert.equal(validate.any.values(['foo', 'bar'])('foo'), true)
      assert.equal(validate.any.values(['foo', 'bar'])('bar'), true)
      assert.equal(validate.any.values(['foo', 'bar'])('baz'), false)
      assert.equal(validate.any.values(['foo', 'bar']).optional(undefined), true)
      assert.equal(validate.any.values(['foo', 'bar']).nullable(null), true)
    })
  })

  suite('string', function () {
    test('string', function () {
      assert.equal(validate.string(EXAMPLE_STRING), true)
      assert.equal(validate.string(EXAMPLE_NUMBER), false)
      assert.equal(validate.string(EXAMPLE_BOOLEAN), false)
      assert.equal(validate.string(EXAMPLE_OBJECT), false)
      assert.equal(validate.string(EXAMPLE_ARRAY), false)
      assert.equal(validate.string(EXAMPLE_FUNCTION), false)
      assert.equal(validate.string(EXAMPLE_NULL), false)
      assert.equal(validate.string(EXAMPLE_UNDEFINED), false)
    })

    test('string - optional and nullable', function () {
      assert.equal(validate.string.optional(EXAMPLE_STRING), true)
      assert.equal(validate.string.optional(EXAMPLE_NULL), false)
      assert.equal(validate.string.optional(EXAMPLE_UNDEFINED), true)

      assert.equal(validate.string.nullable(EXAMPLE_STRING), true)
      assert.equal(validate.string.nullable(EXAMPLE_NULL), true)
      assert.equal(validate.string.nullable(EXAMPLE_UNDEFINED), false)

      assert.equal(validate.string.optional.nullable(EXAMPLE_STRING), true)
      assert.equal(validate.string.optional.nullable(EXAMPLE_NULL), true)
      assert.equal(validate.string.optional.nullable(EXAMPLE_UNDEFINED), true)
    })

    test('string - and', function () {
      assert.equal(validate.string.and(isFoo)('foo'), true)
      assert.equal(validate.string.and(isFoo)('bar'), false)
      assert.equal(validate.string.and(isFoo).optional(undefined), true)
      assert.equal(validate.string.and(isFoo).nullable(null), true)
    })

    test('string - or', function () {
      assert.equal(validate.any.and(isFoo).or(isBar)('foo'), true)
      assert.equal(validate.any.and(isFoo).or(isBar)('bar'), true)
      assert.equal(validate.any.and(isFoo).or(isBar)('baz'), false)
      assert.equal(validate.any.and(isFoo).or(isBar).optional(undefined), true)
      assert.equal(validate.any.and(isFoo).or(isBar).nullable(null), true)
    })

    test('string - not', function () {
      assert.equal(validate.string.not(isFoo)('foo'), false)
      assert.equal(validate.string.not(isFoo)('bar'), true)
      assert.equal(validate.string.not(isFoo).optional(undefined), true)
      assert.equal(validate.string.not(isFoo).nullable(null), true)
    })

    test('string - values', function () {
      assert.equal(validate.string.values(['foo', 'bar'])('foo'), true)
      assert.equal(validate.string.values(['foo', 'bar'])('bar'), true)
      assert.equal(validate.string.values(['foo', 'bar'])('baz'), false)
      assert.equal(validate.string.values(['foo', 'bar']).optional(undefined), true)
      assert.equal(validate.string.values(['foo', 'bar']).nullable(null), true)
    })

    test('string - length', function () {
      assert.equal(validate.string.lengthOf(10)('0123456789'), true)
      assert.equal(validate.string.lengthOf(10)('0123456'), false)
      assert.equal(validate.string.lengthOf(10).optional(undefined), true)
      assert.equal(validate.string.lengthOf(10).nullable(null), true)
    })

    test('string - match', function () {
      assert.equal(validate.string.match(/foo/)('___foo___'), true)
      assert.equal(validate.string.match(/foo/)('___bar___'), false)
      assert.equal(validate.string.match(/foo/).optional(undefined), true)
      assert.equal(validate.string.match(/foo/).nullable(null), true)
    })
  })

  suite('number', function () {
    test('number', function () {
      assert.equal(validate.number(EXAMPLE_STRING), false)
      assert.equal(validate.number(EXAMPLE_NUMBER), true)
      assert.equal(validate.number(EXAMPLE_BOOLEAN), false)
      assert.equal(validate.number(EXAMPLE_OBJECT), false)
      assert.equal(validate.number(EXAMPLE_ARRAY), false)
      assert.equal(validate.number(EXAMPLE_FUNCTION), false)
      assert.equal(validate.number(EXAMPLE_NULL), false)
      assert.equal(validate.number(EXAMPLE_UNDEFINED), false)
    })

    test('number - optional and nullable', function () {
      assert.equal(validate.number.optional(EXAMPLE_NUMBER), true)
      assert.equal(validate.number.optional(EXAMPLE_NULL), false)
      assert.equal(validate.number.optional(EXAMPLE_UNDEFINED), true)

      assert.equal(validate.number.nullable(EXAMPLE_NUMBER), true)
      assert.equal(validate.number.nullable(EXAMPLE_NULL), true)
      assert.equal(validate.number.nullable(EXAMPLE_UNDEFINED), false)

      assert.equal(validate.number.optional.nullable(EXAMPLE_NUMBER), true)
      assert.equal(validate.number.optional.nullable(EXAMPLE_NULL), true)
      assert.equal(validate.number.optional.nullable(EXAMPLE_UNDEFINED), true)
    })

    test('number - and', function () {
      assert.equal(validate.number.and(is42)(42), true)
      assert.equal(validate.number.and(is42)(41), false)
      assert.equal(validate.number.and(is42).optional(undefined), true)
      assert.equal(validate.number.and(is42).nullable(null), true)
    })

    test('number - or', function () {
      assert.equal(validate.number.and(is42).or(is41)(42), true)
      assert.equal(validate.number.and(is42).or(is41)(41), true)
      assert.equal(validate.number.and(is42).or(is41)(40), false)
      assert.equal(validate.number.and(is42).or(is41).optional(undefined), true)
      assert.equal(validate.number.and(is42).or(is41).nullable(null), true)
    })

    test('number - not', function () {
      assert.equal(validate.number.not(is42)(42), false)
      assert.equal(validate.number.not(is42)(41), true)
      assert.equal(validate.number.not(is42).optional(undefined), true)
      assert.equal(validate.number.not(is42).nullable(null), true)
    })

    test('number - values', function () {
      assert.equal(validate.number.values([41, 42])(41), true)
      assert.equal(validate.number.values([41, 42])(42), true)
      assert.equal(validate.number.values([41, 42])(43), false)
      assert.equal(validate.number.values([41, 42]).optional(undefined), true)
      assert.equal(validate.number.values([41, 42]).nullable(null), true)
    })
  })

  suite('boolean', function () {
    test('boolean', function () {
      assert.equal(validate.boolean(EXAMPLE_STRING), false)
      assert.equal(validate.boolean(EXAMPLE_NUMBER), false)
      assert.equal(validate.boolean(EXAMPLE_BOOLEAN), true)
      assert.equal(validate.boolean(EXAMPLE_OBJECT), false)
      assert.equal(validate.boolean(EXAMPLE_ARRAY), false)
      assert.equal(validate.boolean(EXAMPLE_FUNCTION), false)
      assert.equal(validate.boolean(EXAMPLE_NULL), false)
      assert.equal(validate.boolean(EXAMPLE_UNDEFINED), false)
    })

    test('boolean - optional and nullable', function () {
      assert.equal(validate.boolean.optional(EXAMPLE_BOOLEAN), true)
      assert.equal(validate.boolean.optional(EXAMPLE_NULL), false)
      assert.equal(validate.boolean.optional(EXAMPLE_UNDEFINED), true)

      assert.equal(validate.boolean.nullable(EXAMPLE_BOOLEAN), true)
      assert.equal(validate.boolean.nullable(EXAMPLE_NULL), true)
      assert.equal(validate.boolean.nullable(EXAMPLE_UNDEFINED), false)

      assert.equal(validate.boolean.optional.nullable(EXAMPLE_BOOLEAN), true)
      assert.equal(validate.boolean.optional.nullable(EXAMPLE_NULL), true)
      assert.equal(validate.boolean.optional.nullable(EXAMPLE_UNDEFINED), true)
    })

    test('boolean - and', function () {
      assert.equal(validate.boolean.and(isTrue)(true), true)
      assert.equal(validate.boolean.and(isTrue)(false), false)
      assert.equal(validate.boolean.and(isTrue).optional(undefined), true)
      assert.equal(validate.boolean.and(isTrue).nullable(null), true)
    })

    test('boolean - or', function () {
      assert.equal(validate.boolean.and(isTrue).or(isFalse)(true), true)
      assert.equal(validate.boolean.and(isTrue).or(isFalse)(false), true)
      assert.equal(validate.boolean.and(isTrue).or(isFalse).optional(undefined), true)
      assert.equal(validate.boolean.and(isTrue).or(isFalse).nullable(null), true)
    })

    test('boolean - not', function () {
      assert.equal(validate.boolean.not(isTrue)(true), false)
      assert.equal(validate.boolean.not(isTrue)(false), true)
      assert.equal(validate.boolean.not(isTrue).optional(undefined), true)
      assert.equal(validate.boolean.not(isTrue).nullable(null), true)
    })

    test('boolean - values', function () {
      assert.equal(validate.boolean.values([true])(true), true)
      assert.equal(validate.boolean.values([true])(false), false)
      assert.equal(validate.boolean.values([true]).optional(undefined), true)
      assert.equal(validate.boolean.values([true]).nullable(null), true)
    })
  })

  suite('object', function () {
    test('object', function () {
      assert.equal(validate.object(EXAMPLE_STRING), false)
      assert.equal(validate.object(EXAMPLE_NUMBER), false)
      assert.equal(validate.object(EXAMPLE_BOOLEAN), false)
      assert.equal(validate.object(EXAMPLE_OBJECT), true)
      assert.equal(validate.object(EXAMPLE_ARRAY), false)
      assert.equal(validate.object(EXAMPLE_FUNCTION), false)
      assert.equal(validate.object(EXAMPLE_NULL), false)
      assert.equal(validate.object(EXAMPLE_UNDEFINED), false)
    })

    test('object - optional and nullable', function () {
      assert.equal(validate.object.optional(EXAMPLE_OBJECT), true)
      assert.equal(validate.object.optional(EXAMPLE_NULL), false)
      assert.equal(validate.object.optional(EXAMPLE_UNDEFINED), true)

      assert.equal(validate.object.nullable(EXAMPLE_OBJECT), true)
      assert.equal(validate.object.nullable(EXAMPLE_NULL), true)
      assert.equal(validate.object.nullable(EXAMPLE_UNDEFINED), false)

      assert.equal(validate.object.optional.nullable(EXAMPLE_OBJECT), true)
      assert.equal(validate.object.optional.nullable(EXAMPLE_NULL), true)
      assert.equal(validate.object.optional.nullable(EXAMPLE_UNDEFINED), true)
    })

    test('object - and', function () {
      assert.equal(validate.object.and(has3Keys)({a: 1, b: 2, c: 3}), true)
      assert.equal(validate.object.and(has3Keys)({a: 1, b: 2}), false)
      assert.equal(validate.object.and(has3Keys).optional(undefined), true)
      assert.equal(validate.object.and(has3Keys).nullable(null), true)
    })

    test('object - or', function () {
      assert.equal(validate.object.and(has3Keys).or(has2Keys)({a: 1, b: 2, c: 3}), true)
      assert.equal(validate.object.and(has3Keys).or(has2Keys)({a: 1, b: 2}), true)
      assert.equal(validate.object.and(has3Keys).or(has2Keys)({a: 1}), false)
      assert.equal(validate.object.and(has3Keys).or(has2Keys).optional(undefined), true)
      assert.equal(validate.object.and(has3Keys).or(has2Keys).nullable(null), true)
    })

    test('object - not', function () {
      assert.equal(validate.object.not(has3Keys)({a: 1, b: 2, c: 3}), false)
      assert.equal(validate.object.not(has3Keys)({a: 1, b: 2}), true)
      assert.equal(validate.object.not(has3Keys).optional(undefined), true)
      assert.equal(validate.object.not(has3Keys).nullable(null), true)
    })

    test('object - keys', function () {
      const keys = {foo: isFoo, bar: isBar}

      assert.equal(validate.object.keys(keys)({foo: 'foo', bar: 'bar'}), true)
      assert.equal(validate.object.keys(keys)({foo: 'bar', bar: 'bar'}), false)
      assert.equal(validate.object.keys(keys).nullable(EXAMPLE_NULL), true)
      assert.equal(validate.object.keys(keys).optional(EXAMPLE_UNDEFINED), true)
    })
  })

  suite('array', function () {
    test('array', function () {
      assert.equal(validate.array(EXAMPLE_STRING), false)
      assert.equal(validate.array(EXAMPLE_NUMBER), false)
      assert.equal(validate.array(EXAMPLE_BOOLEAN), false)
      assert.equal(validate.array(EXAMPLE_OBJECT), false)
      assert.equal(validate.array(EXAMPLE_ARRAY), true)
      assert.equal(validate.array(EXAMPLE_FUNCTION), false)
      assert.equal(validate.array(EXAMPLE_NULL), false)
      assert.equal(validate.array(EXAMPLE_UNDEFINED), false)
    })

    test('array - optional and nullable', function () {
      assert.equal(validate.array.optional(EXAMPLE_ARRAY), true)
      assert.equal(validate.array.optional(EXAMPLE_NULL), false)
      assert.equal(validate.array.optional(EXAMPLE_UNDEFINED), true)

      assert.equal(validate.array.nullable(EXAMPLE_ARRAY), true)
      assert.equal(validate.array.nullable(EXAMPLE_NULL), true)
      assert.equal(validate.array.nullable(EXAMPLE_UNDEFINED), false)

      assert.equal(validate.array.optional.nullable(EXAMPLE_ARRAY), true)
      assert.equal(validate.array.optional.nullable(EXAMPLE_NULL), true)
      assert.equal(validate.array.optional.nullable(EXAMPLE_UNDEFINED), true)
    })

    test('array - and', function () {
      assert.equal(validate.array.and(startsWithFoo)(['foo', 'bar']), true)
      assert.equal(validate.array.and(startsWithFoo)(['bar', 'foo']), false)
      assert.equal(validate.array.and(startsWithFoo).optional(undefined), true)
      assert.equal(validate.array.and(startsWithFoo).nullable(null), true)
    })

    test('array - or', function () {
      assert.equal(validate.array.and(startsWithFoo).or(startsWithBar)(['foo', 'bar']), true)
      assert.equal(validate.array.and(startsWithFoo).or(startsWithBar)(['bar', 'foo']), true)
      assert.equal(validate.array.and(startsWithFoo).or(startsWithBar)([]), false)
      assert.equal(validate.array.and(startsWithFoo).or(startsWithBar).optional(undefined), true)
      assert.equal(validate.array.and(startsWithFoo).or(startsWithBar).nullable(null), true)
    })

    test('array - not', function () {
      assert.equal(validate.array.not(startsWithFoo)(['foo', 'bar']), false)
      assert.equal(validate.array.not(startsWithFoo)(['bar', 'foo']), true)
      assert.equal(validate.array.not(startsWithFoo).optional(undefined), true)
      assert.equal(validate.array.not(startsWithFoo).nullable(null), true)
    })

    test('array - items', function () {
      assert.equal(validate.array.items(isFoo)(['foo', 'foo', 'foo']), true)
      assert.equal(validate.array.items(isFoo)(['foo', 'bar', 'foo']), false)
      assert.equal(validate.array.items(isFoo).optional(EXAMPLE_UNDEFINED), true)
      assert.equal(validate.array.items(isFoo).nullable(EXAMPLE_NULL), true)
    })

    test('array - length', function () {
      assert.equal(validate.array.lengthOf(4)([0, 1, 2, 3]), true)
      assert.equal(validate.array.lengthOf(4)([0, 1, 2]), false)
      assert.equal(validate.array.lengthOf(4).optional(undefined), true)
      assert.equal(validate.array.lengthOf(4).nullable(null), true)
    })
  })

  suite('function', function () {
    test('function', function () {
      assert.equal(validate.function(EXAMPLE_STRING), false)
      assert.equal(validate.function(EXAMPLE_NUMBER), false)
      assert.equal(validate.function(EXAMPLE_BOOLEAN), false)
      assert.equal(validate.function(EXAMPLE_OBJECT), false)
      assert.equal(validate.function(EXAMPLE_ARRAY), false)
      assert.equal(validate.function(EXAMPLE_FUNCTION), true)
      assert.equal(validate.function(EXAMPLE_NULL), false)
      assert.equal(validate.function(EXAMPLE_UNDEFINED), false)
    })

    test('function - optional and nullable', function () {
      assert.equal(validate.function.optional(EXAMPLE_FUNCTION), true)
      assert.equal(validate.function.optional(EXAMPLE_NULL), false)
      assert.equal(validate.function.optional(EXAMPLE_UNDEFINED), true)

      assert.equal(validate.function.nullable(EXAMPLE_FUNCTION), true)
      assert.equal(validate.function.nullable(EXAMPLE_NULL), true)
      assert.equal(validate.function.nullable(EXAMPLE_UNDEFINED), false)

      assert.equal(validate.function.optional.nullable(EXAMPLE_FUNCTION), true)
      assert.equal(validate.function.optional.nullable(EXAMPLE_NULL), true)
      assert.equal(validate.function.optional.nullable(EXAMPLE_UNDEFINED), true)
    })

    test('function - and', function () {
      assert.equal(validate.function.and(hasArity2)((a, b) => a + b), true)
      assert.equal(validate.function.and(hasArity2)((a, b, c) => a + b + c), false)
      assert.equal(validate.function.and(hasArity2).optional(undefined), true)
      assert.equal(validate.function.and(hasArity2).nullable(null), true)
    })

    test('function - or', function () {
      assert.equal(validate.function.and(hasArity2).or(hasArity1)((a, b) => a + b), true)
      assert.equal(validate.function.and(hasArity2).or(hasArity1)((a) => a), true)
      assert.equal(validate.function.and(hasArity2).or(hasArity1)((a, b, c) => a + b + c), false)
      assert.equal(validate.function.and(hasArity2).or(hasArity1).optional(undefined), true)
      assert.equal(validate.function.and(hasArity2).or(hasArity1).nullable(null), true)
    })

    test('function - not', function () {
      assert.equal(validate.function.not(hasArity2)((a, b) => a + b), false)
      assert.equal(validate.function.not(hasArity2)((a, b, c) => a + b + c), true)
      assert.equal(validate.function.not(hasArity2).optional(undefined), true)
      assert.equal(validate.function.not(hasArity2).nullable(null), true)
    })

    test('function - length', function () {
      assert.equal(validate.function.lengthOf(2)((a, b) => a + b), true)
      assert.equal(validate.function.lengthOf(2)((a) => a), false)
      assert.equal(validate.function.lengthOf(2).optional(undefined), true)
      assert.equal(validate.function.lengthOf(2).nullable(null), true)
    })
  })
})
