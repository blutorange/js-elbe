"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Methods_1 = require("./Methods");
const AbstractStream_1 = require("./AbstractStream");
class TypesafeStream extends AbstractStream_1.AbstractStream {
    concat(...iterables) {
        this.check();
        return new TypesafeStream(Methods_1.concat(this.iterable, ...iterables));
    }
    unique() {
        this.check();
        return new TypesafeStream(Methods_1.unique(this.iterable));
    }
    uniqueBy(keyExtractor) {
        this.check();
        return new TypesafeStream(Methods_1.uniqueBy(this.iterable, keyExtractor));
    }
    flatMap(mapper) {
        this.check();
        return new TypesafeStream(Methods_1.flatMap(this.iterable, mapper));
    }
    filter(predicate) {
        this.check();
        return new TypesafeStream(Methods_1.filter(this.iterable, predicate));
    }
    index() {
        return new TypesafeStream(Methods_1.index(this.iterable));
    }
    limit(limitTo) {
        this.check();
        return new TypesafeStream(Methods_1.limit(this.iterable, limitTo));
    }
    map(mapper) {
        this.check();
        return new TypesafeStream(Methods_1.map(this.iterable, mapper));
    }
    process(consumer) {
        this.check();
        return new TypesafeStream(Methods_1.process(this.iterable, consumer));
    }
    reverse() {
        this.check();
        return new TypesafeStream(Methods_1.reverse(this.iterable));
    }
    skip(toSkip) {
        this.check();
        return new TypesafeStream(Methods_1.skip(this.iterable, toSkip));
    }
    sort(comparator) {
        this.check();
        return new TypesafeStream(Methods_1.sort(this.iterable, comparator));
    }
    try(mapper) {
        this.check();
        return new TypesafeStream(Methods_1.doTry(this.iterable, mapper));
    }
    static from(items) {
        return new TypesafeStream(items);
    }
    static generate(generator, amount = -1) {
        return new TypesafeStream(Methods_1.generate(generator, amount));
    }
    static iterate(seed, next, amount = -1) {
        return new TypesafeStream(Methods_1.iterate(seed, next, amount));
    }
    static repeat(item, amount = -1) {
        return new TypesafeStream(Methods_1.repeat(item, amount));
    }
    static times(amount, start, end) {
        return new TypesafeStream(Methods_1.times(amount, start, end));
    }
    static fromObject(object) {
        return new TypesafeStream(Methods_1.fromObject(object));
    }
    static fromObjectKeys(object) {
        return new TypesafeStream(Methods_1.fromObjectKeys(object));
    }
    static fromObjectValues(object) {
        return new TypesafeStream(Methods_1.fromObjectValues(object));
    }
}
;
exports.TypesafeStreamFactory = {
    from: TypesafeStream.from,
    generate: TypesafeStream.generate,
    iterate: TypesafeStream.iterate,
    repeat: TypesafeStream.repeat,
    times: TypesafeStream.times,
    fromObject: TypesafeStream.fromObject,
    fromObjectKeys: TypesafeStream.fromObjectKeys,
    fromObjectValues: TypesafeStream.fromObjectValues,
};
