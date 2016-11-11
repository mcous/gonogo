// wrap a function with a schema checker
'use strict'

const gng = require('./')

module.exports = function wrapWithGonogo (target, schema) {
  const validate = gng(schema)

  return (props) => {
    validate(props)

    return target(props)
  }
}
