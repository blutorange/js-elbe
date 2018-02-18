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
    key: "clone",
    value: function clone(iterable) {
      return new this.constructor(iterable);
    }
  }, {
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
    key: "promise",
    value: function promise(promiseConverter) {
      this.check();
      return Methods_1.promise(this.iterable, promiseConverter).then(function (iterable) {
        return new InplaceStream(iterable);
      });
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
    value: function unique(comparator) {
      this.iterable = Methods_1.unique(this.iterable, comparator);
      return this;
    }
  }, {
    key: "uniqueBy",
    value: function uniqueBy(keyExtractor) {
      this.iterable = Methods_1.uniqueBy(this.iterable, keyExtractor);
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