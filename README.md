# gonogo

> Simple object and function parameter validation

gonogo is a minimal, functional assertion library for validating JavaScript values, objects, and function parameters. It was designed to check web component properties during development, but it's simple enough that you could probably use it for any basic validation needs.

## table of contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [install](#install)
- [usage](#usage)
  - [basic usage](#basic-usage)
  - [validate function parameters](#validate-function-parameters)
    - [validate prop types of a component](#validate-prop-types-of-a-component)
  - [production builds](#production-builds)
    - [browserify](#browserify)
    - [webpack](#webpack)
- [api](#api)
  - [usage](#usage-1)
  - [built-in validation functions](#built-in-validation-functions)
    - [common methods](#common-methods)
      - [gng.[base].optional](#gngbaseoptional)
      - [gng.[base].nullable](#gngbasenullable)
      - [gng.[base].and](#gngbaseand)
      - [gng.[base].or](#gngbaseor)
      - [gng.[base].not](#gngbasenot)
      - [gng.[base].values](#gngbasevalues)
    - [gng.any](#gngany)
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
    - [anything-at-all validator](#anything-at-all-validator)
- [related projects](#related-projects)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## install

Install using [npm] for use with [Node.js][node] and browsers via [Browserify][br], [webpack][wp], et. al.

``` shell
$ npm install --save-dev gonogo
```

**important note about browsers**

`gonogo` is written with arrow functions, `const` / `let`, and template strings, so it'll run in any reasonable modern browser (Chrome, Firefox, Edge, Safari >= 10). For older browsers (Internet Explorer, Safari <= 9), you'll need a transform like [es2020][es2020].

For, example, with browserify:

``` shell
$ npm install --save-dev browserify es2020
$ browserify entry.js --global-transform=es2020 > bundle.js
```

## usage

Pass `gonogo` a validator function or a schema object with validator functions as its values, and it will return a function you can use to validate values. For ease, `gonogo` comes packaged with a set of [chainable validator functions][#built-in-validation-functions] to use.

### basic usage

``` js
const gng = require('gonogo')

const validate = gng({
  name: gng.string,
  count: gng.number.optional,
  children: gng.array.lengthOf(3).items(gng.object.keys({name: gng.string}))
})

validate({
  name: 'foo',
  count: 'not-a-number',
  children: [{name: 'bar'}, {name: 'baz'}]
}) // throws
```

### validate function parameters

You may wrap up a function up with a set of validator functions / schemas in order to validate any parameters before passing them to the wrapped function.

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

Using wrap, you can have a functional web component prop types checker that will work in any framework, non-framework, or non-non-framework.

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

If you're using `gonogo` as a tool during development, removing these assertions in production builds can get you back most of the bytes this library takes up (around 2,500 of them, after minification and gzip).

#### browserify

**BROWSERIFY INSTRUCTIONS WILL GO HERE MAYBE SOON BUT ALSO MAYBE NOT SOON**

#### webpack

**DITTO FOR WEBPACK**

## api

### usage

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

The validation function's `toString` method will be called and added to the thrown error. You may override `toString` to make validation failure reasons more clear:

``` js
const schema = (value) => value === 'pass'

schema.toString = () => '[the value "pass"]'

const validate = gng(schema)

validate('fail') // throws with message '...failed to satisfy [the value "pass"]'
```

### built-in validation functions

gonogo comes with a collection of validators with chainable methods to use in schemas.

There are seven base validators:

* [gng.any][#gngany]
* [gng.string][#gngstring]
* [gng.number][#gngnumber]
* [gng.boolean][#gngboolean]
* [gng.object][#gngobject]
* [gng.array][#gngarray]
* [gng.function][#gngfunction]

#### common methods

All base validators have certain methods available.

(These examples will use `gng.any`)

##### gng.[base].optional

Allows a value to be `undefined`

``` js
gng.any.optional('foo')     // true
gng.any.optional(undefined) // true
gng.any.optional(null)      // false
```

##### gng.[base].nullable

Allows a value to be `null`

``` js
gng.any.nullable('foo')     // true
gng.any.nullable(undefined) // false
gng.any.nullable(null)      // true
```
##### gng.[base].and

Tests that the value also passes a given predicate

``` js
const test = (value) => value === 'foo'

gng.any.and(test)('foo') // true
gng.any.and(test)('bar') // false
```

Since the built-in validators are just functions, you can pass them into the `and` method:

``` js
gng.any.and(gng.number)(42)    // true
gng.any.and(gng.number)('bar') // false
```

##### gng.[base].or

Tests that the value also passes a given predicate while allowing the base validation to fail

(Note: Because of the way validators are executed, the `or` test will run before the base test, which is probably opposite to what you expect. Sorry.)

``` js
const isFoo = (value) => value === 'foo'
const isBar = (value) => value === 'bar'

gng.any.and(isFoo).or(isBar)('foo') // true
gng.any.and(isFoo).or(isBar)('bar') // true
gng.any.and(isFoo).or(isBar)('baz') // false
```

Since the built-in validators are just functions, you can pass them into the `or` method:

``` js
gng.string.or(gng.number)('foo') // true
gng.string.or(gng.number)(42)    // true
gng.string.or(gng.number)(true)  // false
```

##### gng.[base].not

Tests that the value does not satisfy given predicate (the opposite of `and`)

``` js
const test = (value) => value === 'foo'

gng.any.not(test)('foo') // false
gng.any.not(test)('bar') // true
```

Since the built-in validators are just functions, you can pass them into the `pass` method:

``` js
gng.any.not(gng.number)(42)    // false
gng.any.not(gng.number)('bar') // true
```

##### gng.[base].values

Tests that a value is _strictly equal_ to at least one element of the given array

``` js
gng.any.values(['foo', 42])('foo') // true
gng.any.values(['foo', 42])(42)    // true
gng.any.values(['foo', 42])('bar') // false
```

#### gng.any

Tests that a given value exists (i.e. is not `null` or `undefined`). `gng.any` has all of the [common methods](#common-methods) available.

#### gng.string

Tests that a value is a string

``` js
gng.string('foo') // true
gng.string(12345) // false
```

`gng.string` has all of the [common methods](#common-methods) available as well as:

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

`gng.number` has all of the [common methods](#common-methods) available.

#### gng.boolean

Tests that a value is a boolean

``` js
gng.boolean(false) // true
gng.boolean('foo') // false
```

`gng.boolean` has all of the [common methods](#common-methods) available.

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
  foo: gng.string,
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

#### anything-at-all validator

Will pass anything, including `null` and `undefined`

``` js
gng.any.optional.nullable(ANYTHING_OR_NOTHING) // true
gng.any.or(() => true)(ANYTHING_OR_NOTHING)    // true
```

## related projects

* [React's PropTypes][react-prop-types]
* [joi][joi]
* [aproba][aproba]

[node]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/
[br]: http://browserify.org/
[wp]: https://webpack.github.io/
[react-prop-types]: https://facebook.github.io/react/docs/typechecking-with-proptypes.html
[joi]: https://github.com/hapijs/joi
[aproba]: https://github.com/iarna/aproba
[es2020]: https://github.com/yoshuawuyts/es2020
