// stringify values and objects
'use strict'

const is = require('./is')

module.exports = function stringify (value, seenRefs) {
  seenRefs = seenRefs || []

  if (is.string(value)) {
    return `"${value}"`
  }

  if (!is.primitive(value)) {
    if (seenRefs.indexOf(value) > -1) {
      return '~circular~'
    }

    seenRefs.push(value)

    if (is.array(value)) {
      return `[${value.map((item) => stringify(item, seenRefs)).join(', ')}]`
    }

    if (is.object(value)) {
      const keyValuePairs = Object.keys(value).map((key) => {
        return `${stringify(key)}: ${stringify(value[key], seenRefs)}`
      })

      return `{${keyValuePairs.join(', ')}}`
    }
  }

  return `${value}`
}
