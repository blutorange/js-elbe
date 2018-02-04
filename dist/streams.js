(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Streams = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var comparators_1 = require("comparators");

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
    key: "check",
    value: function check() {
      if (this.done) {
        throw new Error("Stream was already consumed.");
      }

      this.done = true;
    }
  }, {
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
      var comparator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : comparators_1.natural;
      this.check();
      return Methods_1.max(this.iterable, comparator);
    }
  }, {
    key: "min",
    value: function min() {
      var comparator = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : comparators_1.natural;
      this.check();
      return Methods_1.min(this.iterable, comparator);
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
    value: function toArray() {
      this.check();
      return Methods_1.toArray(this.iterable);
    }
  }, {
    key: "toSet",
    value: function toSet() {
      this.check();
      return Methods_1.toSet(this.iterable);
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
  }]);

  return AbstractStream;
}();

exports.AbstractStream = AbstractStream;
},{"./Methods":4,"comparators":10,"core-js/modules/es6.array.find":86,"core-js/modules/es6.array.find-index":85,"core-js/modules/es6.symbol":94,"core-js/modules/web.dom.iterable":95}],2:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.map");

require("core-js/modules/es6.set");

function _sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return _sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Methods_1 = require("./Methods");

function identity() {
  return function (x) {
    return x;
  };
}

function toNumber() {
  return function (x) {
    return Number(x);
  };
}

var StatisticsImpl =
/*#__PURE__*/
function () {
  function StatisticsImpl() {
    _classCallCheck(this, StatisticsImpl);

    this._count = 0;
    this._sum = 0;
    this._sum2 = 0;
    this._min = undefined;
    this._max = undefined;
  }

  _createClass(StatisticsImpl, [{
    key: "accept",
    value: function accept(value) {
      this._sum += value;
      this._sum2 += value * value;

      if (this._count > 0) {
        this._max = Math.max(this._max, value);
        this._min = Math.min(this._min, value);
      } else {
        this._min = this._max = value;
      }

      this._count += 1;
    }
  }, {
    key: "average",
    get: function get() {
      return this._count > 0 ? this._sum / this._count : 0;
    }
  }, {
    key: "count",
    get: function get() {
      return this._count;
    }
  }, {
    key: "max",
    get: function get() {
      return this._max;
    }
  }, {
    key: "min",
    get: function get() {
      return this._min;
    }
  }, {
    key: "sum",
    get: function get() {
      return this._sum;
    }
  }, {
    key: "variance",
    get: function get() {
      if (this._count === 0) {
        return Infinity;
      }

      var average = this.average;
      return this._sum2 / this._count - average * average;
    }
  }]);

  return StatisticsImpl;
}();

exports.Collectors = {
  toArray: function toArray() {
    return {
      accumulator: function accumulator(collected, item) {
        collected.push(item);
      },
      supplier: function supplier() {
        return [];
      },
      finisher: identity()
    };
  },
  count: function count() {
    return {
      accumulator: function accumulator(collected, item) {
        collected.count += 1;
      },
      supplier: function supplier() {
        return {
          count: 0
        };
      },
      finisher: function finisher(result) {
        return result.count;
      }
    };
  },
  toSet: function toSet() {
    return {
      accumulator: function accumulator(collected, item) {
        collected.add(item);
      },
      supplier: function supplier() {
        return new Set();
      },
      finisher: identity()
    };
  },
  toMap: function toMap(keyMapper, valueMapper) {
    return {
      accumulator: function accumulator(collected, item) {
        collected.set(keyMapper(item), valueMapper(item));
      },
      supplier: function supplier() {
        return new Map();
      },
      finisher: identity()
    };
  },
  group: function group(classifier) {
    return {
      accumulator: function accumulator(collected, item) {
        var key = classifier(item);
        var list = collected.get(key);

        if (list === undefined) {
          collected.set(key, [item]);
        } else {
          list.push(item);
        }
      },
      supplier: function supplier() {
        return new Map();
      },
      finisher: identity()
    };
  },
  groupDown: function groupDown(classifier, downstream) {
    return {
      accumulator: function accumulator(collected, item) {
        var key = classifier(item);
        var list = collected.get(key);

        if (list === undefined) {
          collected.set(key, [item]);
        } else {
          list.push(item);
        }
      },
      supplier: function supplier() {
        return new Map();
      },
      finisher: function finisher(result) {
        var x = new Map();
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = result.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ref3 = _step.value;

            var _ref2 = _slicedToArray(_ref3, 2);

            var _key = _ref2[0];
            var _value = _ref2[1];
            x.set(_key, Methods_1.collect(_value[Symbol.iterator](), downstream));
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

        return x;
      }
    };
  },
  join: function join() {
    var delimiter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var prefix = arguments.length > 1 ? arguments[1] : undefined;
    var suffix = arguments.length > 2 ? arguments[2] : undefined;
    return {
      accumulator: function accumulator(collected, item) {
        collected.push(String(item));
      },
      supplier: function supplier() {
        return prefix != undefined ? [prefix] : [];
      },
      finisher: function finisher(result) {
        return result.join(delimiter);
      }
    };
  },
  sum: function sum() {
    var converter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : toNumber();
    return {
      accumulator: function accumulator(collected, item) {
        collected.sum += converter(item);
      },
      supplier: function supplier() {
        return {
          sum: 0
        };
      },
      finisher: function finisher(result) {
        return result.sum;
      }
    };
  },
  average: function average() {
    var converter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : toNumber();
    return {
      accumulator: function accumulator(collected, item) {
        collected.sum += converter(item);
        collected.count += 1;
      },
      supplier: function supplier() {
        return {
          sum: 0,
          count: 0
        };
      },
      finisher: function finisher(result) {
        return result.count > 0 ? result.sum / result.count : 0;
      }
    };
  },
  averageGeometrically: function averageGeometrically() {
    var converter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : toNumber();
    return {
      accumulator: function accumulator(collected, item) {
        collected.product *= converter(item);
        collected.count += 1;
      },
      supplier: function supplier() {
        return {
          product: 1,
          count: 0
        };
      },
      finisher: function finisher(result) {
        return result.count > 0 ? result.product / result.count : 0;
      }
    };
  },
  averageHarmonically: function averageHarmonically() {
    var converter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : toNumber();
    return {
      accumulator: function accumulator(collected, item) {
        collected.sum += 1.0 / converter(item);
        collected.count += 1;
      },
      supplier: function supplier() {
        return {
          sum: 0,
          count: 0
        };
      },
      finisher: function finisher(result) {
        return result.count / result.sum;
      }
    };
  },
  summarize: function summarize() {
    var converter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : toNumber();
    return {
      accumulator: function accumulator(collected, item) {
        collected.accept(converter(item));
      },
      supplier: function supplier() {
        return new StatisticsImpl();
      },
      finisher: identity()
    };
  },
  factor: function factor() {
    return {
      accumulator: function accumulator(collected, item) {
        collected.product *= Number(item);
      },
      supplier: function supplier() {
        return {
          product: 1
        };
      },
      finisher: function finisher(result) {
        return result.product;
      }
    };
  },
  partition: function partition(predicate) {
    return {
      accumulator: function accumulator(collected, item) {
        if (predicate(item)) {
          collected.true.push(item);
        } else {
          collected.false.push(item);
        }
      },
      supplier: function supplier() {
        return {
          false: [],
          true: []
        };
      },
      finisher: identity()
    };
  },
  partitionDown: function partitionDown(predicate, downstream) {
    return {
      accumulator: function accumulator(collected, item) {
        if (predicate(item)) {
          collected.true.push(item);
        } else {
          collected.false.push(item);
        }
      },
      supplier: function supplier() {
        return {
          false: [],
          true: []
        };
      },
      finisher: function finisher(result) {
        return {
          false: Methods_1.collect(result.false, downstream),
          true: Methods_1.collect(result.true, downstream)
        };
      }
    };
  }
};
},{"./Methods":4,"core-js/modules/es6.map":90,"core-js/modules/es6.set":92,"core-js/modules/es6.symbol":94,"core-js/modules/web.dom.iterable":95}],3:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.object.set-prototype-of");

require("core-js/modules/es6.array.sort");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Methods_1 = require("./Methods");

var AbstractStream_1 = require("./AbstractStream");

var InplaceStream =
/*#__PURE__*/
function (_AbstractStream_1$Abs) {
  _inherits(InplaceStream, _AbstractStream_1$Abs);

  function InplaceStream() {
    _classCallCheck(this, InplaceStream);

    return _possibleConstructorReturn(this, (InplaceStream.__proto__ || Object.getPrototypeOf(InplaceStream)).apply(this, arguments));
  }

  _createClass(InplaceStream, [{
    key: "chunk",
    value: function chunk(classifier) {
      this.iterable = Methods_1.chunk(this.iterable, classifier);
      return this;
    }
  }, {
    key: "concat",
    value: function concat() {
      for (var _len = arguments.length, iterables = new Array(_len), _key = 0; _key < _len; _key++) {
        iterables[_key] = arguments[_key];
      }

      this.iterable = Methods_1.concat.apply(Methods_1, [this.iterable].concat(iterables));
      return this;
    }
  }, {
    key: "cycle",
    value: function cycle(count) {
      this.iterable = Methods_1.cycle(this.iterable, count);
      return this;
    }
  }, {
    key: "flatMap",
    value: function flatMap(mapper) {
      this.iterable = Methods_1.flatMap(this.iterable, mapper);
      return this;
    }
  }, {
    key: "filter",
    value: function filter(predicate) {
      this.iterable = Methods_1.filter(this.iterable, predicate);
      return this;
    }
  }, {
    key: "index",
    value: function index() {
      this.iterable = Methods_1.index(this.iterable);
      return this;
    }
  }, {
    key: "limit",
    value: function limit(limitTo) {
      this.iterable = Methods_1.limit(this.iterable, limitTo);
      return this;
    }
  }, {
    key: "map",
    value: function map(mapper) {
      this.iterable = Methods_1.map(this.iterable, mapper);
      return this;
    }
  }, {
    key: "visit",
    value: function visit(consumer) {
      this.iterable = Methods_1.visit(this.iterable, consumer);
      return this;
    }
  }, {
    key: "reverse",
    value: function reverse() {
      this.iterable = Methods_1.reverse(this.iterable);
      return this;
    }
  }, {
    key: "skip",
    value: function skip(toSkip) {
      this.iterable = Methods_1.skip(this.iterable, toSkip);
      return this;
    }
  }, {
    key: "slice",
    value: function slice(sliceSize) {
      this.iterable = Methods_1.slice(this.iterable, sliceSize);
      return this;
    }
  }, {
    key: "sort",
    value: function sort(comparator) {
      this.iterable = Methods_1.sort(this.iterable, comparator);
      return this;
    }
  }, {
    key: "try",
    value: function _try(operation) {
      var x = Methods_1.tryMap(this.iterable, operation);
      return new TryStreamImpl(x);
    }
  }, {
    key: "unique",
    value: function unique(keyExtractor) {
      this.iterable = Methods_1.unique(this.iterable, keyExtractor);
      return this;
    }
  }, {
    key: "zip",
    value: function zip(other) {
      this.iterable = Methods_1.zip(this.iterable, other);
      return this;
    }
  }, {
    key: "zipSame",
    value: function zipSame() {
      for (var _len2 = arguments.length, others = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        others[_key2] = arguments[_key2];
      }

      this.iterable = Methods_1.zipSame(this.iterable, others);
      return this;
    }
  }]);

  return InplaceStream;
}(AbstractStream_1.AbstractStream);

