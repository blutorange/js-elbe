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