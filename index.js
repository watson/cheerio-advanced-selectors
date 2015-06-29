'use strict'

var splitter = /^(.*?)(?:\:(eq|first|last)(?:\((\d+)\))?)(.*)/

exports.wrap = function (cheerio) {
  var load = cheerio.load

  cheerio.load = function () {
    var $ = load.apply(cheerio, arguments)
    return exports.find.bind(null, $)
  }

  return cheerio
}

exports.find = function ($, selector, context, root) {
  return exports.compile(selector)($, context, root)
}

exports.compile = function (selector) {
  var parts = []
  var match = selector.match(splitter)

  while (match) {
    parts.push(match[1])
    parts.push(exports['_' + match[2]](match[3]))
    selector = match[4].trim()
    match = selector.match(splitter)
  }
  parts.push(selector)
  selector = parts.shift()

  parts = parts.filter(function (part) {
    return part !== ''
  })

  return function ($, context, root) {
    return parts.reduce(function (cursor, part) {
      return typeof part === 'function' ? part(cursor) : cursor.find(part)
    }, $(selector, context, root))
  }
}

exports._eq = function (index) {
  index = parseInt(index, 10)
  return function (cursor) {
    return cursor.eq(index)
  }
}

exports._first = function () {
  return function (cursor) {
    return cursor.first()
  }
}

exports._last = function () {
  return function (cursor) {
    return cursor.last()
  }
}
