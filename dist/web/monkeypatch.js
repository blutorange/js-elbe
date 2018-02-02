"use strict";

require("core-js/modules/es6.map");

require("core-js/modules/es6.set");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TypesafeStream_1 = require("./TypesafeStream");

var InplaceStream_1 = require("./InplaceStream");

var Methods_1 = require("./Methods");

function patch(type, getStream, wrapStream) {
  Object.defineProperty(type.prototype, "stream", {
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
  var stream = inplace ? InplaceStream_1.InplaceStreamFactory.from : TypesafeStream_1.TypesafeStreamFactory.from;
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
  patch(String, function (string) {
    return string;
  }, stream);
}

exports.monkeyPatch = monkeyPatch;
;