exports.InplaceStream = InplaceStream;
;

var TryStreamImpl =
/*#__PURE__*/
function (_InplaceStream) {
  _inherits(TryStreamImpl, _InplaceStream);

  function TryStreamImpl() {
    _classCallCheck(this, TryStreamImpl);

    return _possibleConstructorReturn(this, (TryStreamImpl.__proto__ || Object.getPrototypeOf(TryStreamImpl)).apply(this, arguments));
  }

  _createClass(TryStreamImpl, [{
    key: "forEachResult",
    value: function forEachResult(success, error) {
      if (error === undefined) {
        error = console.error;
      }

      return this.forEach(function (x) {
        return x.ifPresent(success, error);
      });
    }
  }, {
    key: "include",
    value: function include(predicate) {
      return this.visit(function (x) {
        return x.include(predicate);
      });
    }
  }, {
    key: "onError",
    value: function onError(handler) {
      return this.visit(function (x) {
        return x.ifAbsent(function (e) {
          return handler(e);
        });
      });
    }
  }, {
    key: "onSuccess",
    value: function onSuccess(success, failure) {
      return this.visit(function (x) {
        return x.ifPresent(success, failure);
      });
    }
  }, {
    key: "orThrow",
    value: function orThrow() {
      return this.map(function (x) {
        return x.orThrow();
      });
    }
  }, {
    key: "orElse",
    value: function orElse(backup) {
      return this.map(function (x) {
        return x.orElse(backup);
      });
    }
  }, {
    key: "discardError",
    value: function discardError() {
      var handler = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : console.error;
      return this.onError(handler).filter(function (x) {
        return x.success;
      }).orThrow();
    }
  }, {
    key: "flatConvert",
    value: function flatConvert(operation, backup) {
      this.iterable = Methods_1.map(this.iterable, function (x) {
        return x.flatConvert(operation, backup);
      });
      return this;
    }
  }, {
    key: "convert",
    value: function convert(operation, backup) {
      this.iterable = Methods_1.map(this.iterable, function (x) {
        return x.convert(operation, backup);
      });
      return this;
    }
  }, {
    key: "orTry",
    value: function orTry(backup) {
      this.iterable = Methods_1.map(this.iterable, function (y) {
        return y.orTry(backup);
      });
      return this;
    }
  }]);

  return TryStreamImpl;
}(InplaceStream);
},{"./AbstractStream":1,"./Methods":4,"core-js/modules/es6.array.sort":89,"core-js/modules/es6.object.set-prototype-of":91,"core-js/modules/es6.symbol":94}],4:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.set");

require("core-js/modules/es6.array.sort");

require("core-js/modules/es6.array.from");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("regenerator-runtime/runtime");

var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(map),
    _marked2 =
/*#__PURE__*/
regeneratorRuntime.mark(flatMap),
    _marked3 =
/*#__PURE__*/
regeneratorRuntime.mark(chunk),
    _marked4 =
/*#__PURE__*/
regeneratorRuntime.mark(slice),
    _marked5 =
/*#__PURE__*/
regeneratorRuntime.mark(zip),
    _marked6 =
/*#__PURE__*/
regeneratorRuntime.mark(zipSame),
    _marked7 =
/*#__PURE__*/
regeneratorRuntime.mark(filter),
    _marked8 =
/*#__PURE__*/
regeneratorRuntime.mark(tryMap),
    _marked9 =
/*#__PURE__*/
regeneratorRuntime.mark(unique),
    _marked10 =
/*#__PURE__*/
regeneratorRuntime.mark(index),
    _marked11 =
/*#__PURE__*/
regeneratorRuntime.mark(limit),
    _marked12 =
/*#__PURE__*/
regeneratorRuntime.mark(cycle),
    _marked13 =
/*#__PURE__*/
regeneratorRuntime.mark(visit),
    _marked14 =
/*#__PURE__*/
regeneratorRuntime.mark(skip),
    _marked15 =
/*#__PURE__*/
regeneratorRuntime.mark(reverse),
    _marked16 =
/*#__PURE__*/
regeneratorRuntime.mark(concat),
    _marked17 =
/*#__PURE__*/
regeneratorRuntime.mark(fromObject),
    _marked18 =
/*#__PURE__*/
regeneratorRuntime.mark(fromObjectKeys),
    _marked19 =
/*#__PURE__*/
regeneratorRuntime.mark(fromObjectValues),
    _marked20 =
/*#__PURE__*/
regeneratorRuntime.mark(generate),
    _marked21 =
/*#__PURE__*/
regeneratorRuntime.mark(times),
    _marked22 =
/*#__PURE__*/
regeneratorRuntime.mark(repeat),
    _marked23 =
/*#__PURE__*/
regeneratorRuntime.mark(iterate);

Object.defineProperty(exports, "__esModule", {
  value: true
});

var comparators_1 = require("comparators");

var Collectors_1 = require("./Collectors");

var TryFactory_1 = require("./TryFactory");

var hasOwnProperty = Object.prototype.hasOwnProperty;

function map(iterable, mapper) {
  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _item;

  return regeneratorRuntime.wrap(function map$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 3;
          _iterator = iterable[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 12;
            break;
          }

          _item = _step.value;
          _context.next = 9;
          return mapper(_item);

        case 9:
          _iteratorNormalCompletion = true;
          _context.next = 5;
          break;

        case 12:
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](3);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 18:
          _context.prev = 18;
          _context.prev = 19;

          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }

        case 21:
          _context.prev = 21;

          if (!_didIteratorError) {
            _context.next = 24;
            break;
          }

          throw _iteratorError;

        case 24:
          return _context.finish(21);

        case 25:
          return _context.finish(18);

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, this, [[3, 14, 18, 26], [19,, 21, 25]]);
}

exports.map = map;

function flatMap(iterable, mapper) {
  var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _item2, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _i;

  return regeneratorRuntime.wrap(function flatMap$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context2.prev = 3;
          _iterator2 = iterable[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context2.next = 36;
            break;
          }

          _item2 = _step2.value;
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context2.prev = 10;
          _iterator3 = mapper(_item2)[Symbol.iterator]();

        case 12:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context2.next = 19;
            break;
          }

          _i = _step3.value;
          _context2.next = 16;
          return _i;

        case 16:
          _iteratorNormalCompletion3 = true;
          _context2.next = 12;
          break;

        case 19:
          _context2.next = 25;
          break;

        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](10);
          _didIteratorError3 = true;
          _iteratorError3 = _context2.t0;

        case 25:
          _context2.prev = 25;
          _context2.prev = 26;

          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }

        case 28:
          _context2.prev = 28;

          if (!_didIteratorError3) {
            _context2.next = 31;
            break;
          }

          throw _iteratorError3;

        case 31:
          return _context2.finish(28);

        case 32:
          return _context2.finish(25);

        case 33:
          _iteratorNormalCompletion2 = true;
          _context2.next = 5;
          break;

        case 36:
          _context2.next = 42;
          break;

        case 38:
          _context2.prev = 38;
          _context2.t1 = _context2["catch"](3);
          _didIteratorError2 = true;
          _iteratorError2 = _context2.t1;

        case 42:
          _context2.prev = 42;
          _context2.prev = 43;

          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }

        case 45:
          _context2.prev = 45;

          if (!_didIteratorError2) {
            _context2.next = 48;
            break;
          }

          throw _iteratorError2;

        case 48:
          return _context2.finish(45);

        case 49:
          return _context2.finish(42);

        case 50:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked2, this, [[3, 38, 42, 50], [10, 21, 25, 33], [26,, 28, 32], [43,, 45, 49]]);
}

exports.flatMap = flatMap;

function chunk(iterable, classifier) {
  var currentClass, first, index, chunk, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _item3, clazz;

  return regeneratorRuntime.wrap(function chunk$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          currentClass = undefined;
          first = true;
          index = -1;
          chunk = [];
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context3.prev = 7;
          _iterator4 = iterable[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            _context3.next = 22;
            break;
          }

          _item3 = _step4.value;
          clazz = classifier(_item3, ++index);

          if (!(!first && currentClass !== clazz)) {
            _context3.next = 16;
            break;
          }

          _context3.next = 15;
          return chunk;

        case 15:
          chunk = [];

        case 16:
          first = false;
          currentClass = clazz;
          chunk.push(_item3);

        case 19:
          _iteratorNormalCompletion4 = true;
          _context3.next = 9;
          break;

        case 22:
          _context3.next = 28;
          break;

        case 24:
          _context3.prev = 24;
          _context3.t0 = _context3["catch"](7);
          _didIteratorError4 = true;
          _iteratorError4 = _context3.t0;

        case 28:
          _context3.prev = 28;
          _context3.prev = 29;

          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }

        case 31:
          _context3.prev = 31;

          if (!_didIteratorError4) {
            _context3.next = 34;
            break;
          }

          throw _iteratorError4;

        case 34:
          return _context3.finish(31);

        case 35:
          return _context3.finish(28);

        case 36:
          if (!(chunk.length > 0)) {
            _context3.next = 39;
            break;
          }

          _context3.next = 39;
          return chunk;

        case 39:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked3, this, [[7, 24, 28, 36], [29,, 31, 35]]);
}

