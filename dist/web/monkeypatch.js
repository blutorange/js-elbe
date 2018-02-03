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