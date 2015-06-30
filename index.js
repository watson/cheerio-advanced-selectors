'use strict'

var splitter = /^(.*?)(?:\:(eq|first|last)(?:\((\d+)\))?)(.*)/

exports.wrap = function (cheerio) {
  var load = cheerio.load

  cheerio.load = function () {
    var $ = load.apply(cheerio, arguments)
    return function (selector, context, root) {
      if (typeof selector === 'object') return $.apply(cheerio, arguments)
      else return exports.find($, selector, context, root)
    }
  }

  return cheerio
}

exports.find = function ($, selector, context, root) {
  return exports.compile(selector)($, context, root)
}

exports.compile = function (selector) {
  var steps = []
  var match = selector.match(splitter)

  while (match) {
    steps.push(match[1])
    steps.push(exports['_' + match[2]](match[3]))
    selector = match[4].trim()
    match = selector.match(splitter)
  }
  steps.push(selector)
  selector = steps.shift()

  steps = steps.filter(function (step) {
    return step !== ''
  })

  return function ($, context, root) {
    return steps.reduce(function (cursor, step) {
      return typeof step === 'function' ? step(cursor) : cursor.find(step)
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