exports.chunk = chunk;

function slice(iterable, sliceSize) {
  var count, chunk, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _item4;

  return regeneratorRuntime.wrap(function slice$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          sliceSize = Math.max(sliceSize, 1);
          count = sliceSize;
          chunk = [];
          _iteratorNormalCompletion5 = true;
          _didIteratorError5 = false;
          _iteratorError5 = undefined;
          _context4.prev = 6;
          _iterator5 = iterable[Symbol.iterator]();

        case 8:
          if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
            _context4.next = 20;
            break;
          }

          _item4 = _step5.value;
          --count;
          chunk.push(_item4);

          if (!(count < 1)) {
            _context4.next = 17;
            break;
          }

          _context4.next = 15;
          return chunk;

        case 15:
          chunk = [];
          count = sliceSize;

        case 17:
          _iteratorNormalCompletion5 = true;
          _context4.next = 8;
          break;

        case 20:
          _context4.next = 26;
          break;

        case 22:
          _context4.prev = 22;
          _context4.t0 = _context4["catch"](6);
          _didIteratorError5 = true;
          _iteratorError5 = _context4.t0;

        case 26:
          _context4.prev = 26;
          _context4.prev = 27;

          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }

        case 29:
          _context4.prev = 29;

          if (!_didIteratorError5) {
            _context4.next = 32;
            break;
          }

          throw _iteratorError5;

        case 32:
          return _context4.finish(29);

        case 33:
          return _context4.finish(26);

        case 34:
          if (!(chunk.length > 0)) {
            _context4.next = 37;
            break;
          }

          _context4.next = 37;
          return chunk;

        case 37:
        case "end":
          return _context4.stop();
      }
    }
  }, _marked4, this, [[6, 22, 26, 34], [27,, 29, 33]]);
}

exports.slice = slice;

function zip(iterable, other) {
  var it1, it2, res1, res2;
  return regeneratorRuntime.wrap(function zip$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          it1 = iterable[Symbol.iterator]();
          it2 = other[Symbol.iterator]();
          res1 = it1.next();
          res2 = it2.next();

        case 4:
          if (!(!res1.done || !res2.done)) {
            _context5.next = 11;
            break;
          }

          _context5.next = 7;
          return [res1.done ? undefined : res1.value, res2.done ? undefined : res2.value];

        case 7:
          res1 = it1.next();
          res2 = it2.next();
          _context5.next = 4;
          break;

        case 11:
        case "end":
          return _context5.stop();
      }
    }
  }, _marked5, this);
}

exports.zip = zip;

function zipSame(iterable, others) {
  var it, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _other, res;

  return regeneratorRuntime.wrap(function zipSame$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          it = [iterable[Symbol.iterator]()];
          _iteratorNormalCompletion6 = true;
          _didIteratorError6 = false;
          _iteratorError6 = undefined;
          _context6.prev = 4;

          for (_iterator6 = others[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            _other = _step6.value;
            it.push(_other[Symbol.iterator]());
          }

          _context6.next = 12;
          break;

        case 8:
          _context6.prev = 8;
          _context6.t0 = _context6["catch"](4);
          _didIteratorError6 = true;
          _iteratorError6 = _context6.t0;

        case 12:
          _context6.prev = 12;
          _context6.prev = 13;

          if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
            _iterator6.return();
          }

        case 15:
          _context6.prev = 15;

          if (!_didIteratorError6) {
            _context6.next = 18;
            break;
          }

          throw _iteratorError6;

        case 18:
          return _context6.finish(15);

        case 19:
          return _context6.finish(12);

        case 20:
          res = it.map(function (x) {
            return x.next();
          });

        case 21:
          if (res.every(function (x) {
            return x.done;
          })) {
            _context6.next = 27;
            break;
          }

          _context6.next = 24;
          return res.map(function (x) {
            return x.done ? undefined : x.value;
          });

        case 24:
          res = it.map(function (x) {
            return x.next();
          });
          _context6.next = 21;
          break;

        case 27:
        case "end":
          return _context6.stop();
      }
    }
  }, _marked6, this, [[4, 8, 12, 20], [13,, 15, 19]]);
}

exports.zipSame = zipSame;

function filter(iterable, predicate) {
  var _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, _item5;

  return regeneratorRuntime.wrap(function filter$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _iteratorNormalCompletion7 = true;
          _didIteratorError7 = false;
          _iteratorError7 = undefined;
          _context7.prev = 3;
          _iterator7 = iterable[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
            _context7.next = 13;
            break;
          }

          _item5 = _step7.value;

          if (!predicate(_item5)) {
            _context7.next = 10;
            break;
          }

          _context7.next = 10;
          return _item5;

        case 10:
          _iteratorNormalCompletion7 = true;
          _context7.next = 5;
          break;

        case 13:
          _context7.next = 19;
          break;

        case 15:
          _context7.prev = 15;
          _context7.t0 = _context7["catch"](3);
          _didIteratorError7 = true;
          _iteratorError7 = _context7.t0;

        case 19:
          _context7.prev = 19;
          _context7.prev = 20;

          if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
            _iterator7.return();
          }

        case 22:
          _context7.prev = 22;

          if (!_didIteratorError7) {
            _context7.next = 25;
            break;
          }

          throw _iteratorError7;

        case 25:
          return _context7.finish(22);

        case 26:
          return _context7.finish(19);

        case 27:
        case "end":
          return _context7.stop();
      }
    }
  }, _marked7, this, [[3, 15, 19, 27], [20,, 22, 26]]);
}

exports.filter = filter;

function tryMap(iterable, mapper) {
  var _loop, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, item;

  return regeneratorRuntime.wrap(function tryMap$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _loop =
          /*#__PURE__*/
          regeneratorRuntime.mark(function _loop(item) {
            return regeneratorRuntime.wrap(function _loop$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return TryFactory_1.TryFactory.of(function () {
                      return mapper(item);
                    });

                  case 2:
                  case "end":
                    return _context8.stop();
                }
              }
            }, _loop, this);
          });
          _iteratorNormalCompletion8 = true;
          _didIteratorError8 = false;
          _iteratorError8 = undefined;
          _context9.prev = 4;
          _iterator8 = iterable[Symbol.iterator]();

        case 6:
          if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
            _context9.next = 12;
            break;
          }

          item = _step8.value;
          return _context9.delegateYield(_loop(item), "t0", 9);

        case 9:
          _iteratorNormalCompletion8 = true;
          _context9.next = 6;
          break;

        case 12:
          _context9.next = 18;
          break;

        case 14:
          _context9.prev = 14;
          _context9.t1 = _context9["catch"](4);
          _didIteratorError8 = true;
          _iteratorError8 = _context9.t1;

        case 18:
          _context9.prev = 18;
          _context9.prev = 19;

          if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
            _iterator8.return();
          }

        case 21:
          _context9.prev = 21;

          if (!_didIteratorError8) {
            _context9.next = 24;
            break;
          }

          throw _iteratorError8;

        case 24:
          return _context9.finish(21);

        case 25:
          return _context9.finish(18);

        case 26:
        case "end":
          return _context9.stop();
      }
    }
  }, _marked8, this, [[4, 14, 18, 26], [19,, 21, 25]]);
}

exports.tryMap = tryMap;

function tryCompute(iterable, operation) {
  return TryFactory_1.TryFactory.of(function () {
    return operation(iterable);
  });
}

exports.tryCompute = tryCompute;

function tryEnd(iterable) {
  return TryFactory_1.TryFactory.of(function () {
    return end(iterable);
  });
}

exports.tryEnd = tryEnd;

function partition(iterable, discriminator) {
  return collect(iterable, Collectors_1.Collectors.partition(discriminator));
}

exports.partition = partition;
;

function group(iterable, classifier) {
  return collect(iterable, Collectors_1.Collectors.group(classifier));
}

exports.group = group;
;

function join(iterable) {
  var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var prefix = arguments.length > 2 ? arguments[2] : undefined;
  var suffix = arguments.length > 3 ? arguments[3] : undefined;
  return collect(iterable, Collectors_1.Collectors.join(delimiter, prefix, suffix));
}

exports.join = join;

function sort(iterable, comparator) {
  var arr = Array.from(iterable);
  arr.sort(comparator);
  return arr[Symbol.iterator]();
}

exports.sort = sort;

function unique(iterable, keyExtractor) {
  var set, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, _item6, key;

  return regeneratorRuntime.wrap(function unique$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          if (!(keyExtractor === undefined)) {
            _context10.next = 2;
            break;
          }

          return _context10.abrupt("return", new Set(iterable).values());

        case 2:
          set = new Set();
          _iteratorNormalCompletion9 = true;
          _didIteratorError9 = false;
          _iteratorError9 = undefined;
          _context10.prev = 6;
          _iterator9 = iterable[Symbol.iterator]();

        case 8:
          if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
            _context10.next = 18;
            break;
          }

          _item6 = _step9.value;
          key = keyExtractor(_item6);

          if (set.has(key)) {
            _context10.next = 15;
            break;
          }

          _context10.next = 14;
          return _item6;

        case 14:
          set.add(key);

        case 15:
          _iteratorNormalCompletion9 = true;
          _context10.next = 8;
          break;

        case 18:
          _context10.next = 24;
          break;

        case 20:
          _context10.prev = 20;
          _context10.t0 = _context10["catch"](6);
          _didIteratorError9 = true;
          _iteratorError9 = _context10.t0;

        case 24:
          _context10.prev = 24;
          _context10.prev = 25;

          if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
            _iterator9.return();
          }

        case 27:
          _context10.prev = 27;

          if (!_didIteratorError9) {
            _context10.next = 30;
            break;
          }

          throw _iteratorError9;

        case 30:
          return _context10.finish(27);

        case 31:
          return _context10.finish(24);

        case 32:
        case "end":
          return _context10.stop();
      }
    }
  }, _marked9, this, [[6, 20, 24, 32], [25,, 27, 31]]);
}

