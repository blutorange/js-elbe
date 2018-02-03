"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Methods_1 = require("./Methods");
const AbstractStream_1 = require("./AbstractStream");
class TypesafeStream extends AbstractStream_1.AbstractStream {
    chunk(classifier) {
        this.check();
        return new TypesafeStream(Methods_1.chunk(this.iterable, classifier));
    }
    concat(...iterables) {
        this.check();
        return new TypesafeStream(Methods_1.concat(this.iterable, ...iterables));
    }
    cycle(count) {
        this.check();
        return new TypesafeStream(Methods_1.cycle(this.iterable, count));
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
    visit(consumer) {
        this.check();
        return new TypesafeStream(Methods_1.visit(this.iterable, consumer));
    }
    reverse() {
        this.check();
        return new TypesafeStream(Methods_1.reverse(this.iterable));
    }
    skip(toSkip) {
        this.check();
        return new TypesafeStream(Methods_1.skip(this.iterable, toSkip));
    }
    slice(sliceSize) {
        this.check();
        return new TypesafeStream(Methods_1.slice(this.iterable, sliceSize));
    }
    sort(comparator) {
        this.check();
        return new TypesafeStream(Methods_1.sort(this.iterable, comparator));
    }
    try(mapper) {
        this.check();
        return new TypesafeStream(Methods_1.doTry(this.iterable, mapper));
    }
    unique(keyExtractor) {
        this.check();
        return new TypesafeStream(Methods_1.unique(this.iterable, keyExtractor));
    }
    zip(other) {
        this.check();
        return new TypesafeStream(Methods_1.zip(this.iterable, other));
    }
    zipSame(...others) {
        this.check();
        return new TypesafeStream(Methods_1.zipSame(this.iterable, others));
    }
}
exports.TypesafeStream = TypesafeStream;
;
