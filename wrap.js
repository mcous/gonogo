// wrap a function with a schema checker
'use strict'

const gng = require('./')

module.exports = function wrapWithGonogo (schema, target) {
  const validate = gng(schema)

  return (props) => {
    validate(props)

    return target(props)
  }
}
