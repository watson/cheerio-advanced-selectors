'use strict'

var util = require('util')

var splitter = /^(.*?)(?::(eq|(?:(?:first|last)(?!-child)))(?:\((\d+)\))?)(.*)/

exports.wrap = function (Cheerio) {
  function CheerioAdv (selector, context, root, opts) {
    if (!(this instanceof CheerioAdv)) return new CheerioAdv(selector, context, root, opts)

    if (typeof selector === 'string' && splitter.test(selector)) {
      var steps = split(selector)
      var cursor = Cheerio(steps.shift(), context, root, opts)
      return execSteps(cursor, steps)
    }

    return Cheerio.apply(Cheerio, arguments)
  }

  util.inherits(CheerioAdv, Cheerio)

  CheerioAdv.load = function () {
    var $ = Cheerio.load.apply(Cheerio, arguments)

    function AdvInitialize (selector, context, root) {
      if (typeof selector === 'string') return exports.find($, selector, context, root)
      return $.apply(Cheerio, arguments)
    }

    Object.keys($).forEach(function (key) {
      AdvInitialize[key] = $[key]
    })

    return AdvInitialize
  }

  return CheerioAdv
}

exports.find = function ($, selector, context, root) {
  return exports.compile(selector)($, context, root)
}

exports.compile = function (selector) {
  var steps = split(selector)
  selector = steps.shift()

  return function ($, context, root) {
    var cursor = $(selector, context, root)
    return execSteps(cursor, steps)
  }
}

var split = function (selector) {
  var steps = []
  var match = selector.match(splitter)

  while (match) {
    steps.push(match[1])
    steps.push(selectors[match[2]](match[3]))
    selector = match[4].trim()
    match = selector.match(splitter)
  }

  steps.push(selector)

  return steps.filter(function (step) {
    return step !== ''
  })
}

var execSteps = function (cursor, steps) {
  return steps.reduce(function (cursor, step) {
    return typeof step === 'function' ? step(cursor) : cursor.find(step)
  }, cursor)
}

var selectors = {
  eq: function (index) {
    index = parseInt(index, 10)
    return function (cursor) {
      return cursor.eq(index)
    }
  },

  first: function () {
    return function (cursor) {
      return cursor.first()
    }
  },

  last: function () {
    return function (cursor) {
      return cursor.last()
    }
  }
}
