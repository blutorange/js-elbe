"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comparators_1 = require("comparators");
const Collectors_1 = require("./Collectors");
const Try_1 = require("./Try");
const hasOwnProperty = Object.prototype.hasOwnProperty;
const IDENTITY = x => x;
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
function* filter(iterable, predicate) {
    for (let item of iterable) {
        if (predicate(item)) {
            yield item;
        }
    }
}
exports.filter = filter;
function* doTry(iterable, mapper) {
    for (let item of iterable) {
        yield Try_1.TryFactory.of(() => mapper(item));
    }
}
exports.doTry = doTry;
function partition(iterable, predicate) {
    return collect(iterable, Collectors_1.Collectors.partition(predicate));
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
function distinct(iterable) {
    const set = new Set(iterable);
    return set.values();
}
exports.distinct = distinct;
function* distinctBy(iterable, keyExtractor) {
    const set = new Set();
    for (let item of iterable) {
        const key = keyExtractor(item);
        if (!set.has(key)) {
            yield item;
            set.add(key);
        }
    }
}
exports.distinctBy = distinctBy;
function* limit(iterable, limit) {
    for (let item of iterable) {
        yield item;
        if (--limit < 1) {
            return;
        }
    }
}
exports.limit = limit;
function* skip(iterable, skip) {
    const it = iterable[Symbol.iterator]();
    while (skip-- > 0) {
        if (it.next().done) {
            return;
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
    for (let item of iterable)
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
function collect(iterable, collector) {
    return collectWith(iterable, collector.supplier, collector.accumulator, collector.finisher);
}
exports.collect = collect;
function collectWith(iterable, supplier, accumulator, finisher = IDENTITY) {
    const collected = supplier();
    for (let item of iterable) {
        accumulator(collected, item);
    }
    return finisher(collected);
}
exports.collectWith = collectWith;
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
function* generate(generator, amount = -1) {
    for (let i = 0; i < amount; ++i) {
        yield generator(i);
    }
}
exports.generate = generate;
function* times(amount, start = 0, step = 1) {
    for (let i = 0, j = start; i < amount; ++i, j += step) {
        yield j;
    }
}
exports.times = times;
function* repeat(item, amount = -1) {
    for (let i = 0; i < amount; ++i) {
        yield item;
    }
}
exports.repeat = repeat;
function* iterate(seed, next, amount = -1) {
    for (let i = 0; i < amount; ++i) {
        yield seed;
        seed = next(seed);
    }
}
exports.iterate = iterate;
