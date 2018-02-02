"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comparators_1 = require("comparators");
const Methods_1 = require("./Methods");
const IDENTITY = x => x;
class Stream {
    constructor(iterable) {
        this.done = false;
        this.iterable = iterable;
    }
    check() {
        if (this.done) {
            throw new Error("Stream was already consumed.");
        }
        this.done = true;
    }
    [Symbol.iterator]() {
        this.check();
        return this.iterable[Symbol.iterator]();
    }
    concat(...iterables) {
        this.check();
        return new Stream(Methods_1.concat(this.iterable, ...iterables));
    }
    collect(collector) {
        this.check();
        return Methods_1.collect(this.iterable, collector);
    }
    collectWith(supplier, accumulator, finisher = IDENTITY) {
        this.check();
        return Methods_1.collectWith(this.iterable, supplier, accumulator, finisher);
    }
    distinct() {
        this.check();
        return new Stream(Methods_1.distinct(this.iterable));
    }
    distinctBy(keyExtractor) {
        this.check();
        return new Stream(Methods_1.distinctBy(this.iterable, keyExtractor));
    }
    every(predicate) {
        this.check();
        return Methods_1.every(this.iterable, predicate);
    }
    find(predicate) {
        this.check();
        return Methods_1.find(this.iterable, predicate);
    }
    flatMap(mapper) {
        this.check();
        return new Stream(Methods_1.flatMap(this.iterable, mapper));
    }
    filter(predicate) {
        this.check();
        return new Stream(Methods_1.filter(this.iterable, predicate));
    }
    forEach(consumer) {
        this.check();
        for (let item of this.iterable) {
            consumer(item);
        }
    }
    has(object) {
        this.check();
        return Methods_1.has(this.iterable, object);
    }
    limit(limitTo) {
        this.check();
        return new Stream(Methods_1.limit(this.iterable, limitTo));
    }
    map(mapper) {
        this.check();
        return new Stream(Methods_1.map(this.iterable, mapper));
    }
    max(comparator = comparators_1.natural) {
        this.check();
        return Methods_1.max(this.iterable, comparator);
    }
    min(comparator = comparators_1.natural) {
        this.check();
        return Methods_1.min(this.iterable, comparator);
    }
    reduce(reducer, initialValue) {
        this.check();
        return Methods_1.reduce(this.iterable, reducer, initialValue);
    }
    reduceSame(reducer) {
        this.check();
        return Methods_1.reduceSame(this.iterable, reducer);
    }
    reduceWith(reducer, initialValue) {
        this.check();
        return Methods_1.reduce(this.iterable, reducer, initialValue);
    }
    reverse() {
        this.check();
        return new Stream(Methods_1.reverse(this.iterable));
    }
    size() {
        this.check();
        return Methods_1.size(this.iterable);
    }
    skip(toSkip) {
        this.check();
        return new Stream(Methods_1.skip(this.iterable, toSkip));
    }
    some(predicate) {
        this.check();
        return Methods_1.some(this.iterable, predicate);
    }
    sort(comparator) {
        this.check();
        return new Stream(Methods_1.sort(this.iterable, comparator));
    }
    toArray() {
        this.check();
        return Methods_1.toArray(this.iterable);
    }
    toSet() {
        this.check();
        return Methods_1.toSet(this.iterable);
    }
    toMap(keyMapper, valueMapper) {
        this.check();
        return Methods_1.toMap(this.iterable, keyMapper, valueMapper);
    }
    static from(items) {
        return new Stream(items);
    }
    static generate(generator, amount = -1) {
        return new Stream(Methods_1.generate(generator, amount));
    }
    static iterate(seed, next, amount = -1) {
        return new Stream(Methods_1.iterate(seed, next, amount));
    }
    static repeat(item, amount = -1) {
        return new Stream(Methods_1.repeat(item, amount));
    }
    static times(amount, start = 0, step = 1) {
        return new Stream(Methods_1.times(amount, start, step));
    }
}
exports.Stream = Stream;
