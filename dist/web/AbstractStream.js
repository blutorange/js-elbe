"use strict";

require("core-js/modules/es6.array.find-index");

require("core-js/modules/es6.array.find");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.symbol");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var kagura_1 = require("kagura");

var Methods_1 = require("./Methods");

var AbstractStream =
/*#__PURE__*/
function () {
  function AbstractStream(iterable) {
    _classCallCheck(this, AbstractStream);

    this.done = false;
    this.iterable = iterable;
  }

  _createClass(AbstractStream, [{
    key: Symbol.iterator,
    value: function value() {
      this.check();
      return this.iterable[Symbol.iterator]();
    }
  }, {
    key: "collect",
    value: function collect(collector) {
      this.check();
      return Methods_1.collect(this.iterable, collector);
    }
  }, {
    key: "collectWith",
    value: function collectWith(supplier, accumulator, finisher) {
      this.check();
      return Methods_1.collectWith(this.iterable, supplier, accumulator, finisher);
    }
  }, {
    key: "end",
    value: function end() {
      this.check();
      Methods_1.end(this.iterable);
    }
  }, {
    key: "every",
    value: function every(predicate) {
      this.check();
      return Methods_1.every(this.iterable, predicate);
    }
  }, {
    key: "find",
    value: function find(predicate) {
      this.check();
      return Methods_1.find(this.iterable, predicate);
    }
  }, {
    key: "findIndex",
    value: function findIndex(predicate) {
      this.check();
      return Methods_1.findIndex(this.iterable, predicate);
    }
  }, {
    key: "first",
    value: function first() {
      this.check();
      return Methods_1.first(this.iterable);
    }
  }, {
    key: "forEach",
    value: function forEach(consumer) {
      this.check();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.iterable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _item = _step.value;
          consumer(_item);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "fork",
    value: function fork() {
      this.check();
      this.done = false;
      var iterable = Methods_1.fork(this.iterable);
      this.iterable = iterable;
      return this.clone(iterable);
    }
  }, {
    key: "group",
    value: function group(classifier) {
      this.check();
      return Methods_1.group(this.iterable, classifier);
    }
  }, {
    key: "has",
    value: function has(object) {
      this.check();
      return Methods_1.has(this.iterable, object);
    }
  }, {
    key: "join",
    value: function join() {
      var delimiter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var prefix = arguments.length > 1 ? arguments[1] : undefined;
      var suffix = arguments.length > 2 ? arguments[2] : undefined;
      this.check();
      return Methods_1.join(this.iterable, delimiter, prefix, suffix);
    }
  }, {
    key: "last",
    value: function last() {
      this.check();
      return Methods_1.last(this.iterable);
    }
  }, {
    key: "nth",
    value: function nth(n) {
      this.check();
      return Methods_1.nth(this.iterable, n);
    }
  }, {
    key: "max",
    value: function max() {
      var comparator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : kagura_1.natural;
      this.check();
      return Methods_1.max(this.iterable, comparator);
    }
  }, {
    key: "maxBy",
    value: function maxBy(sortKey) {
      this.check();
      return Methods_1.maxBy(this.iterable, sortKey);
    }
  }, {
    key: "min",
    value: function min() {
      var comparator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : kagura_1.natural;
      this.check();
      return Methods_1.min(this.iterable, comparator);
    }
  }, {
    key: "minBy",
    value: function minBy(sortKey) {
      this.check();
      return Methods_1.minBy(this.iterable, sortKey);
    }
  }, {
    key: "partition",
    value: function partition(predicate) {
      this.check();
      return Methods_1.partition(this.iterable, predicate);
    }
  }, {
    key: "reduce",
    value: function reduce(reducer, initialValue) {
      this.check();
      return Methods_1.reduce(this.iterable, reducer, initialValue);
    }
  }, {
    key: "reduceSame",
    value: function reduceSame(reducer) {
      this.check();
      return Methods_1.reduceSame(this.iterable, reducer);
    }
  }, {
    key: "size",
    value: function size() {
      this.check();
      return Methods_1.size(this.iterable);
    }
  }, {
    key: "some",
    value: function some(predicate) {
      this.check();
      return Methods_1.some(this.iterable, predicate);
    }
  }, {
    key: "sum",
    value: function sum(converter) {
      this.check();
      return Methods_1.sum(this.iterable, converter);
    }
  }, {
    key: "toArray",
    value: function toArray(fresh) {
      this.check();
      return Methods_1.toArray(this.iterable, fresh);
    }
  }, {
    key: "toSet",
    value: function toSet(fresh) {
      this.check();
      return Methods_1.toSet(this.iterable, fresh);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.toArray();
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Stream[done=".concat(this.done, "]");
    }
  }, {
    key: "toMap",
    value: function toMap(keyMapper, valueMapper) {
      this.check();
      return Methods_1.toMap(this.iterable, keyMapper, valueMapper);
    }
  }, {
    key: "tryCompute",
    value: function tryCompute(operation) {
      this.check();
      return Methods_1.tryCompute(this.iterable, operation);
    }
  }, {
    key: "tryEnd",
    value: function tryEnd() {
      this.check();
      return Methods_1.tryEnd(this.iterable);
    }
  }, {
    key: "check",
    value: function check() {
      if (this.done) {
        throw new Error("Stream was already consumed.");
      }

      this.done = true;
    }
  }]);

  return AbstractStream;
}();

exports.AbstractStream = AbstractStream;