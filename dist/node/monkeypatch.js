"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StreamFactory_1 = require("./StreamFactory");
const Methods_1 = require("./Methods");
function patch(type, getStream, wrapStream, name = "stream") {
    Object.defineProperty(type.prototype, "stream", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function () {
            return wrapStream(getStream(this));
        }
    });
}
;
function monkeyPatch(inplace = false) {
    const stream = inplace ? StreamFactory_1.InplaceStreamFactory.stream : StreamFactory_1.TypesafeStreamFactory.stream;
    patch(Array, array => array, stream);
    patch(Set, set => set.values(), stream);
    patch(Map, map => map.entries(), stream);
    patch(Object, object => Methods_1.fromObject(object), stream);
    patch(Object, object => Methods_1.fromObjectKeys(object), stream, "keys");
    patch(Object, object => Methods_1.fromObjectValues(object), stream, "values");
    patch(String, string => string, stream);
}
exports.monkeyPatch = monkeyPatch;
;
