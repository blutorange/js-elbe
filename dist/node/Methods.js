"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comparators_1 = require("comparators");
const Collectors_1 = require("./Collectors");
const Try_1 = require("./Try");
const hasOwnProperty = Object.prototype.hasOwnProperty;
function* map(iterable, mapper) {
    for (let item of iterable) {
        yield mapper(item);
    }
}
exports.map = map;
function* flatMap(iterable, mapper) {
    for (let item of iterable) {
        for (let i of mapper(item)) {
            yield i;
        }
    }
}
exports.flatMap = flatMap;
function* chunk(iterable, classifier) {
    let currentClass = undefined;
    let first = true;
    let index = -1;
    let chunk = [];
    for (let item of iterable) {
        const clazz = classifier(item, ++index);
        if (!first && currentClass !== clazz) {
            yield chunk;
            chunk = [];
        }
        first = false;
        currentClass = clazz;
        chunk.push(item);
    }
    if (chunk.length > 0) {
        yield chunk;
    }
}
exports.chunk = chunk;
function* slice(iterable, sliceSize) {
    sliceSize = Math.max(sliceSize, 1);
    let count = sliceSize;
    let chunk = [];
    for (let item of iterable) {
        --count;
        chunk.push(item);
        if (count < 1) {
            yield chunk;
            chunk = [];
            count = sliceSize;
        }
    }
    if (chunk.length > 0) {
        yield chunk;
    }
}
exports.slice = slice;
function* zip(iterable, other) {
    const it1 = iterable[Symbol.iterator]();
    const it2 = other[Symbol.iterator]();
    let res1 = it1.next();
    let res2 = it2.next();
    while (!res1.done || !res2.done) {
        yield [res1.done ? undefined : res1.value, res2.done ? undefined : res2.value];
        res1 = it1.next();
        res2 = it2.next();
    }
}
exports.zip = zip;
function* zipSame(iterable, others) {
    const it = [iterable[Symbol.iterator]()];
    for (let other of others) {
        it.push(other[Symbol.iterator]());
    }
    let res = it.map(x => x.next());
    while (!res.every(x => x.done)) {
        yield res.map(x => x.done ? undefined : x.value);
        res = it.map(x => x.next());
    }
}
exports.zipSame = zipSame;
function* filter(iterable, predicate) {
    for (let item of iterable) {
        if (predicate(item)) {
            yield item;
        }
    }
}
exports.filter = filter;
function* tryMap(iterable, mapper) {
    for (let item of iterable) {
        yield Try_1.TryFactory.of(() => mapper(item));
    }
}
exports.tryMap = tryMap;
function tryCompute(iterable, operation) {
    return Try_1.TryFactory.of(() => operation(iterable));
}
exports.tryCompute = tryCompute;
function partition(iterable, discriminator) {
    return collect(iterable, Collectors_1.Collectors.partition(discriminator));
}
exports.partition = partition;
;
function group(iterable, classifier) {
    return collect(iterable, Collectors_1.Collectors.group(classifier));
}
exports.group = group;
;
function join(iterable, delimiter = "", prefix, suffix) {
    return collect(iterable, Collectors_1.Collectors.join(delimiter, prefix, suffix));
}
exports.join = join;
function sort(iterable, comparator) {
    const arr = Array.from(iterable);
    arr.sort(comparator);
    return arr[Symbol.iterator]();
}
exports.sort = sort;
function* unique(iterable, keyExtractor) {
    if (keyExtractor === undefined) {
        return new Set(iterable).values();
    }
    const set = new Set();
    for (let item of iterable) {
        const key = keyExtractor(item);
        if (!set.has(key)) {
            yield item;
            set.add(key);
        }
    }
}
exports.unique = unique;
function* index(iterable) {
    let i = 0;
    for (let item of iterable) {
        yield [i, item];
        i += 1;
    }
}
exports.index = index;
;
function* limit(iterable, limit) {
    for (let item of iterable) {
        yield item;
        if (--limit < 1) {
            break;
        }
    }
}
exports.limit = limit;
function* cycle(iterable, count = Infinity) {
    count = Math.max(0, count);
    const items = Array.from(iterable);
    for (let i = 0; i < count; ++i) {
        for (let item of items) {
            yield item;
        }
    }
}
exports.cycle = cycle;
function* visit(iterable, consumer) {
    for (let item of iterable) {
        consumer(item);
        yield item;
    }
}
exports.visit = visit;
function* skip(iterable, skip) {
    const it = iterable[Symbol.iterator]();
    while (skip-- > 0) {
        if (it.next().done) {
            break;
        }
    }
    for (let entry = it.next(); !entry.done; entry = it.next()) {
        yield entry.value;
    }
}
exports.skip = skip;
function* reverse(iterable) {
    const arr = Array.from(iterable);
    for (let i = arr.length; i-- > 0;) {
        yield arr[i];
    }
}
exports.reverse = reverse;
function* concat(iterable, ...moreIterables) {
    for (let item of iterable) {
        yield item;
    }
    for (let iterable of moreIterables) {
        for (let item of iterable) {
            yield item;
        }
    }
}
exports.concat = concat;
function size(iterable) {
    let i = 0;
    for (let it = iterable[Symbol.iterator](); !it.next().done;)
        ++i;
    return i;
}
exports.size = size;
function find(iterable, predicate) {
    for (let item of iterable) {
        if (predicate(item)) {
            return item;
        }
    }
    return undefined;
}
exports.find = find;
function every(iterable, predicate) {
    for (let item of iterable) {
        if (!predicate(item)) {
            return false;
        }
    }
    return true;
}
exports.every = every;
function some(iterable, predicate) {
    for (let item of iterable) {
        if (predicate(item)) {
            return true;
        }
    }
    return false;
}
exports.some = some;
function none(iterable, predicate) {
    return !some(iterable, predicate);
}
exports.none = none;
function has(iterable, object) {
    return some(iterable, item => item === object);
}
exports.has = has;
function min(iterable, comparator = comparators_1.natural) {
    let first = true;
    let min;
    for (let item of iterable) {
        if (first) {
            min = item;
        }
        else {
            if (comparator(item, min) < 0) {
                min = item;
            }
        }
    }
    return min;
}
exports.min = min;
function max(iterable, comparator = comparators_1.natural) {
    let first = true;
    let min;
    for (let item of iterable) {
        if (first) {
            min = item;
        }
        else {
            if (comparator(item, min) > 0) {
                min = item;
            }
        }
    }
    return min;
}
exports.max = max;
function reduce(iterable, reducer, initialValue) {
    for (let item of iterable) {
        initialValue = reducer(initialValue, item);
    }
    return initialValue;
}
exports.reduce = reduce;
function reduceSame(iterable, reducer) {
    let reduced;
    let first = true;
    for (let item of iterable) {
        if (first) {
            reduced = item;
            first = false;
        }
        else {
            reduced = reducer(reduced, item);
        }
    }
    return reduced;
}
exports.reduceSame = reduceSame;
function sum(iterable, converter) {
    return collect(iterable, Collectors_1.Collectors.sum(converter));
}
exports.sum = sum;
;
function end(iterable) {
    const it = iterable[Symbol.iterator]();
    while (!it.next().done)
        ;
}
exports.end = end;
function collect(iterable, collector) {
    return collectWith(iterable, collector.supplier, collector.accumulator, collector.finisher);
}
exports.collect = collect;
;
function collectWith(iterable, supplier, accumulator, finisher) {
    const collected = supplier();
    for (let item of iterable) {
        accumulator(collected, item);
    }
    return finisher(collected);
}
exports.collectWith = collectWith;
;
function toArray(iterable) {
    return Array.from(iterable);
}
exports.toArray = toArray;
function toSet(iterable) {
    return new Set(iterable);
}
exports.toSet = toSet;
function toMap(iterable, keyMapper, valueMapper) {
    return collect(iterable, Collectors_1.Collectors.toMap(keyMapper, valueMapper));
}
exports.toMap = toMap;
function* fromObject(object) {
    for (let key in object) {
        if (hasOwnProperty.call(object, key)) {
            yield [key, object[key]];
        }
    }
}
exports.fromObject = fromObject;
function* fromObjectKeys(object) {
    for (let key in object) {
        if (hasOwnProperty.call(object, key)) {
            yield key;
        }
    }
}
exports.fromObjectKeys = fromObjectKeys;
function* fromObjectValues(object) {
    for (let key in object) {
        if (hasOwnProperty.call(object, key)) {
            yield object[key];
        }
    }
}
exports.fromObjectValues = fromObjectValues;
function* generate(generator, amount = Infinity) {
    amount = Math.max(0, amount);
    for (let i = 0; i < amount; ++i) {
        yield generator(i);
    }
}
exports.generate = generate;
function* times(amount, start = 0, end = start + amount - 1) {
    amount = Math.floor(Math.max(0, amount));
    let step = amount > 1 ? (end - start) / (amount - 1) : 0;
    if (!isFinite(step)) {
        step = NaN;
    }
    const half = Math.floor(amount / 2);
    for (let i = 0; i < half; ++i) {
        yield start + i * step;
    }
    for (let i = amount - half - 1; i >= 0; --i) {
        yield end - i * step;
    }
}
exports.times = times;
function* repeat(item, amount = Infinity) {
    amount = Math.max(0, amount);
    for (let i = 0; i < amount; ++i) {
        yield item;
    }
}
exports.repeat = repeat;
;
function* iterate(seed, next, amount = Infinity) {
    amount = Math.max(0, amount);
    for (let i = 0; i < amount; ++i) {
        yield seed;
        seed = next(seed);
    }
}
exports.iterate = iterate;
