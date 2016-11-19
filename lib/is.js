'use strict'

const exists = (value) => value != null
const isType = (type) => (value) => typeof value === type
const isArray = (value) => Array.isArray(value)
const isObject = (value) => isType('object')(value) && value !== null && !isArray(value)
const isPrimitive = (value) => (
  isType('string')(value) ||
  isType('number')(value) ||
  isType('boolean')(value) ||
  isType('undefined')(value) ||
  value === null)

module.exports = {
  exists: exists,
  string: isType('string'),
  number: isType('number'),
  boolean: isType('boolean'),
  function: isType('function'),
  object: isObject,
  array: isArray,
  primitive: isPrimitive
}
