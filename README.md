# cheerio-advanced-selectors

Add advanced selector support to cheerio

[![Build status](https://travis-ci.org/watson/cheerio-advanced-selectors.svg?branch=master)](https://travis-ci.org/watson/cheerio-advanced-selectors)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

This module is inspired by
[cheerio-eq](https://github.com/watson/cheerio-eq) with the added
support for many different selectors.

## Installation

```
npm install cheerio-advanced-selectors
```

## Usage

Use the `.wrap()` function to make cheerio-advanced-selectors take care
of everything for you:

```js
var cheerio = require('cheerio')
var cheerioAdv = require('cheerio-advanced-selectors')

cheerio = cheerioAdv.wrap(cheerio)

var $ = cheerio.load('<div>foo</div><div>bar</div>')

$('div:first').text() // => 'foo'
```

Note that this will only work if the HTML is loaded using the `.load()`
function as seen above.

Alternatively use the `.find()` function to only use
cheerio-advanced-selectors for a specific selector:

```js
var cheerio = require('cheerio')
var cheerioAdv = require('cheerio-advanced-selectors')

var $ = cheerio.load('<div><span>foo</span></div><div><span>bar</span></div>')

cheerioAdv.find($, 'div:eq(1)').text() // => 'bar'
```

If you need to run the same selector on a lot of different HTML
documents, you can speed things up by pre-compiling the selector using
the `.compile()` function:

```js
var cheerio = require('cheerio')
var cheerioAdv = require('cheerio-advanced-selectors')

var myH1 = cheerioAdv.compile('div:first span:eq(1) h1')

var html1 = cheerio.load('<div><span><h1>foo1</h1></span><span><h1>bar1</h1></span></div>')
var html2 = cheerio.load('<div><span><h1>foo2</h1></span><span><h1>bar2</h1></span></div>')

myH1(html1).text() // => 'bar1'
myH1(html2).text() // => 'bar2'
```

## Supported advanced selectors

This module currently only support a minimal subset of the possible
advanced selectors:

- `:first`
- `:last`
- `:eq(index)`

But don't fear :) It's easy to add support for other selectors. Just
[open an
issue](https://github.com/watson/cheerio-advanced-selectors/issues) or
make a pull request.

## API

#### `.wrap(cheerio)`

Wraps the main cheerio module to overload the standard `load` function
so it knows how to handle the advanced selectors.

Returns the `cheerio` module.

#### `.find(cheerio, selector [, context [, root]])`

Run the `selector` on the given cheerio object optionally within the
given `context` and optionally on the given `root`.

The `cheerio` object is usually called `$`.

#### `.compile(selector)`

Compiles the `selector` and returns a function which take 3 arguments:
`fn(cheerio [, context [, root]])`:

- `cheerio` - a reference to the cheerio object (usually called `$`)
- `context` - the context in which to run the selector (optional)
- `root` - the HTML root on which to run the selector (optional)

## License

MIT
