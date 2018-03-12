# cheerio-advanced-selectors

Add support for the following selectors to
[cheerio](https://github.com/cheeriojs/cheerio):

- `:first`
- `:last`
- `:eq(index)`

More selectors can easily be added: Just [open an issue](https://github.com/watson/cheerio-advanced-selectors/issues) and I'll look into it :)

[![Build status](https://travis-ci.org/watson/cheerio-advanced-selectors.svg?branch=master)](https://travis-ci.org/watson/cheerio-advanced-selectors)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

This module is inspired by
[cheerio-eq](https://github.com/watson/cheerio-eq) with the added
support for many different selectors.

Supports cheerio version 0.18.0 and above.

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

## Advanced usage

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

## What's the problem?

Cheerio sacrifices advanced CSS selector support for speed. This means
for instance that the `:eq()` selector isn't supported. The work-around
is normally to use the `.eq()` function instead:

```js
// this will not work:
$('div:eq(1)');

// use this instead:
$('div').eq(1);
```

This is a good alternative if you write the CSS selectors from scrach,
but what if you are working with selectors that already contain `:eq()`?
**Don't fear, cheerio-advanced-selectors is here :)**

### Solution

The solution to the problem is to automatically parse the selector
string at run-time. So if you give cheerio-advanced-selectors a selector
like `div:eq(1)` it will return the following cheerio cursor:
`$('div').eq(1)`.

It also works for complex selectors, so that `div:eq(1) h2:first span`
will be converted and interpreted as
`$('div').eq(1).find('h2').first().find('span')`.

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
