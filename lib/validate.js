'use strict'

const is = require('./is')
const tests = require('./validate-methods')

const BASE_METHODS = [
  tests.optional,
  tests.nullable,
  tests.pass
]

const assignMethods = (validator, methods, options, test) => {
  methods.forEach((method) => {
    const name = method.name
    const thunk = method.thunk
    const message = method.message
    const createMethod = (value, newMessage) => {
      const newOptions = {}

      newOptions[name] = value

      return validator(newOptions, newMessage)
    }

    test[name] = thunk
      ? (props) => createMethod(props, message(props))
      : createMethod(true, message)
  })

  return test
}

const createValidator = (test, message, methods, options) => {
  options = options || {}
  methods = (methods || []).concat(BASE_METHODS)

  const unusedMethods = methods.filter((method) => options[method.name] == null)
  const self = (newOptions, newMessage) => {
    newOptions = Object.assign({}, options, newOptions)
    newMessage = `${message} ${newMessage}`

    return createValidator(test, newMessage, unusedMethods, newOptions)
  }

  const validator = assignMethods(self, unusedMethods, options, (value) => {
    const usedMethods = methods.filter((method) => options[method.name] != null)
    const preTest = usedMethods.filter((method) => method.shortCircuit)
    const postTest = usedMethods.filter((method) => !method.shortCircuit)
    const runMethod = (method) => method.test(value, options[method.name])

    return preTest.some(runMethod) || (test(value) && postTest.every(runMethod))
  })

  // make sure message property isn't enumerable
  Object.defineProperty(validator, 'message', {value: message})

  return validator
}

module.exports = {
  any: createValidator(is.exists, 'anything'),
  string: createValidator(is.string, 'a string', [tests.lengthOf, tests.match]),
  number: createValidator(is.number, 'a number'),
  boolean: createValidator(is.boolean, 'a boolean'),
  object: createValidator(is.object, 'an object', [tests.keys]),
  array: createValidator(is.array, 'an array', [tests.lengthOf, tests.items]),
  function: createValidator(is.function, 'a function', [tests.lengthOf])
}
