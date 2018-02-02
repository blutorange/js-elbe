"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comparators_1 = require("comparators");
const Methods_1 = require("./Methods");
const IDENTITY = x => x;
class AbstractStream {
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
    collect(collector) {
        this.check();
        return Methods_1.collect(this.iterable, collector);
    }
    collectWith(supplier, accumulator, finisher = IDENTITY) {
        this.check();
        return Methods_1.collectWith(this.iterable, supplier, accumulator, finisher);
    }
    every(predicate) {
        this.check();
        return Methods_1.every(this.iterable, predicate);
    }
    find(predicate) {
        this.check();
        return Methods_1.find(this.iterable, predicate);
    }
    forEach(consumer) {
        this.check();
        for (let item of this.iterable) {
            consumer(item);
        }
    }
    group(classifier) {
        this.check();
        return Methods_1.group(this.iterable, classifier);
    }
    has(object) {
        this.check();
        return Methods_1.has(this.iterable, object);
    }
    join(delimiter = "", prefix, suffix) {
        this.check();
        return Methods_1.join(this.iterable, delimiter, prefix, suffix);
    }
    max(comparator = comparators_1.natural) {
        this.check();
        return Methods_1.max(this.iterable, comparator);
    }
    min(comparator = comparators_1.natural) {
        this.check();
        return Methods_1.min(this.iterable, comparator);
    }
    partition(predicate) {
        this.check();
        return Methods_1.partition(this.iterable, predicate);
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
    size() {
        this.check();
        return Methods_1.size(this.iterable);
    }
    some(predicate) {
        this.check();
        return Methods_1.some(this.iterable, predicate);
    }
    toArray() {
        this.check();
        return Methods_1.toArray(this.iterable);
    }
    toSet() {
        this.check();
        return Methods_1.toSet(this.iterable);
    }
    toJSON() {
        this.check();
        return this.toArray();
    }
    toString() {
        return `Stream[done=${this.done}]`;
    }
    toMap(keyMapper, valueMapper) {
        this.check();
        return Methods_1.toMap(this.iterable, keyMapper, valueMapper);
    }
}
exports.AbstractStream = AbstractStream;
