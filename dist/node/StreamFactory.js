"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InplaceStream_1 = require("./InplaceStream");
const Methods_1 = require("./Methods");
const TypesafeStream_1 = require("./TypesafeStream");
function make(inplace, iterable) {
    return inplace ? new InplaceStream_1.InplaceStream(iterable) : new TypesafeStream_1.TypesafeStream(iterable);
}
function createFactory(inplace = true) {
    return {
        stream(iterable) {
            if (typeof iterable[Symbol.iterator] !== "function") {
                throw new Error("Passed value is not iterable: " + typeof iterable);
            }
            return make(inplace, iterable);
        },
        times(amount, start, end) {
            return make(inplace, Methods_1.times(amount, start, end));
        },
        generate(generator, amount = -1) {
            return make(inplace, Methods_1.generate(generator, amount));
        },
        iterate(seed, next, amount = -1) {
            return make(inplace, Methods_1.iterate(seed, next, amount));
        },
        repeat(item, amount = -1) {
            return make(inplace, Methods_1.repeat(item, amount));
        },
        fromObject(object) {
            return make(inplace, Methods_1.fromObject(object));
        },
        fromObjectKeys(object) {
            return make(inplace, Methods_1.fromObjectKeys(object));
        },
        fromObjectValues(object) {
            return make(inplace, Methods_1.fromObjectValues(object));
        },
    };
}
exports.TypesafeStreamFactory = createFactory(false);
exports.InplaceStreamFactory = createFactory(true);
exports.stream = exports.InplaceStreamFactory.stream;