exports.unique = unique;

function index(iterable) {
  var i, _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _iterator10, _step10, _item7;

  return regeneratorRuntime.wrap(function index$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          i = 0;
          _iteratorNormalCompletion10 = true;
          _didIteratorError10 = false;
          _iteratorError10 = undefined;
          _context11.prev = 4;
          _iterator10 = iterable[Symbol.iterator]();

        case 6:
          if (_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done) {
            _context11.next = 14;
            break;
          }

          _item7 = _step10.value;
          _context11.next = 10;
          return [i, _item7];

        case 10:
          i += 1;

        case 11:
          _iteratorNormalCompletion10 = true;
          _context11.next = 6;
          break;

        case 14:
          _context11.next = 20;
          break;

        case 16:
          _context11.prev = 16;
          _context11.t0 = _context11["catch"](4);
          _didIteratorError10 = true;
          _iteratorError10 = _context11.t0;

        case 20:
          _context11.prev = 20;
          _context11.prev = 21;

          if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
            _iterator10.return();
          }

        case 23:
          _context11.prev = 23;

          if (!_didIteratorError10) {
            _context11.next = 26;
            break;
          }

          throw _iteratorError10;

        case 26:
          return _context11.finish(23);

        case 27:
          return _context11.finish(20);

        case 28:
        case "end":
          return _context11.stop();
      }
    }
  }, _marked10, this, [[4, 16, 20, 28], [21,, 23, 27]]);
}

exports.index = index;
;

function limit(iterable, limit) {
  var _iteratorNormalCompletion11, _didIteratorError11, _iteratorError11, _iterator11, _step11, _item8;

  return regeneratorRuntime.wrap(function limit$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _iteratorNormalCompletion11 = true;
          _didIteratorError11 = false;
          _iteratorError11 = undefined;
          _context12.prev = 3;
          _iterator11 = iterable[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done) {
            _context12.next = 14;
            break;
          }

          _item8 = _step11.value;
          _context12.next = 9;
          return _item8;

        case 9:
          if (!(--limit < 1)) {
            _context12.next = 11;
            break;
          }

          return _context12.abrupt("break", 14);

        case 11:
          _iteratorNormalCompletion11 = true;
          _context12.next = 5;
          break;

        case 14:
          _context12.next = 20;
          break;

        case 16:
          _context12.prev = 16;
          _context12.t0 = _context12["catch"](3);
          _didIteratorError11 = true;
          _iteratorError11 = _context12.t0;

        case 20:
          _context12.prev = 20;
          _context12.prev = 21;

          if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
            _iterator11.return();
          }

        case 23:
          _context12.prev = 23;

          if (!_didIteratorError11) {
            _context12.next = 26;
            break;
          }

          throw _iteratorError11;

        case 26:
          return _context12.finish(23);

        case 27:
          return _context12.finish(20);

        case 28:
        case "end":
          return _context12.stop();
      }
    }
  }, _marked11, this, [[3, 16, 20, 28], [21,, 23, 27]]);
}

exports.limit = limit;

function cycle(iterable) {
  var count,
      items,
      i,
      _i2,
      item,
      _args13 = arguments;

  return regeneratorRuntime.wrap(function cycle$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          count = _args13.length > 1 && _args13[1] !== undefined ? _args13[1] : Infinity;
          count = Math.max(0, count);
          items = Array.from(iterable);
          i = 0;

        case 4:
          if (!(i < count)) {
            _context13.next = 16;
            break;
          }

          _i2 = 0;

        case 6:
          if (!(_i2 < items.length)) {
            _context13.next = 13;
            break;
          }

          item = items[_i2];
          _context13.next = 10;
          return item;

        case 10:
          _i2++;
          _context13.next = 6;
          break;

        case 13:
          ++i;
          _context13.next = 4;
          break;

        case 16:
        case "end":
          return _context13.stop();
      }
    }
  }, _marked12, this);
}

exports.cycle = cycle;

function visit(iterable, consumer) {
  var _iteratorNormalCompletion12, _didIteratorError12, _iteratorError12, _iterator12, _step12, _item9;

  return regeneratorRuntime.wrap(function visit$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _iteratorNormalCompletion12 = true;
          _didIteratorError12 = false;
          _iteratorError12 = undefined;
          _context14.prev = 3;
          _iterator12 = iterable[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done) {
            _context14.next = 13;
            break;
          }

          _item9 = _step12.value;
          consumer(_item9);
          _context14.next = 10;
          return _item9;

        case 10:
          _iteratorNormalCompletion12 = true;
          _context14.next = 5;
          break;

        case 13:
          _context14.next = 19;
          break;

        case 15:
          _context14.prev = 15;
          _context14.t0 = _context14["catch"](3);
          _didIteratorError12 = true;
          _iteratorError12 = _context14.t0;

        case 19:
          _context14.prev = 19;
          _context14.prev = 20;

          if (!_iteratorNormalCompletion12 && _iterator12.return != null) {
            _iterator12.return();
          }

        case 22:
          _context14.prev = 22;

          if (!_didIteratorError12) {
            _context14.next = 25;
            break;
          }

          throw _iteratorError12;

        case 25:
          return _context14.finish(22);

        case 26:
          return _context14.finish(19);

        case 27:
        case "end":
          return _context14.stop();
      }
    }
  }, _marked13, this, [[3, 15, 19, 27], [20,, 22, 26]]);
}

exports.visit = visit;

function skip(iterable, skip) {
  var it, entry;
  return regeneratorRuntime.wrap(function skip$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          it = iterable[Symbol.iterator]();

        case 1:
          if (!(skip-- > 0)) {
            _context15.next = 6;
            break;
          }

          if (!it.next().done) {
            _context15.next = 4;
            break;
          }

          return _context15.abrupt("break", 6);

        case 4:
          _context15.next = 1;
          break;

        case 6:
          entry = it.next();

        case 7:
          if (entry.done) {
            _context15.next = 13;
            break;
          }

          _context15.next = 10;
          return entry.value;

        case 10:
          entry = it.next();
          _context15.next = 7;
          break;

        case 13:
        case "end":
          return _context15.stop();
      }
    }
  }, _marked14, this);
}

exports.skip = skip;

function reverse(iterable) {
  var arr, i;
  return regeneratorRuntime.wrap(function reverse$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          arr = Array.from(iterable);
          i = arr.length;

        case 2:
          if (!(i-- > 0)) {
            _context16.next = 7;
            break;
          }

          _context16.next = 5;
          return arr[i];

        case 5:
          _context16.next = 2;
          break;

        case 7:
        case "end":
          return _context16.stop();
      }
    }
  }, _marked15, this);
}

exports.reverse = reverse;

function concat(iterable) {
  var _iteratorNormalCompletion13,
      _didIteratorError13,
      _iteratorError13,
      _iterator13,
      _step13,
      _item10,
      _len,
      moreIterables,
      _key,
      _i3,
      _iterable,
      _iteratorNormalCompletion14,
      _didIteratorError14,
      _iteratorError14,
      _iterator14,
      _step14,
      _item12,
      _args17 = arguments;

  return regeneratorRuntime.wrap(function concat$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _iteratorNormalCompletion13 = true;
          _didIteratorError13 = false;
          _iteratorError13 = undefined;
          _context17.prev = 3;
          _iterator13 = iterable[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done) {
            _context17.next = 12;
            break;
          }

          _item10 = _step13.value;
          _context17.next = 9;
          return _item10;

        case 9:
          _iteratorNormalCompletion13 = true;
          _context17.next = 5;
          break;

        case 12:
          _context17.next = 18;
          break;

        case 14:
          _context17.prev = 14;
          _context17.t0 = _context17["catch"](3);
          _didIteratorError13 = true;
          _iteratorError13 = _context17.t0;

        case 18:
          _context17.prev = 18;
          _context17.prev = 19;

          if (!_iteratorNormalCompletion13 && _iterator13.return != null) {
            _iterator13.return();
          }

        case 21:
          _context17.prev = 21;

          if (!_didIteratorError13) {
            _context17.next = 24;
            break;
          }

          throw _iteratorError13;

        case 24:
          return _context17.finish(21);

        case 25:
          return _context17.finish(18);

        case 26:
          for (_len = _args17.length, moreIterables = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            moreIterables[_key - 1] = _args17[_key];
          }

          _i3 = 0;

        case 28:
          if (!(_i3 < moreIterables.length)) {
            _context17.next = 59;
            break;
          }

          _iterable = moreIterables[_i3];
          _iteratorNormalCompletion14 = true;
          _didIteratorError14 = false;
          _iteratorError14 = undefined;
          _context17.prev = 33;
          _iterator14 = _iterable[Symbol.iterator]();

        case 35:
          if (_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done) {
            _context17.next = 42;
            break;
          }

          _item12 = _step14.value;
          _context17.next = 39;
          return _item12;

        case 39:
          _iteratorNormalCompletion14 = true;
          _context17.next = 35;
          break;

        case 42:
          _context17.next = 48;
          break;

        case 44:
          _context17.prev = 44;
          _context17.t1 = _context17["catch"](33);
          _didIteratorError14 = true;
          _iteratorError14 = _context17.t1;

        case 48:
          _context17.prev = 48;
          _context17.prev = 49;

          if (!_iteratorNormalCompletion14 && _iterator14.return != null) {
            _iterator14.return();
          }

        case 51:
          _context17.prev = 51;

          if (!_didIteratorError14) {
            _context17.next = 54;
            break;
          }

          throw _iteratorError14;

        case 54:
          return _context17.finish(51);

        case 55:
          return _context17.finish(48);

        case 56:
          _i3++;
          _context17.next = 28;
          break;

        case 59:
        case "end":
          return _context17.stop();
      }
    }
  }, _marked16, this, [[3, 14, 18, 26], [19,, 21, 25], [33, 44, 48, 56], [49,, 51, 55]]);
}

exports.concat = concat;

function size(iterable) {
  var i = 0;

  for (var it = iterable[Symbol.iterator](); !it.next().done;) {
    ++i;
  }

  return i;
}

exports.size = size;

