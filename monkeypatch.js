"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Stream_1 = require("./Stream");
const InplaceStream_1 = require("./InplaceStream");
const Methods_1 = require("./Methods");
function patch(type, getStream, wrapStream) {
    Object.defineProperty(type.prototype, "stream", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function () {
            return wrapStream(getStream(this));
        }
    });
}
function monkeyPatch(types, inplace = false) {
    const stream = inplace ? InplaceStream_1.InplaceStream.from : Stream_1.TypesafeStream.from;
    patch(Array, array => array, stream);
    patch(Set, set => set.values(), stream);
    patch(Map, map => map.entries(), stream);
    patch(Object, object => Methods_1.fromObject(object), stream);
}
exports.monkeyPatch = monkeyPatch;
