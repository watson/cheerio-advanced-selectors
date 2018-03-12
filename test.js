'use strict'

var test = require('tape')
var cheerio = require('cheerio')
var cheerioAdv = require('./')

test('#compile()', function (t) {
  t.test('Non-advanced selector', function (t) {
    var compiled = cheerioAdv.compile('div')
    var html, $

    html = '<div>foo1</div><div>bar1</div>'
    $ = cheerio.load(html)
    t.equal(compiled($).text(), 'foo1bar1')

    html = '<div>foo2</div><div>bar2</div>'
    $ = cheerio.load(html)
    t.equal(compiled($).text(), 'foo2bar2')

    t.end()
  })

  t.test('Simple selector ending in :first()', function (t) {
    var compiled = cheerioAdv.compile('div:first')
    var html, $

    html = '<div>foo1</div><div>bar1</div>'
    $ = cheerio.load(html)
    t.equal(compiled($).text(), 'foo1')

    html = '<div>foo2</div><div>bar2</div>'
    $ = cheerio.load(html)
    t.equal(compiled($).text(), 'foo2')

    t.end()
  })

  t.test('Custom context', function (t) {
    var compiled = cheerioAdv.compile('div:eq(1)')
    var html

    html = '<div>foo1</div><div>bar1</div>'
    t.equal(compiled(cheerio, html).text(), 'bar1')

    html = '<div>foo2</div><div>bar2</div>'
    t.equal(compiled(cheerio, html).text(), 'bar2')

    t.end()
  })

  t.test('Custom root', function (t) {
    var compiled = cheerioAdv.compile('span:eq(1)')
    var html

    html = '<div><span>foo1</span></div><div><span>bar1</span></div>'
    t.equal(compiled(cheerio, 'div', html).text(), 'bar1')

    html = '<div><span>foo2</span></div><div><span>bar2</span></div>'
    t.equal(compiled(cheerio, 'div', html).text(), 'bar2')

    t.end()
  })
})

var testCases = [
  ['Non-advanced selector', '<div>foo</div><div>bar</div>', 'div', 'foobar'],
  ['Simple selector ending in :first()', '<div>foo</div><div>bar</div>', 'div:first', 'foo'],
  ['Simple selector ending in :last()', '<div>foo</div><div>bar</div>', 'div:last', 'bar'],
  ['Simple selector ending in :first-child()', '<div><span>foo</span><span>bar</span></div>', 'div span:first-child', 'foo'],
  ['Simple selector ending in :last-child()', '<div><span>foo</span><span>bar</span></div>', 'div span:last-child', 'bar'],
  ['Simple selector ending in :eq()', '<div>foo</div><div>bar</div>', 'div:eq(1)', 'bar'],
  ['Simple selector with :eq() in the middle', '<div><span>foo</span></div><div><span>bar</span></div>', 'div:eq(0) span', 'foo'],
  ['Complex selector', '<div><span><h1>foo</h1></span><span><h1>bar</h1></span></div>', 'div:first span:eq(1) h1', 'bar']
]

test('#find()', function (t) {
  testCases.forEach(function (testCase) {
    t.test(testCase[0], function (t) {
      var $ = cheerio.load(testCase[1])
      t.equal(cheerioAdv.find($, testCase[2]).text(), testCase[3])
      t.end()
    })
  })

  t.test('Custom context', function (t) {
    var html = '<div>foo</div><div>bar</div>'
    t.equal(cheerioAdv.find(cheerio, 'div:eq(1)', html).text(), 'bar')
    t.end()
  })

  t.test('Custom root', function (t) {
    var html = '<div><span>foo</span></div><div><span>bar</span></div>'
    t.equal(cheerioAdv.find(cheerio, 'span:eq(1)', 'div', html).text(), 'bar')
    t.end()
  })
})

test('#wrap() -> call static cheerio function', function (t) {
  var html = '<div>foo</div><div>bar</div>'
  var $ = cheerio.load(html)
  var $adv = cheerioAdv.wrap(cheerio).load(html)

  t.equal(typeof $.html(), 'string')
  t.ok($.html().length > 0)
  t.equal($adv.html(), $.html())
  t.end()
})

test('#wrap() -> call prototype cheerio function', function (t) {
  var html = '<div>foo</div><div>bar</div>'
  var $ = cheerio.load(html)
  var $adv = cheerioAdv.wrap(cheerio).load(html)

  t.equal(typeof $('div').splice, 'function')
  t.equal(typeof $adv('div').splice, 'function')
  t.end()
})

test('#wrap() -> #load()', function (t) {
  testCases.forEach(function (testCase) {
    t.test(testCase[0], function (t) {
      var wrapped = cheerioAdv.wrap(cheerio)
      var $ = wrapped.load(testCase[1])
      t.equal($(testCase[2]).text(), testCase[3])
      t.end()
    })
  })

  t.test('this as selector', function (t) {
    t.plan(2)

    var wrapped = cheerioAdv.wrap(cheerio)
    var $ = wrapped.load('<div>foo</div><div>bar</div>')
    var results = ['foo', 'bar']

    $('div').each(function () {
      t.equal($(this).text(), results.shift())
    })
  })
})

test('#wrap() -> #()', function (t) {
  testCases.forEach(function (testCase) {
    t.test(testCase[0], function (t) {
      var wrapped = cheerioAdv.wrap(cheerio)
      t.equal(wrapped(testCase[2], testCase[1]).text(), testCase[3])
      t.end()
    })
  })

  t.test('this as selector', function (t) {
    t.plan(2)

    var wrapped = cheerioAdv.wrap(cheerio)
    var html = '<div>foo</div><div>bar</div>'
    var results = ['foo', 'bar']

    wrapped('div', html).each(function () {
      t.equal(wrapped(this).text(), results.shift())
    })
  })
})
