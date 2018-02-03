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