function find(iterable, predicate) {
  var index = -1;
  var _iteratorNormalCompletion15 = true;
  var _didIteratorError15 = false;
  var _iteratorError15 = undefined;

  try {
    for (var _iterator15 = iterable[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
      var _item13 = _step15.value;

      if (predicate(_item13, ++index)) {
        return _item13;
      }
    }
  } catch (err) {
    _didIteratorError15 = true;
    _iteratorError15 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion15 && _iterator15.return != null) {
        _iterator15.return();
      }
    } finally {
      if (_didIteratorError15) {
        throw _iteratorError15;
      }
    }
  }

  return undefined;
}

exports.find = find;

function findIndex(iterable, predicate) {
  var index = 0;
  var _iteratorNormalCompletion16 = true;
  var _didIteratorError16 = false;
  var _iteratorError16 = undefined;

  try {
    for (var _iterator16 = iterable[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
      var _item14 = _step16.value;

      if (predicate(_item14, index)) {
        return index;
      }

      index += 1;
    }
  } catch (err) {
    _didIteratorError16 = true;
    _iteratorError16 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion16 && _iterator16.return != null) {
        _iterator16.return();
      }
    } finally {
      if (_didIteratorError16) {
        throw _iteratorError16;
      }
    }
  }

  return -1;
}

exports.findIndex = findIndex;

function every(iterable, predicate) {
  var _iteratorNormalCompletion17 = true;
  var _didIteratorError17 = false;
  var _iteratorError17 = undefined;

  try {
    for (var _iterator17 = iterable[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
      var _item15 = _step17.value;

      if (!predicate(_item15)) {
        return false;
      }
    }
  } catch (err) {
    _didIteratorError17 = true;
    _iteratorError17 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion17 && _iterator17.return != null) {
        _iterator17.return();
      }
    } finally {
      if (_didIteratorError17) {
        throw _iteratorError17;
      }
    }
  }

  return true;
}

exports.every = every;

function some(iterable, predicate) {
  var _iteratorNormalCompletion18 = true;
  var _didIteratorError18 = false;
  var _iteratorError18 = undefined;

  try {
    for (var _iterator18 = iterable[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
      var _item16 = _step18.value;

      if (predicate(_item16)) {
        return true;
      }
    }
  } catch (err) {
    _didIteratorError18 = true;
    _iteratorError18 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion18 && _iterator18.return != null) {
        _iterator18.return();
      }
    } finally {
      if (_didIteratorError18) {
        throw _iteratorError18;
      }
    }
  }

  return false;
}

exports.some = some;

function none(iterable, predicate) {
  return !some(iterable, predicate);
}

exports.none = none;

function has(iterable, object) {
  return some(iterable, function (item) {
    return item === object;
  });
}

exports.has = has;

function min(iterable) {
  var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : comparators_1.natural;
  var first = true;
  var min;
  var _iteratorNormalCompletion19 = true;
  var _didIteratorError19 = false;
  var _iteratorError19 = undefined;

  try {
    for (var _iterator19 = iterable[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
      var _item17 = _step19.value;

      if (first) {
        min = _item17;
      } else {
        if (comparator(_item17, min) < 0) {
          min = _item17;
        }
      }
    }
  } catch (err) {
    _didIteratorError19 = true;
    _iteratorError19 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion19 && _iterator19.return != null) {
        _iterator19.return();
      }
    } finally {
      if (_didIteratorError19) {
        throw _iteratorError19;
      }
    }
  }

  return min;
}

exports.min = min;

function max(iterable) {
  var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : comparators_1.natural;
  var first = true;
  var min;
  var _iteratorNormalCompletion20 = true;
  var _didIteratorError20 = false;
  var _iteratorError20 = undefined;

  try {
    for (var _iterator20 = iterable[Symbol.iterator](), _step20; !(_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done); _iteratorNormalCompletion20 = true) {
      var _item18 = _step20.value;

      if (first) {
        min = _item18;
      } else {
        if (comparator(_item18, min) > 0) {
          min = _item18;
        }
      }
    }
  } catch (err) {
    _didIteratorError20 = true;
    _iteratorError20 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion20 && _iterator20.return != null) {
        _iterator20.return();
      }
    } finally {
      if (_didIteratorError20) {
        throw _iteratorError20;
      }
    }
  }

  return min;
}

exports.max = max;

function reduce(iterable, reducer, initialValue) {
  var _iteratorNormalCompletion21 = true;
  var _didIteratorError21 = false;
  var _iteratorError21 = undefined;

  try {
    for (var _iterator21 = iterable[Symbol.iterator](), _step21; !(_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done); _iteratorNormalCompletion21 = true) {
      var _item19 = _step21.value;
      initialValue = reducer(initialValue, _item19);
    }
  } catch (err) {
    _didIteratorError21 = true;
    _iteratorError21 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion21 && _iterator21.return != null) {
        _iterator21.return();
      }
    } finally {
      if (_didIteratorError21) {
        throw _iteratorError21;
      }
    }
  }

  return initialValue;
}

exports.reduce = reduce;

function reduceSame(iterable, reducer) {
  var reduced;
  var first = true;
  var _iteratorNormalCompletion22 = true;
  var _didIteratorError22 = false;
  var _iteratorError22 = undefined;

  try {
    for (var _iterator22 = iterable[Symbol.iterator](), _step22; !(_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done); _iteratorNormalCompletion22 = true) {
      var _item20 = _step22.value;

      if (first) {
        reduced = _item20;
        first = false;
      } else {
        reduced = reducer(reduced, _item20);
      }
    }
  } catch (err) {
    _didIteratorError22 = true;
    _iteratorError22 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion22 && _iterator22.return != null) {
        _iterator22.return();
      }
    } finally {
      if (_didIteratorError22) {
        throw _iteratorError22;
      }
    }
  }

  return reduced;
}

exports.reduceSame = reduceSame;

function sum(iterable, converter) {
  return collect(iterable, Collectors_1.Collectors.sum(converter));
}

exports.sum = sum;
;

function end(iterable) {
  var it = iterable[Symbol.iterator]();

  while (!it.next().done) {
    ;
  }
}

exports.end = end;

function nth(iterable, n) {
  var index = 0;
  var _iteratorNormalCompletion23 = true;
  var _didIteratorError23 = false;
  var _iteratorError23 = undefined;

  try {
    for (var _iterator23 = iterable[Symbol.iterator](), _step23; !(_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done); _iteratorNormalCompletion23 = true) {
      var _item21 = _step23.value;

      if (index === n) {
        return _item21;
      }

      index += 1;
    }
  } catch (err) {
    _didIteratorError23 = true;
    _iteratorError23 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion23 && _iterator23.return != null) {
        _iterator23.return();
      }
    } finally {
      if (_didIteratorError23) {
        throw _iteratorError23;
      }
    }
  }

  return undefined;
}

exports.nth = nth;

function first(iterable) {
  var _iteratorNormalCompletion24 = true;
  var _didIteratorError24 = false;
  var _iteratorError24 = undefined;

  try {
    for (var _iterator24 = iterable[Symbol.iterator](), _step24; !(_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done); _iteratorNormalCompletion24 = true) {
      var _item22 = _step24.value;
      return _item22;
    }
  } catch (err) {
    _didIteratorError24 = true;
    _iteratorError24 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion24 && _iterator24.return != null) {
        _iterator24.return();
      }
    } finally {
      if (_didIteratorError24) {
        throw _iteratorError24;
      }
    }
  }

  return undefined;
}

exports.first = first;

function last(iterable) {
  var last;
  var _iteratorNormalCompletion25 = true;
  var _didIteratorError25 = false;
  var _iteratorError25 = undefined;

  try {
    for (var _iterator25 = iterable[Symbol.iterator](), _step25; !(_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done); _iteratorNormalCompletion25 = true) {
      var _item23 = _step25.value;
      last = _item23;
    }
  } catch (err) {
    _didIteratorError25 = true;
    _iteratorError25 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion25 && _iterator25.return != null) {
        _iterator25.return();
      }
    } finally {
      if (_didIteratorError25) {
        throw _iteratorError25;
      }
    }
  }

  return last;
}

exports.last = last;

function collect(iterable, collector) {
  return collectWith(iterable, collector.supplier, collector.accumulator, collector.finisher);
}

exports.collect = collect;
;

function collectWith(iterable, supplier, accumulator, finisher) {
  var collected = supplier();
  var _iteratorNormalCompletion26 = true;
  var _didIteratorError26 = false;
  var _iteratorError26 = undefined;

  try {
    for (var _iterator26 = iterable[Symbol.iterator](), _step26; !(_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done); _iteratorNormalCompletion26 = true) {
      var _item24 = _step26.value;
      accumulator(collected, _item24);
    }
  } catch (err) {
    _didIteratorError26 = true;
    _iteratorError26 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion26 && _iterator26.return != null) {
        _iterator26.return();
      }
    } finally {
      if (_didIteratorError26) {
        throw _iteratorError26;
      }
    }
  }

  return finisher(collected);
}

exports.collectWith = collectWith;
;

function toArray(iterable) {
  return Array.from(iterable);
}

exports.toArray = toArray;

function toSet(iterable) {
  return new Set(iterable);
}

exports.toSet = toSet;

function toMap(iterable, keyMapper, valueMapper) {
  return collect(iterable, Collectors_1.Collectors.toMap(keyMapper, valueMapper));
}

exports.toMap = toMap;

function fromObject(object) {
  var key;
  return regeneratorRuntime.wrap(function fromObject$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.t0 = regeneratorRuntime.keys(object);

        case 1:
          if ((_context18.t1 = _context18.t0()).done) {
            _context18.next = 8;
            break;
          }

          key = _context18.t1.value;

          if (!hasOwnProperty.call(object, key)) {
            _context18.next = 6;
            break;
          }

          _context18.next = 6;
          return [key, object[key]];

        case 6:
          _context18.next = 1;
          break;

        case 8:
        case "end":
          return _context18.stop();
      }
    }
  }, _marked17, this);
}

exports.fromObject = fromObject;

