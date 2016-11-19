// wrap a function with a schema checker
'use strict'

const gng = require('./')

module.exports = function wrapWithGonogo () {
  const validators = []
  const numberOfValidators = arguments.length - 1
  const target = arguments[numberOfValidators]

  for (let i = 0; i < numberOfValidators; i++) {
    validators.push(gng(arguments[i]))
  }

  return function postValidateWrapCaller () {
    for (let j = 0; j < arguments.length; j++) {
      validators[j] && validators[j](arguments[j])
    }

    return target.apply(null, arguments)
  }
}
