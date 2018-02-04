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
        return new this.constructor(Methods_1.concat(this.iterable, ...iterables));
    }
    cycle(count) {
        this.check();
        return new this.constructor(Methods_1.cycle(this.iterable, count));
    }
    flatMap(mapper) {
        this.check();
        return new TypesafeStream(Methods_1.flatMap(this.iterable, mapper));
    }
    filter(predicate) {
        this.check();
        return new this.constructor(Methods_1.filter(this.iterable, predicate));
    }
    index() {
        this.check();
        return new TypesafeStream(Methods_1.index(this.iterable));
    }
    limit(limitTo) {
        this.check();
        return new this.constructor(Methods_1.limit(this.iterable, limitTo));
    }
    map(mapper) {
        this.check();
        return new TypesafeStream(Methods_1.map(this.iterable, mapper));
    }
    visit(consumer) {
        this.check();
        return new this.constructor(Methods_1.visit(this.iterable, consumer));
    }
    reverse() {
        this.check();
        return new this.constructor(Methods_1.reverse(this.iterable));
    }
    skip(toSkip) {
        this.check();
        return new this.constructor(Methods_1.skip(this.iterable, toSkip));
    }
    slice(sliceSize) {
        this.check();
        return new TypesafeStream(Methods_1.slice(this.iterable, sliceSize));
    }
    sort(comparator) {
        this.check();
        return new this.constructor(Methods_1.sort(this.iterable, comparator));
    }
    try(operation) {
        this.check();
        return new TryStreamImpl(Methods_1.tryMap(this.iterable, operation));
    }
    unique(keyExtractor) {
        this.check();
        return new this.constructor(Methods_1.unique(this.iterable, keyExtractor));
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
class TryStreamImpl extends TypesafeStream {
    forEachResult(success, error) {
        return this.forEach(x => x.ifPresent(success, error));
    }
    include(predicate) {
        return this.visit(x => x.include(predicate));
    }
    onError(handler) {
        return this.visit(x => x.ifAbsent(e => handler(e)));
    }
    onSuccess(success, failure) {
        return this.visit(x => x.ifPresent(success, failure));
    }
    orThrow() {
        return this.map(x => x.orThrow());
    }
    orElse(backup) {
        return this.map(x => x.orElse(backup));
    }
    discardError(handler = console.error) {
        return this.onError(handler).filter(x => x.success).orThrow();
    }
    flatConvert(operation, backup) {
        this.check();
        let x = Methods_1.map(this.iterable, x => x.flatConvert(operation, backup));
        return new this.constructor(x);
    }
    convert(operation, backup) {
        this.check();
        let x = Methods_1.map(this.iterable, x => x.convert(operation, backup));
        return new this.constructor(x);
    }
    orTry(backup) {
        this.check();
        let x = Methods_1.map(this.iterable, y => y.orTry(backup));
        return new this.constructor(x);
    }
}