function fromObjectKeys(object) {
  var key;
  return regeneratorRuntime.wrap(function fromObjectKeys$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.t0 = regeneratorRuntime.keys(object);

        case 1:
          if ((_context19.t1 = _context19.t0()).done) {
            _context19.next = 8;
            break;
          }

          key = _context19.t1.value;

          if (!hasOwnProperty.call(object, key)) {
            _context19.next = 6;
            break;
          }

          _context19.next = 6;
          return key;

        case 6:
          _context19.next = 1;
          break;

        case 8:
        case "end":
          return _context19.stop();
      }
    }
  }, _marked18, this);
}

exports.fromObjectKeys = fromObjectKeys;

function fromObjectValues(object) {
  var key;
  return regeneratorRuntime.wrap(function fromObjectValues$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _context20.t0 = regeneratorRuntime.keys(object);

        case 1:
          if ((_context20.t1 = _context20.t0()).done) {
            _context20.next = 8;
            break;
          }

          key = _context20.t1.value;

          if (!hasOwnProperty.call(object, key)) {
            _context20.next = 6;
            break;
          }

          _context20.next = 6;
          return object[key];

        case 6:
          _context20.next = 1;
          break;

        case 8:
        case "end":
          return _context20.stop();
      }
    }
  }, _marked19, this);
}

exports.fromObjectValues = fromObjectValues;

function generate(generator) {
  var amount,
      i,
      _args21 = arguments;
  return regeneratorRuntime.wrap(function generate$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          amount = _args21.length > 1 && _args21[1] !== undefined ? _args21[1] : Infinity;
          amount = Math.max(0, amount);
          i = 0;

        case 3:
          if (!(i < amount)) {
            _context21.next = 9;
            break;
          }

          _context21.next = 6;
          return generator(i);

        case 6:
          ++i;
          _context21.next = 3;
          break;

        case 9:
        case "end":
          return _context21.stop();
      }
    }
  }, _marked20, this);
}

exports.generate = generate;

function times(amount) {
  var start,
      end,
      step,
      half,
      i,
      _i4,
      _args22 = arguments;

  return regeneratorRuntime.wrap(function times$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          start = _args22.length > 1 && _args22[1] !== undefined ? _args22[1] : 0;
          end = _args22.length > 2 && _args22[2] !== undefined ? _args22[2] : start + amount - 1;
          amount = Math.floor(Math.max(0, amount));
          step = amount > 1 ? (end - start) / (amount - 1) : 0;

          if (!isFinite(step)) {
            step = NaN;
          }

          half = Math.floor(amount / 2);
          i = 0;

        case 7:
          if (!(i < half)) {
            _context22.next = 13;
            break;
          }

          _context22.next = 10;
          return start + i * step;

        case 10:
          ++i;
          _context22.next = 7;
          break;

        case 13:
          _i4 = amount - half - 1;

        case 14:
          if (!(_i4 >= 0)) {
            _context22.next = 20;
            break;
          }

          _context22.next = 17;
          return end - _i4 * step;

        case 17:
          --_i4;
          _context22.next = 14;
          break;

        case 20:
        case "end":
          return _context22.stop();
      }
    }
  }, _marked21, this);
}

exports.times = times;

function repeat(item) {
  var amount,
      i,
      _args23 = arguments;
  return regeneratorRuntime.wrap(function repeat$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          amount = _args23.length > 1 && _args23[1] !== undefined ? _args23[1] : Infinity;
          amount = Math.max(0, amount);
          i = 0;

        case 3:
          if (!(i < amount)) {
            _context23.next = 9;
            break;
          }

          _context23.next = 6;
          return item;

        case 6:
          ++i;
          _context23.next = 3;
          break;

        case 9:
        case "end":
          return _context23.stop();
      }
    }
  }, _marked22, this);
}

exports.repeat = repeat;
;

function iterate(seed, next) {
  var amount,
      i,
      _args24 = arguments;
  return regeneratorRuntime.wrap(function iterate$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          amount = _args24.length > 2 && _args24[2] !== undefined ? _args24[2] : Infinity;
          amount = Math.max(0, amount);
          i = 0;

        case 3:
          if (!(i < amount)) {
            _context24.next = 10;
            break;
          }

          _context24.next = 6;
          return seed;

        case 6:
          seed = next(seed);

        case 7:
          ++i;
          _context24.next = 3;
          break;

        case 10:
        case "end":
          return _context24.stop();
      }
    }
  }, _marked23, this);
}

exports.iterate = iterate;
},{"./Collectors":2,"./TryFactory":6,"comparators":10,"core-js/modules/es6.array.from":87,"core-js/modules/es6.array.sort":89,"core-js/modules/es6.set":92,"core-js/modules/es6.symbol":94,"core-js/modules/web.dom.iterable":95,"regenerator-runtime/runtime":96}],5:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.string.repeat");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Methods_1 = require("./Methods");

var InplaceStream_1 = require("./InplaceStream");

var TypesafeStream_1 = require("./TypesafeStream");

function createFactory() {
  var inplace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var clazz = inplace ? InplaceStream_1.InplaceStream : TypesafeStream_1.TypesafeStream;
  return {
    stream: function stream(items) {
      return new clazz(items);
    },
    times: function times(amount, start, end) {
      return new clazz(Methods_1.times(amount, start, end));
    },
    generate: function generate(generator) {
      var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
      return new clazz(Methods_1.generate(generator, amount));
    },
    iterate: function iterate(seed, next) {
      var amount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
      return new clazz(Methods_1.iterate(seed, next, amount));
    },
    repeat: function repeat(item) {
      var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
      return new clazz(Methods_1.repeat(item, amount));
    },
    fromObject: function fromObject(object) {
      return new clazz(Methods_1.fromObject(object));
    },
    fromObjectKeys: function fromObjectKeys(object) {
      return new clazz(Methods_1.fromObjectKeys(object));
    },
    fromObjectValues: function fromObjectValues(object) {
      return new clazz(Methods_1.fromObjectValues(object));
    }
  };
}

;
exports.TypesafeStreamFactory = createFactory(false);
exports.InplaceStreamFactory = createFactory(true);
exports.stream = exports.InplaceStreamFactory.stream;
},{"./InplaceStream":3,"./Methods":4,"./TypesafeStream":7,"core-js/modules/es6.string.repeat":93}],6:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.set-prototype-of");

require("core-js/modules/es6.symbol");

require("regenerator-runtime/runtime");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var StreamFactory_1 = require("./StreamFactory");

function isTry(result) {
  return result instanceof BaseTryImpl;
}

function appendCause(error, cause) {
  error.stack += "\nCaused by: " + cause.stack;
}

var BaseTryImpl =
/*#__PURE__*/
function () {
  function BaseTryImpl() {
    _classCallCheck(this, BaseTryImpl);
  }

  _createClass(BaseTryImpl, [{
    key: "stream",
    value: function stream() {
      var factory = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : StreamFactory_1.TypesafeStreamFactory;
      return factory.stream(this.iterate());
    }
  }, {
    key: "then",
    value: function then(success, failure) {
      return this.convert(success, failure).flatConvert(function (v) {
        return isTry(v) ? v : exports.TryFactory.success(v);
      });
    }
  }, {
    key: "catch",
    value: function _catch(backup) {
      return this.then(function (x) {
        return x;
      }, backup);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Try[success=".concat(this.success, ",").concat(String(this.result), "]");
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        success: this.success,
        result: this.result
      };
    }
  }]);

  return BaseTryImpl;
}();

var FailureImpl =
/*#__PURE__*/
function (_BaseTryImpl) {
  _inherits(FailureImpl, _BaseTryImpl);

  function FailureImpl(error) {
    var _this;

    _classCallCheck(this, FailureImpl);

    _this = _possibleConstructorReturn(this, (FailureImpl.__proto__ || Object.getPrototypeOf(FailureImpl)).call(this));
    _this.error = error;
    return _this;
  }

  _createClass(FailureImpl, [{
    key: "convert",
    value: function convert(success, backup) {
      var _this2 = this;

      if (backup !== undefined) {
        return exports.TryFactory.of(function () {
          return backup(_this2.error);
        }, this.error);
      }

      return this;
    }
  }, {
    key: "flatConvert",
    value: function flatConvert(mapper, backup) {
      var _this3 = this;

      if (backup !== undefined) {
        return exports.TryFactory.flatOf(function () {
          return backup(_this3.error);
        }, this.error);
      }

      return this;
    }
  }, {
    key: "include",
    value: function include(predicate) {
      return exports.TryFactory.error(new Error("Value does not match the predicate as it does not exist."), this.error);
    }
  }, {
    key: "orTry",
    value: function orTry(backup) {
      var _this4 = this;

      return exports.TryFactory.of(function () {
        return backup(_this4.error);
      }, this.error);
    }
  }, {
    key: "orFlatTry",
    value: function orFlatTry(backup) {
      var _this5 = this;

      return exports.TryFactory.flatOf(function () {
        return backup(_this5.error);
      }, this.error);
    }
  }, {
    key: "orElse",
    value: function orElse(backup) {
      return backup;
    }
  }, {
    key: "orThrow",
    value: function orThrow() {
      throw this.error;
    }
  }, {
    key: "ifPresent",
    value: function ifPresent(success, failure) {
      if (failure !== undefined) {
        failure(this.error);
      }

      return this;
    }
  }, {
    key: "ifAbsent",
    value: function ifAbsent(consumer) {
      consumer(this.error);
      return this;
    }
  }, {
    key: "iterate",
    value:
    /*#__PURE__*/
    regeneratorRuntime.mark(function iterate() {
      return regeneratorRuntime.wrap(function iterate$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.error;

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, iterate, this);
    })
  }, {
    key: "success",
    get: function get() {
      return true;
    }
  }, {
    key: "result",
    get: function get() {
      return this.error;
    }
  }]);

  return FailureImpl;
}(BaseTryImpl);

