"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Methods_1 = require("./Methods");
const AbstractStream_1 = require("./AbstractStream");
class InplaceStream extends AbstractStream_1.AbstractStream {
    concat(...iterables) {
        this.iterable = Methods_1.concat(this.iterable, ...iterables);
        return this;
    }
    distinct() {
        this.iterable = Methods_1.distinct(this.iterable);
        return this;
    }
    distinctBy(keyExtractor) {
        this.iterable = Methods_1.distinctBy(this.iterable, keyExtractor);
        return this;
    }
    flatMap(mapper) {
        this.iterable = Methods_1.flatMap(this.iterable, mapper);
        return this;
    }
    filter(predicate) {
        this.iterable = Methods_1.filter(this.iterable, predicate);
        return this;
    }
    limit(limitTo) {
        this.iterable = Methods_1.limit(this.iterable, limitTo);
        return this;
    }
    map(mapper) {
        this.iterable = Methods_1.map(this.iterable, mapper);
        return this;
    }
    reverse() {
        this.iterable = Methods_1.reverse(this.iterable);
        return this;
    }
    skip(toSkip) {
        this.iterable = Methods_1.skip(this.iterable, toSkip);
        return this;
    }
    sort(comparator) {
        this.iterable = Methods_1.sort(this.iterable, comparator);
        return this;
    }
    try(mapper) {
        this.iterable = Methods_1.doTry(this.iterable, mapper);
        return this;
    }
    static from(items) {
        return new InplaceStream(items);
    }
    static times(amount, start = 0, step = 1) {
        return new InplaceStream(Methods_1.times(amount, start, step));
    }
    static generate(generator, amount = -1) {
        return new InplaceStream(Methods_1.generate(generator, amount));
    }
    static iterate(seed, next, amount = -1) {
        return new InplaceStream(Methods_1.iterate(seed, next, amount));
    }
    static repeat(item, amount = -1) {
        return new InplaceStream(Methods_1.repeat(item, amount));
    }
}
exports.InplaceStream = InplaceStream;
;
exports.InplaceStreamFactory = {
    from: InplaceStream.from,
    generate: InplaceStream.generate,
    iterate: InplaceStream.iterate,
    repeat: InplaceStream.repeat,
    times: InplaceStream.times
};
