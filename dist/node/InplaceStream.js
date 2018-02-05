"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Methods_1 = require("./Methods");
const AbstractStream_1 = require("./AbstractStream");
class InplaceStream extends AbstractStream_1.AbstractStream {
    chunk(classifier) {
        this.iterable = Methods_1.chunk(this.iterable, classifier);
        return this;
    }
    concat(...iterables) {
        this.iterable = Methods_1.concat(this.iterable, ...iterables);
        return this;
    }
    cycle(count) {
        this.iterable = Methods_1.cycle(this.iterable, count);
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
    index() {
        this.iterable = Methods_1.index(this.iterable);
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
    promise(promiseConverter) {
        this.check();
        return Methods_1.promise(this.iterable, promiseConverter)
            .then(iterable => new InplaceStream(iterable));
    }
    visit(consumer) {
        this.iterable = Methods_1.visit(this.iterable, consumer);
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
    slice(sliceSize) {
        this.iterable = Methods_1.slice(this.iterable, sliceSize);
        return this;
    }
    sort(comparator) {
        this.iterable = Methods_1.sort(this.iterable, comparator);
        return this;
    }
    try(operation) {
        let x = Methods_1.tryMap(this.iterable, operation);
        return new TryStreamImpl(x);
    }
    unique(comparator) {
        this.iterable = Methods_1.unique(this.iterable, comparator);
        return this;
    }
    uniqueBy(keyExtractor) {
        this.iterable = Methods_1.uniqueBy(this.iterable, keyExtractor);
        return this;
    }
    zip(other) {
        this.iterable = Methods_1.zip(this.iterable, other);
        return this;
    }
    zipSame(...others) {
        this.iterable = Methods_1.zipSame(this.iterable, others);
        return this;
    }
}
exports.InplaceStream = InplaceStream;
;
class TryStreamImpl extends InplaceStream {
    forEachResult(success, error) {
        if (error === undefined) {
            error = console.error;
        }
        return this.forEach(x => x.ifPresent(success, error));
    }
    include(predicate) {
        return this.visit(x => x.include(predicate));
    }
    onError(handler) {
        return this.visit((x) => x.ifAbsent(e => handler(e)));
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
        this.iterable = Methods_1.map(this.iterable, x => x.flatConvert(operation, backup));
        return this;
    }
    convert(operation, backup) {
        this.iterable = Methods_1.map(this.iterable, x => x.convert(operation, backup));
        return this;
    }
    orTry(backup) {
        this.iterable = Methods_1.map(this.iterable, y => y.orTry(backup));
        return this;
    }
}
