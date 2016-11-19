// super minimal assert
'use strict'

module.exports = function assert (ok, message) {
  if (!ok) {
    throw new Error(`gng: ${message}`)
  }
}
