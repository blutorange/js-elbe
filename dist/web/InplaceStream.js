"use strict";

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.object.set-prototype-of");

require("core-js/modules/es6.string.repeat");

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
    key: "concat",
    value: function concat() {
      for (var _len = arguments.length, iterables = new Array(_len), _key = 0; _key < _len; _key++) {
        iterables[_key] = arguments[_key];
      }

      this.iterable = Methods_1.concat.apply(Methods_1, [this.iterable].concat(iterables));
      return this;
    }
  }, {
    key: "unique",
    value: function unique() {
      this.iterable = Methods_1.unique(this.iterable);
      return this;
    }
  }, {
    key: "uniqueBy",
    value: function uniqueBy(keyExtractor) {
      this.iterable = Methods_1.uniqueBy(this.iterable, keyExtractor);
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
    key: "process",
    value: function process(consumer) {
      this.iterable = Methods_1.process(this.iterable, consumer);
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
    key: "sort",
    value: function sort(comparator) {
      this.iterable = Methods_1.sort(this.iterable, comparator);
      return this;
    }
  }, {
    key: "try",
    value: function _try(mapper) {
      this.iterable = Methods_1.doTry(this.iterable, mapper);
      return this;
    }
  }], [{
    key: "from",
    value: function from(items) {
      return new InplaceStream(items);
    }
  }, {
    key: "times",
    value: function times(amount, start, end) {
      return new InplaceStream(Methods_1.times(amount, start, end));
    }
  }, {
    key: "generate",
    value: function generate(generator) {
      var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
      return new InplaceStream(Methods_1.generate(generator, amount));
    }
  }, {
    key: "iterate",
    value: function iterate(seed, next) {
      var amount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
      return new InplaceStream(Methods_1.iterate(seed, next, amount));
    }
  }, {
    key: "repeat",
    value: function repeat(item) {
      var amount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
      return new InplaceStream(Methods_1.repeat(item, amount));
    }
  }, {
    key: "fromObject",
    value: function fromObject(object) {
      return new InplaceStream(Methods_1.fromObject(object));
    }
  }, {
    key: "fromObjectKeys",
    value: function fromObjectKeys(object) {
      return new InplaceStream(Methods_1.fromObjectKeys(object));
    }
  }, {
    key: "fromObjectValues",
    value: function fromObjectValues(object) {
      return new InplaceStream(Methods_1.fromObjectValues(object));
    }
  }]);

  return InplaceStream;
}(AbstractStream_1.AbstractStream);

;
exports.InplaceStreamFactory = {
  from: InplaceStream.from,
  generate: InplaceStream.generate,
  iterate: InplaceStream.iterate,
  repeat: InplaceStream.repeat,
  times: InplaceStream.times,
  fromObject: InplaceStream.fromObject,
  fromObjectKeys: InplaceStream.fromObjectKeys,
  fromObjectValues: InplaceStream.fromObjectValues
};