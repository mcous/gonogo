'use strict'

const exists = (value) => value != null
const isType = (type) => (value) => typeof value === type
const isArray = (value) => Array.isArray(value)
const isObject = (value) => isType('object')(value) && value !== null && !isArray(value)

module.exports = {
  exists: exists,
  string: isType('string'),
  number: isType('number'),
  boolean: isType('boolean'),
  function: isType('function'),
  object: isObject,
  array: isArray
}