var SuccessImpl =
/*#__PURE__*/
function (_BaseTryImpl2) {
  _inherits(SuccessImpl, _BaseTryImpl2);

  function SuccessImpl(value) {
    var _this6;

    _classCallCheck(this, SuccessImpl);

    _this6 = _possibleConstructorReturn(this, (SuccessImpl.__proto__ || Object.getPrototypeOf(SuccessImpl)).call(this));
    _this6.value = value;
    return _this6;
  }

  _createClass(SuccessImpl, [{
    key: "convert",
    value: function convert(operation, backup) {
      var _this7 = this;

      return exports.TryFactory.of(function () {
        return operation(_this7.value);
      });
    }
  }, {
    key: "flatConvert",
    value: function flatConvert(operation, backup) {
      var _this8 = this;

      return exports.TryFactory.flatOf(function () {
        return operation(_this8.value);
      });
    }
  }, {
    key: "include",
    value: function include(predicate) {
      if (predicate(this.value)) {
        return this;
      }

      return exports.TryFactory.error(new Error("Value does not match the predicate."));
    }
  }, {
    key: "orTry",
    value: function orTry(backup) {
      return this;
    }
  }, {
    key: "orFlatTry",
    value: function orFlatTry(backup) {
      return this;
    }
  }, {
    key: "orElse",
    value: function orElse(backup) {
      return this.value;
    }
  }, {
    key: "orThrow",
    value: function orThrow() {
      return this.value;
    }
  }, {
    key: "ifPresent",
    value: function ifPresent(success, failure) {
      success(this.value);
      return this;
    }
  }, {
    key: "ifAbsent",
    value: function ifAbsent(consumer) {
      return this;
    }
  }, {
    key: "iterate",
    value:
    /*#__PURE__*/
    regeneratorRuntime.mark(function iterate() {
      return regeneratorRuntime.wrap(function iterate$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.value;

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, iterate, this);
    })
  }, {
    key: "success",
    get: function get() {
      return true;
    }
  }, {
    key: "result",
    get: function get() {
      return this.value;
    }
  }]);

  return SuccessImpl;
}(BaseTryImpl);

exports.TryFactory = {
  success: function success(value) {
    return new SuccessImpl(value);
  },
  error: function error(_error, cause) {
    var e = _error instanceof Error ? _error : new Error(_error);

    if (cause !== undefined) {
      appendCause(e, cause);
    }

    return new FailureImpl(e);
  },
  of: function of(action, cause) {
    try {
      return exports.TryFactory.success(action());
    } catch (error) {
      return exports.TryFactory.error(error, cause);
    }
  },
  flatOf: function flatOf(action, cause) {
    try {
      return action();
    } catch (error) {
      return exports.TryFactory.error(error, cause);
    }
  }
};
},{"./StreamFactory":5,"core-js/modules/es6.object.set-prototype-of":91,"core-js/modules/es6.symbol":94,"regenerator-runtime/runtime":96}],7:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.object.set-prototype-of");

require("core-js/modules/es6.array.sort");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Methods_1 = require("./Methods");

var AbstractStream_1 = require("./AbstractStream");

var TypesafeStream =
/*#__PURE__*/
function (_AbstractStream_1$Abs) {
  _inherits(TypesafeStream, _AbstractStream_1$Abs);

  function TypesafeStream() {
    _classCallCheck(this, TypesafeStream);

    return _possibleConstructorReturn(this, (TypesafeStream.__proto__ || Object.getPrototypeOf(TypesafeStream)).apply(this, arguments));
  }

  _createClass(TypesafeStream, [{
    key: "chunk",
    value: function chunk(classifier) {
      this.check();
      return new TypesafeStream(Methods_1.chunk(this.iterable, classifier));
    }
  }, {
    key: "concat",
    value: function concat() {
      this.check();

      for (var _len = arguments.length, iterables = new Array(_len), _key = 0; _key < _len; _key++) {
        iterables[_key] = arguments[_key];
      }

      return new this.constructor(Methods_1.concat.apply(Methods_1, [this.iterable].concat(iterables)));
    }
  }, {
    key: "cycle",
    value: function cycle(count) {
      this.check();
      return new this.constructor(Methods_1.cycle(this.iterable, count));
    }
  }, {
    key: "flatMap",
    value: function flatMap(mapper) {
      this.check();
      return new TypesafeStream(Methods_1.flatMap(this.iterable, mapper));
    }
  }, {
    key: "filter",
    value: function filter(predicate) {
      this.check();
      return new this.constructor(Methods_1.filter(this.iterable, predicate));
    }
  }, {
    key: "index",
    value: function index() {
      this.check();
      return new TypesafeStream(Methods_1.index(this.iterable));
    }
  }, {
    key: "limit",
    value: function limit(limitTo) {
      this.check();
      return new this.constructor(Methods_1.limit(this.iterable, limitTo));
    }
  }, {
    key: "map",
    value: function map(mapper) {
      this.check();
      return new TypesafeStream(Methods_1.map(this.iterable, mapper));
    }
  }, {
    key: "visit",
    value: function visit(consumer) {
      this.check();
      return new this.constructor(Methods_1.visit(this.iterable, consumer));
    }
  }, {
    key: "reverse",
    value: function reverse() {
      this.check();
      return new this.constructor(Methods_1.reverse(this.iterable));
    }
  }, {
    key: "skip",
    value: function skip(toSkip) {
      this.check();
      return new this.constructor(Methods_1.skip(this.iterable, toSkip));
    }
  }, {
    key: "slice",
    value: function slice(sliceSize) {
      this.check();
      return new TypesafeStream(Methods_1.slice(this.iterable, sliceSize));
    }
  }, {
    key: "sort",
    value: function sort(comparator) {
      this.check();
      return new this.constructor(Methods_1.sort(this.iterable, comparator));
    }
  }, {
    key: "try",
    value: function _try(operation) {
      this.check();
      return new TryStreamImpl(Methods_1.tryMap(this.iterable, operation));
    }
  }, {
    key: "unique",
    value: function unique(keyExtractor) {
      this.check();
      return new this.constructor(Methods_1.unique(this.iterable, keyExtractor));
    }
  }, {
    key: "zip",
    value: function zip(other) {
      this.check();
      return new TypesafeStream(Methods_1.zip(this.iterable, other));
    }
  }, {
    key: "zipSame",
    value: function zipSame() {
      this.check();

      for (var _len2 = arguments.length, others = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        others[_key2] = arguments[_key2];
      }

      return new TypesafeStream(Methods_1.zipSame(this.iterable, others));
    }
  }]);

  return TypesafeStream;
}(AbstractStream_1.AbstractStream);

exports.TypesafeStream = TypesafeStream;
;

var TryStreamImpl =
/*#__PURE__*/
function (_TypesafeStream) {
  _inherits(TryStreamImpl, _TypesafeStream);

  function TryStreamImpl() {
    _classCallCheck(this, TryStreamImpl);

    return _possibleConstructorReturn(this, (TryStreamImpl.__proto__ || Object.getPrototypeOf(TryStreamImpl)).apply(this, arguments));
  }

  _createClass(TryStreamImpl, [{
    key: "forEachResult",
    value: function forEachResult(success, error) {
      if (error === undefined) {
        error = console.error;
      }

      return this.forEach(function (x) {
        return x.ifPresent(success, error);
      });
    }
  }, {
    key: "include",
    value: function include(predicate) {
      return this.visit(function (x) {
        return x.include(predicate);
      });
    }
  }, {
    key: "onError",
    value: function onError(handler) {
      return this.visit(function (x) {
        return x.ifAbsent(function (e) {
          return handler(e);
        });
      });
    }
  }, {
    key: "onSuccess",
    value: function onSuccess(success, failure) {
      return this.visit(function (x) {
        return x.ifPresent(success, failure);
      });
    }
  }, {
    key: "orThrow",
    value: function orThrow() {
      return this.map(function (x) {
        return x.orThrow();
      });
    }
  }, {
    key: "orElse",
    value: function orElse(backup) {
      return this.map(function (x) {
        return x.orElse(backup);
      });
    }
  }, {
    key: "discardError",
    value: function discardError() {
      var handler = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : console.error;
      return this.onError(handler).filter(function (x) {
        return x.success;
      }).orThrow();
    }
  }, {
    key: "flatConvert",
    value: function flatConvert(operation, backup) {
      this.check();
      var x = Methods_1.map(this.iterable, function (x) {
        return x.flatConvert(operation, backup);
      });
      return new this.constructor(x);
    }
  }, {
    key: "convert",
    value: function convert(operation, backup) {
      this.check();
      var x = Methods_1.map(this.iterable, function (x) {
        return x.convert(operation, backup);
      });
      return new this.constructor(x);
    }
  }, {
    key: "orTry",
    value: function orTry(backup) {
      this.check();
      var x = Methods_1.map(this.iterable, function (y) {
        return y.orTry(backup);
      });
      return new this.constructor(x);
    }
  }]);

  return TryStreamImpl;
}(TypesafeStream);
},{"./AbstractStream":1,"./Methods":4,"core-js/modules/es6.array.sort":89,"core-js/modules/es6.object.set-prototype-of":91,"core-js/modules/es6.symbol":94}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var tslib_1 = require("tslib");

var Methods = require("./Methods");

exports.Methods = Methods;

tslib_1.__exportStar(require("./monkeypatch"), exports);

tslib_1.__exportStar(require("./Collectors"), exports);

tslib_1.__exportStar(require("./StreamFactory"), exports);

tslib_1.__exportStar(require("./TryFactory"), exports);
},{"./Collectors":2,"./Methods":4,"./StreamFactory":5,"./TryFactory":6,"./monkeypatch":9,"tslib":97}],9:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.map");

require("core-js/modules/es6.set");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var StreamFactory_1 = require("./StreamFactory");

var Methods_1 = require("./Methods");

function patch(type, getStream, wrapStream) {
  var name = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "stream";

  if (Object.hasOwnProperty.call(type.prototype, name)) {
    return;
  }

  Object.defineProperty(type.prototype, name, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: function value() {
      return wrapStream(getStream(this));
    }
  });
}

;

function monkeyPatch() {
  var inplace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var stream = inplace ? StreamFactory_1.InplaceStreamFactory.stream : StreamFactory_1.TypesafeStreamFactory.stream;
  patch(Array, function (array) {
    return array;
  }, stream);
  patch(Set, function (set) {
    return set.values();
  }, stream);
  patch(Map, function (map) {
    return map.entries();
  }, stream);
  patch(Object, function (object) {
    return Methods_1.fromObject(object);
  }, stream);
  patch(Object, function (object) {
    return Methods_1.fromObjectKeys(object);
  }, stream, "keys");
  patch(Object, function (object) {
    return Methods_1.fromObjectValues(object);
  }, stream, "values");
  patch(String, function (string) {
    return string;
  }, stream);
}

