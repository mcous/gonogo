// validations library test suite
'use strict'

const assert = require('assert')
const describe = require('mocha').describe
const it = require('mocha').it

const gng = require('../')

const typeTests = [
  {
    type: 'string',
    example: 'foo',
    message: /is not a string/
  },
  {
    type: 'number',
    example: 42,
    message: /is not a number/
  },
  {
    type: 'boolean',
    example: false,
    message: /is not a boolean/
  },
  {
    type: 'func',
    example: () => 'foo',
    message: /is not a function/
  },
  {
    type: 'object',
    example: {},
    message: /is not an object/
  },
  {
    type: 'array',
    example: [],
    message: /is not an array/
  }
]

describe('gonogo - validator functions', function () {
  it('should handle gng.pass', function () {
    const schema = gng.pass((value) => value === 'pass')
    const validate = gng(schema)

    validate('pass')
    assert.throws(() => validate('fail'), /failed/)
  })

  typeTests.forEach((test) => {
    it(`should handle gng.${test.type}`, function () {
      const schema = gng[test.type]
      const validate = gng(schema)

      typeTests.forEach((otherTest) => {
        if (test.type === otherTest.type) {
          validate(test.example)
        } else {
          assert.throws(() => validate(otherTest.example), test.message)
        }
      })
    })

    it(`it should handle gng.${test.type} as a property schema`, function () {
      const schema = {foo: gng[test.type]}
      const validate = gng(schema)

      typeTests.forEach((otherTest) => {
        if (test.type === otherTest.type) {
          validate({foo: test.example})
        } else {
          assert.throws(() => validate({foo: otherTest.example}), test.message)
        }
      })
    })
  })
})
