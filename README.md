# gonogo

> Simple, lightweight object validation

gonogo is a _tiny_ library for validating JavaScript values and objects. It was designed to check web component properties, but it's simple enough that you could probably use it for any basic object validation needs.

## table of contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [install](#install)
- [usage](#usage)
  - [basic usage](#basic-usage)
  - [wrap a function](#wrap-a-function)
  - [production builds](#production-builds)
    - [browserify](#browserify)
- [api](#api)
  - [built-in validation functions](#built-in-validation-functions)
    - [gng.any](#gngany)
      - [gng.any.optional](#gnganyoptional)
      - [gng.any.nullable](#gnganynullable)
      - [gng.any.pass](#gnganypass)
      - [the useless validator](#the-useless-validator)
    - [gng.string](#gngstring)
      - [gng.string.lengthOf](#gngstringlengthof)
      - [gng.string.match](#gngstringmatch)
    - [gng.number](#gngnumber)
    - [gng.boolean](#gngboolean)
    - [gng.object](#gngobject)
      - [gng.object.keys](#gngobjectkeys)
    - [gng.array](#gngarray)
      - [gng.array.items](#gngarrayitems)
      - [gng.array.lengthOf](#gngarraylengthof)
    - [gng.function](#gngfunction)
      - [gng.function.lengthOf](#gngfunctionlengthof)
- [related projects](#related-projects)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## install

Install using [npm] for use with [Node.js][node] and browsers via [Browserify][br], [webpack][wp], et. al.

``` shell
$ npm install --save-dev gonogo
```

## usage

Pass `gonogo` a validator function or a schema object with validator functions as its values, and it will return a function you can use to validate values. For ease, `gonogo` comes packaged with a set of [chainable validator functions][#built-in-validation-functions] to use.

### basic usage

``` js
const gng = require('gonogo')

const validate = gng({
  name: gng.string,
  count: gng.number
  children: gng.array.lengthOf(12).items(gng.object.keys({name: gng.string}))
})

validate({
  name: 'foo',
  count: 'not-a-number',
  children: [{name: 'bar'}, {name: 'baz'}]
}) // throws
```

### wrap a function

You may package a function up with a set of validator functions / schemas in order to validate any parameters before passing them to the object

``` js
const gng = require('gonogo')
const gngWrap = require('gonogo/wrap')

const iHave = gngWrap(gng.number, gng.string, (count, things) => {
  console.log(`I have ${count} ${things}`)
})

iHave(3000, 'flurbos')  // works
iHave('roy', 'flurbos') // throws
```

#### validate prop types of a component

Using wrap, you can have a lightweight and functional prop types checker

``` js
const gng = require('gonogo')
const validateProps = require('gonogo/wrap')

const Component = validateProps({text: gng.string}, function renderComponent (props) {
  const el = document.createElement('div')
  const text = document.createTextNode(props.text)

  el.appendChild(text)

  return el
})

Component({text: 'hello'}) // works
Component({text: 7})       // throws
```

### production builds

**THIS STUFF IS NOT IMPLEMENTED, BUT IT'S COMING PROBABLY (?)**

If you're using `gonogo` as a tool during development, you probably want to remove these assertions in production builds.

#### browserify

browserify -t gonogo/ungonogoify entry.js

## api

`validate: function = gng(schema: object|function, [options: object])`

gonogo takes a schema object or validation function. It returns a function that you may use to validate a target. If the schema is not valid, gonogo will throw.

Given a validation function, the test target will be passed to the function and a true / false return value will determine if the target is valid. Given a schema object, each key of the object should be a validation function. Those keys will be used to validate their corresponding values of the test target.

Example with validation function:

``` js
const validate = gng((value) => value === 'pass')

validate('pass') // nothing happens
validate('fail') // throws
```

Example with schema object:

``` js
const validate = gng({
  foo: (value) => value === 'pass',
  bar: (value) => value === 'pass',
  baz: (value) => value === 'pass'
})

validate({foo: 'pass', bar: 'pass', baz: 'pass'}) // nothing happens
validate({foo: 'pass', bar: 'fail', baz: 'pass'}) // throws
```

If a validation function has a `message` property attached, the thrown error will include it:

``` js
const schema = (value) => value === 'pass'

schema.message = 'the value "pass"'

const validate = gng(schema)

validate('fail') // throws with message '...expected the value "pass"'
```

### built-in validation functions

gonogo comes with a collection of chainable validators to use in schemas.

#### gng.any

Tests that a value is not `null` or `undefined`

``` js
gng.any('foo')     // true
gng.any(undefined) // false
gng.any(null)      // false
```

All base validators, including `gng.any` have the following methods available:

##### gng.any.optional

Allows a value to be `undefined`

``` js
gng.any.optional('foo')     // true
gng.any.optional(undefined) // true
gng.any.optional(null)      // false
```

##### gng.any.nullable

Allows a value to be `null`

``` js
gng.any.nullable('foo')     // true
gng.any.nullable(undefined) // true
gng.any.nullable(null)      // false
```
##### gng.any.pass

Tests that the value also passes a given predicate

``` js
const test = (value) => value === 'foo'

gng.any.pass(test)('foo') // true
gng.any.pass(test)('bar') // false
```

##### the useless validator

Will pass anything, including `null` and `undefined`

``` js
gng.any.optional.nullable(ANYTHING_OR_NOTHING) // true
```

#### gng.string

Tests that a value is a string

``` js
gng.string('foo') // true
gng.string(12345) // false
```

`gng.string` has all `gng.any` methods available as well as:

##### gng.string.lengthOf

Tests that a string has a certain length

``` js
gng.string.lengthOf(3)('foo')  // true
gng.string.lengthOf(3)('quux') // false
```

##### gng.string.match

Tests that a string matches a regex (or string). The matcher will be passed to `new RegExp` before testing

``` js
gng.string.match(/foo/)('__foo__') // true
gng.string.match('foo')('__foo__') // true
gng.string.match(/foo/)('__bar__') // false
```

#### gng.number

Tests that a value is a number

``` js
gng.number(12345) // true
gng.number('foo') // false
```

`gng.number` has all `gng.any` methods available.

#### gng.boolean

Tests that a value is a boolean

``` js
gng.boolean(false) // true
gng.boolean('foo') // false
```

`gng.boolean` has all `gng.any` methods available.

#### gng.object

Tests that a value is a plain object

``` js
gng.object({})   // true
gng.object([])   // false
gng.object(null) // false
```

`gng.object` has all `gng.any` methods available as well as:

##### gng.object.keys

Tests that an object adheres to a schema, where the schema is an object with validation functions for its keys.

``` js
const schema = {
  foo: gng.string
  bar: gng.number
}

gng.object.keys(schema)({foo: 'foo', bar: 2}) // true
gng.object.keys(schema)({foo: 1, bar: 2})     // false
```

#### gng.array

Tests that a value is an array

``` js
gng.array(['0', '1', '2'])             // true
gng.array({0: '0', 1: '1', length: 2}) // false
```

`gng.array` has all `gng.any` methods available as well as:

##### gng.array.items

Tests that all of an array's items pass a given validation function

``` js
gng.array.items(gng.number)([1, 2, 3])       // true
gng.array.items(gng.number)(['1', '2', '3']) // false
```

##### gng.array.lengthOf

Tests that an array has a certain length

``` js
gng.array.lengthOf(3)([1, 2, 3]) // true
gng.array.lengthOf(3)([1, 2])    // false
```

#### gng.function

Tests that a value is a function

``` js
gng.function(() => 'foo') // true
gng.function('foo')       // false
```

`gng.function` has all `gng.any` methods available as well as:

##### gng.function.lengthOf

Tests that an function has a certain length (arity)

``` js
gng.function.lengthOf(3)((a, b, c) => a + b + c)  // true
gng.function.lengthOf(3)((a, b) => a + b)         // false
```

## related projects

* [React's PropTypes][react-prop-types]
* [joi][joi]

[node]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/
[br]: http://browserify.org/
[wp]: https://webpack.github.io/
[react-prop-types]: https://facebook.github.io/react/docs/typechecking-with-proptypes.html
[joi]: https://github.com/hapijs/joi
