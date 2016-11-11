# gonogo

> Simple, lightweight object validation

gonogo is a simple assertion module to easily validate web component properties during development and that's easy to remove during production builds. It's simple enough that you could probably use it for any simple object validation needs.

## install

Install using [npm] for use with [Node.js][node] and browsers with [Browserify][br], [webpack][wp], et. al.

``` shell
$ npm install --save-dev gonogo
```

## usage

``` js
const gng = require('gonogo')

const target = {
  name: 'foo',
  count: 'not-a-number',
  children: [{name: 'bar'}, {name: 'baz'}]
}

const validate = gng({
  name: gng.string,
  count: gng.number
  children: gng.array.with(gng.object.with({name: gng.string}))
})

validate(target)
// throws
```

### wrap a function

``` js
const gng = require('gonogo')
const wrap = require('gonogo/wrap')

const Component = (props) => {
  const el = document.createElement('div')
  const text = document.createTextNode(props.text)

  el.appendChild(text)

  return el
}

const render = wrap(Component, {
  text: gng.string
})

render({text: 7})
// throws
```

### production builds

You probably want to remove these assertions in production builds

#### browserify

browserify -t gonogo/ungonogoify entry.js

## api

`validate: function = gng(schema: object|function, [options: object])`

gonogo takes a schema object or validation function. It returns a function that you may use to validate a target object. If the object is not valid, gonogo will throw.

If the schema is a validation function, the target will be passed to the schema and a true / false return value will determine if the target is valid. If the schema is an object, each key of the schema should be a validation function. Those keys will be used to validate the values of the target.


Example with schema function:

``` js

```

Example with schema object:

``` js

```

### built-in validation functions

#### gng.string

#### gng.number

#### gng.function

#### gng.array

#### gng.object

#### gng.pass

[node]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/
[br]: http://browserify.org/
[wp]: https://webpack.github.io/