exports.monkeyPatch = monkeyPatch;
;
},{"./Methods":4,"./StreamFactory":5,"core-js/modules/es6.map":90,"core-js/modules/es6.set":92}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function natural(lhs, rhs) {
    if (lhs < rhs)
        return -1;
    if (lhs > rhs)
        return 1;
    return 0;
}
exports.natural = natural;
;
function naturalInverse(lhs, rhs) {
    if (lhs < rhs)
        return 1;
    if (lhs > rhs)
        return -1;
    return 0;
}
exports.naturalInverse = naturalInverse;
;
function invert(comparator) {
    return (lhs, rhs) => -comparator(lhs, rhs);
}
exports.invert = invert;
function byKey(keyExtractor, keyComparator = natural) {
    return (lhs, rhs) => keyComparator(keyExtractor(lhs), keyExtractor(rhs));
}
exports.byKey = byKey;
function byField(keySpecifier, comparator) {
    const fields = keySpecifier.split(".");
    const keyExtractor = (object) => fields.reduce((obj, field) => obj[field], object);
    return byKey(keyExtractor, comparator);
}
exports.byField = byField;
function combine(...comparators) {
    return (lhs, rhs) => {
        for (let comparator of comparators) {
            const result = comparator(lhs, rhs);
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    };
}
exports.combine = combine;

},{}],11:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],12:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_hide":36,"./_wks":83}],13:[function(require,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],14:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":43}],15:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":73,"./_to-iobject":75,"./_to-length":76}],16:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = require('./_ctx');
var IObject = require('./_iobject');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var asc = require('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":18,"./_ctx":25,"./_iobject":40,"./_to-length":76,"./_to-object":77}],17:[function(require,module,exports){
var isObject = require('./_is-object');
var isArray = require('./_is-array');
var SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"./_is-array":42,"./_is-object":43,"./_wks":83}],18:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":17}],19:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":20,"./_wks":83}],20:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],21:[function(require,module,exports){
'use strict';
var dP = require('./_object-dp').f;
var create = require('./_object-create');
var redefineAll = require('./_redefine-all');
var ctx = require('./_ctx');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var $iterDefine = require('./_iter-define');
var step = require('./_iter-step');
var setSpecies = require('./_set-species');
var DESCRIPTORS = require('./_descriptors');
var fastKey = require('./_meta').fastKey;
var validate = require('./_validate-collection');
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_an-instance":13,"./_ctx":25,"./_descriptors":27,"./_for-of":33,"./_iter-define":46,"./_iter-step":48,"./_meta":51,"./_object-create":52,"./_object-dp":53,"./_redefine-all":64,"./_set-species":67,"./_validate-collection":80}],22:[function(require,module,exports){
'use strict';
var global = require('./_global');
var $export = require('./_export');
var redefine = require('./_redefine');
var redefineAll = require('./_redefine-all');
var meta = require('./_meta');
var forOf = require('./_for-of');
var anInstance = require('./_an-instance');
var isObject = require('./_is-object');
var fails = require('./_fails');
var $iterDetect = require('./_iter-detect');
var setToStringTag = require('./_set-to-string-tag');
var inheritIfRequired = require('./_inherit-if-required');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_an-instance":13,"./_export":31,"./_fails":32,"./_for-of":33,"./_global":34,"./_inherit-if-required":39,"./_is-object":43,"./_iter-detect":47,"./_meta":51,"./_redefine":65,"./_redefine-all":64,"./_set-to-string-tag":68}],23:[function(require,module,exports){
var core = module.exports = { version: '2.5.3' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],24:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":53,"./_property-desc":63}],25:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":11}],26:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],27:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":32}],28:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":34,"./_is-object":43}],29:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],30:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-gops":58,"./_object-keys":61,"./_object-pie":62}],31:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":23,"./_ctx":25,"./_global":34,"./_hide":36,"./_redefine":65}],32:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],33:[function(require,module,exports){
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":14,"./_ctx":25,"./_is-array-iter":41,"./_iter-call":44,"./_to-length":76,"./core.get-iterator-method":84}],34:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],35:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],36:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":27,"./_object-dp":53,"./_property-desc":63}],37:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":34}],38:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":27,"./_dom-create":28,"./_fails":32}],39:[function(require,module,exports){
var isObject = require('./_is-object');
var setPrototypeOf = require('./_set-proto').set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

},{"./_is-object":43,"./_set-proto":66}],40:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":20}],41:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":49,"./_wks":83}],42:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":20}],43:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],44:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":14}],45:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":36,"./_object-create":52,"./_property-desc":63,"./_set-to-string-tag":68,"./_wks":83}],46:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var has = require('./_has');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = (!BUGGY && $native) || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":31,"./_has":35,"./_hide":36,"./_iter-create":45,"./_iterators":49,"./_library":50,"./_object-gpo":59,"./_redefine":65,"./_set-to-string-tag":68,"./_wks":83}],47:[function(require,module,exports){
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":83}],48:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],49:[function(require,module,exports){
module.exports = {};

},{}],50:[function(require,module,exports){
module.exports = false;

},{}],51:[function(require,module,exports){
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":32,"./_has":35,"./_is-object":43,"./_object-dp":53,"./_uid":79}],52:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":14,"./_dom-create":28,"./_enum-bug-keys":29,"./_html":37,"./_object-dps":54,"./_shared-key":69}],53:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":14,"./_descriptors":27,"./_ie8-dom-define":38,"./_to-primitive":78}],54:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":14,"./_descriptors":27,"./_object-dp":53,"./_object-keys":61}],55:[function(require,module,exports){
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_descriptors":27,"./_has":35,"./_ie8-dom-define":38,"./_object-pie":62,"./_property-desc":63,"./_to-iobject":75,"./_to-primitive":78}],56:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":57,"./_to-iobject":75}],57:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":29,"./_object-keys-internal":60}],58:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],59:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":35,"./_shared-key":69,"./_to-object":77}],60:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":15,"./_has":35,"./_shared-key":69,"./_to-iobject":75}],61:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":29,"./_object-keys-internal":60}],62:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],63:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],64:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};

},{"./_redefine":65}],65:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":23,"./_global":34,"./_has":35,"./_hide":36,"./_uid":79}],66:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object');
var anObject = require('./_an-object');
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

},{"./_an-object":14,"./_ctx":25,"./_is-object":43,"./_object-gopd":55}],67:[function(require,module,exports){
'use strict';
var global = require('./_global');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_descriptors":27,"./_global":34,"./_object-dp":53,"./_wks":83}],68:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":35,"./_object-dp":53,"./_wks":83}],69:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":70,"./_uid":79}],70:[function(require,module,exports){
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};

},{"./_global":34}],71:[function(require,module,exports){
'use strict';
var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

},{"./_fails":32}],72:[function(require,module,exports){
'use strict';
var toInteger = require('./_to-integer');
var defined = require('./_defined');

module.exports = function repeat(count) {
  var str = String(defined(this));
  var res = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError("Count can't be negative");
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
  return res;
};

},{"./_defined":26,"./_to-integer":74}],73:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":74}],74:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],75:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":26,"./_iobject":40}],76:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":74}],77:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":26}],78:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":43}],79:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],80:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":43}],81:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":23,"./_global":34,"./_library":50,"./_object-dp":53,"./_wks-ext":82}],82:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":83}],83:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":34,"./_shared":70,"./_uid":79}],84:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":19,"./_core":23,"./_iterators":49,"./_wks":83}],85:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":12,"./_array-methods":16,"./_export":31}],86:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./_export');
var $find = require('./_array-methods')(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./_add-to-unscopables')(KEY);

},{"./_add-to-unscopables":12,"./_array-methods":16,"./_export":31}],87:[function(require,module,exports){
'use strict';
var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":24,"./_ctx":25,"./_export":31,"./_is-array-iter":41,"./_iter-call":44,"./_iter-detect":47,"./_to-length":76,"./_to-object":77,"./core.get-iterator-method":84}],88:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":12,"./_iter-define":46,"./_iter-step":48,"./_iterators":49,"./_to-iobject":75}],89:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var fails = require('./_fails');
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !require('./_strict-method')($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});

},{"./_a-function":11,"./_export":31,"./_fails":32,"./_strict-method":71,"./_to-object":77}],90:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var MAP = 'Map';

// 23.1 Map Objects
module.exports = require('./_collection')(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":22,"./_collection-strong":21,"./_validate-collection":80}],91:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":31,"./_set-proto":66}],92:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var SET = 'Set';

// 23.2 Set Objects
module.exports = require('./_collection')(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":22,"./_collection-strong":21,"./_validate-collection":80}],93:[function(require,module,exports){
var $export = require('./_export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./_string-repeat')
});

},{"./_export":31,"./_string-repeat":72}],94:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_an-object":14,"./_descriptors":27,"./_enum-keys":30,"./_export":31,"./_fails":32,"./_global":34,"./_has":35,"./_hide":36,"./_is-array":42,"./_is-object":43,"./_library":50,"./_meta":51,"./_object-create":52,"./_object-dp":53,"./_object-gopd":55,"./_object-gopn":57,"./_object-gopn-ext":56,"./_object-gops":58,"./_object-keys":61,"./_object-pie":62,"./_property-desc":63,"./_redefine":65,"./_set-to-string-tag":68,"./_shared":70,"./_to-iobject":75,"./_to-primitive":78,"./_uid":79,"./_wks":83,"./_wks-define":81,"./_wks-ext":82}],95:[function(require,module,exports){
var $iterators = require('./es6.array.iterator');
var getKeys = require('./_object-keys');
var redefine = require('./_redefine');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var wks = require('./_wks');
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}

},{"./_global":34,"./_hide":36,"./_iterators":49,"./_object-keys":61,"./_redefine":65,"./_wks":83,"./es6.array.iterator":88}],96:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);

},{}],97:[function(require,module,exports){
(function (global){
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if (typeof module === "object" && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    __extends = function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
                t[p[i]] = s[p[i]];
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function (m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    };

    __values = function (o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator];
        return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result["default"] = mod;
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[8])(8)
});