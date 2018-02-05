"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Methods_1 = require("./Methods");
const InplaceStream_1 = require("./InplaceStream");
const TypesafeStream_1 = require("./TypesafeStream");
function createFactory(inplace = true) {
    const clazz = inplace ? InplaceStream_1.InplaceStream : TypesafeStream_1.TypesafeStream;
    return {
        stream(iterable) {
            if (typeof iterable[Symbol.iterator] !== "function") {
                throw new Error("Passed value is not iterable: " + typeof iterable);
            }
            return new clazz(iterable);
        },
        times(amount, start, end) {
            return new clazz(Methods_1.times(amount, start, end));
        },
        generate(generator, amount = -1) {
            return new clazz(Methods_1.generate(generator, amount));
        },
        iterate(seed, next, amount = -1) {
            return new clazz(Methods_1.iterate(seed, next, amount));
        },
        repeat(item, amount = -1) {
            return new clazz(Methods_1.repeat(item, amount));
        },
        fromObject(object) {
            return new clazz(Methods_1.fromObject(object));
        },
        fromObjectKeys(object) {
            return new clazz(Methods_1.fromObjectKeys(object));
        },
        fromObjectValues(object) {
            return new clazz(Methods_1.fromObjectValues(object));
        },
    };
}
;
exports.TypesafeStreamFactory = createFactory(false);
exports.InplaceStreamFactory = createFactory(true);
exports.stream = exports.InplaceStreamFactory.stream;
