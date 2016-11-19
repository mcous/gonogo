// wrap a function with a schema checker
'use strict'

const base = require('./lib/base')

module.exports = function wrapWithGonogo () {
  const validators = []
  const numberOfValidators = arguments.length - 1
  const target = arguments[numberOfValidators]

  for (let i = 0; i < numberOfValidators; i++) {
    validators.push(base(arguments[i]))
  }

  return function postValidateWrapCaller () {
    let message = ''

    for (let j = 0; j < arguments.length; j++) {
      const argMessage = validators[j] && validators[j](arguments[j])

      if (argMessage) {
        message += `argument ${j} - ${argMessage}`
      }
    }

    if (message) {
      throw new Error(`gng wrap for ${target.name}: ${message}`)
    }

    return target.apply(null, arguments)
  }
}
