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

      return new TypesafeStream(Methods_1.concat.apply(Methods_1, [this.iterable].concat(iterables)));
    }
  }, {
    key: "cycle",
    value: function cycle(count) {
      this.check();
      return new TypesafeStream(Methods_1.cycle(this.iterable, count));
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
      return new TypesafeStream(Methods_1.filter(this.iterable, predicate));
    }
  }, {
    key: "index",
    value: function index() {
      return new TypesafeStream(Methods_1.index(this.iterable));
    }
  }, {
    key: "limit",
    value: function limit(limitTo) {
      this.check();
      return new TypesafeStream(Methods_1.limit(this.iterable, limitTo));
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
      return new TypesafeStream(Methods_1.visit(this.iterable, consumer));
    }
  }, {
    key: "reverse",
    value: function reverse() {
      this.check();
      return new TypesafeStream(Methods_1.reverse(this.iterable));
    }
  }, {
    key: "skip",
    value: function skip(toSkip) {
      this.check();
      return new TypesafeStream(Methods_1.skip(this.iterable, toSkip));
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
      return new TypesafeStream(Methods_1.sort(this.iterable, comparator));
    }
  }, {
    key: "try",
    value: function _try(mapper) {
      this.check();
      return new TypesafeStream(Methods_1.doTry(this.iterable, mapper));
    }
  }, {
    key: "unique",
    value: function unique(keyExtractor) {
      this.check();
      return new TypesafeStream(Methods_1.unique(this.iterable, keyExtractor));
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