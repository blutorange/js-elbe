"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Methods_1 = require("./Methods");
function identity() {
    return x => x;
}
function toNumber() {
    return x => Number(x);
}
class StatisticsImpl {
    constructor() {
        this.Count = 0;
        this.Sum = 0;
        this.Sum2 = 0;
        this.Min = undefined;
        this.Max = undefined;
    }
    accept(value) {
        this.Sum += value;
        this.Sum2 += value * value;
        if (this.Count > 0) {
            this.Max = Math.max(this.Max, value);
            this.Min = Math.min(this.Min, value);
        }
        else {
            this.Min = this.Max = value;
        }
        this.Count += 1;
    }
    get average() {
        return this.Count > 0 ? this.Sum / this.Count : 0;
    }
    get count() {
        return this.Count;
    }
    get max() {
        return this.Max;
    }
    get min() {
        return this.Min;
    }
    get sum() {
        return this.Sum;
    }
    get variance() {
        if (this.Count === 0) {
            return Infinity;
        }
        const average = this.average;
        return this.Sum2 / this.Count - average * average;
    }
}
exports.Collectors = {
    toArray() {
        return {
            accumulator(collected, item) {
                collected.push(item);
            },
            supplier() {
                return [];
            },
            finisher: identity(),
        };
    },
    count() {
        return {
            accumulator(collected, item) {
                collected.count += 1;
            },
            supplier() {
                return {
                    count: 0,
                };
            },
            finisher(result) {
                return result.count;
            },
        };
    },
    toSet() {
        return {
            accumulator(collected, item) {
                collected.add(item);
            },
            supplier() {
                return new Set();
            },
            finisher: identity(),
        };
    },
    toMap(keyMapper, valueMapper) {
        return {
            accumulator(collected, item) {
                collected.set(keyMapper(item), valueMapper(item));
            },
            supplier() {
                return new Map();
            },
            finisher: identity(),
        };
    },
    group(classifier) {
        return {
            accumulator(collected, item) {
                const key = classifier(item);
                const list = collected.get(key);
                if (list === undefined) {
                    collected.set(key, [item]);
                }
                else {
                    list.push(item);
                }
            },
            supplier() {
                return new Map();
            },
            finisher: identity(),
        };
    },
    groupDown(classifier, downstream) {
        return {
            accumulator(collected, item) {
                const key = classifier(item);
                const list = collected.get(key);
                if (list === undefined) {
                    collected.set(key, [item]);
                }
                else {
                    list.push(item);
                }
            },
            supplier() {
                return new Map();
            },
            finisher(result) {
                const x = new Map();
                for (const [key, value] of result.entries()) {
                    x.set(key, Methods_1.collect(value[Symbol.iterator](), downstream));
                }
                return x;
            },
        };
    },
    join(delimiter = "", prefix, suffix) {
        return {
            accumulator(collected, item) {
                collected.push(String(item));
            },
            supplier() {
                return prefix !== undefined ? [prefix] : [];
            },
            finisher(result) {
                return result.join(delimiter);
            },
        };
    },
    sum(converter = toNumber()) {
        return {
            accumulator(collected, item) {
                collected.sum += converter(item);
            },
            supplier() {
                return { sum: 0 };
            },
            finisher(result) {
                return result.sum;
            },
        };
    },
    average(converter = toNumber()) {
        return {
            accumulator(collected, item) {
                collected.sum += converter(item);
                collected.count += 1;
            },
            supplier() {
                return { sum: 0, count: 0 };
            },
            finisher(result) {
                return result.count > 0 ? result.sum / result.count : 0;
            },
        };
    },
    averageGeometrically(converter = toNumber()) {
        return {
            accumulator(collected, item) {
                collected.product *= converter(item);
                collected.count += 1;
            },
            supplier() {
                return { product: 1, count: 0 };
            },
            finisher(result) {
                return result.count > 0 ? result.product / result.count : 0;
            },
        };
    },
    averageHarmonically(converter = toNumber()) {
        return {
            accumulator(collected, item) {
                collected.sum += 1.0 / converter(item);
                collected.count += 1;
            },
            supplier() {
                return { sum: 0, count: 0 };
            },
            finisher(result) {
                return result.count / result.sum;
            },
        };
    },
    summarize(converter = toNumber()) {
        return {
            accumulator(collected, item) {
                collected.accept(converter(item));
            },
            supplier() {
                return new StatisticsImpl();
            },
            finisher: identity(),
        };
    },
    factor() {
        return {
            accumulator(collected, item) {
                collected.product *= Number(item);
            },
            supplier() {
                return { product: 1 };
            },
            finisher(result) {
                return result.product;
            },
        };
    },
    partition(predicate) {
        return {
            accumulator(collected, item) {
                if (predicate(item)) {
                    collected.true.push(item);
                }
                else {
                    collected.false.push(item);
                }
            },
            supplier() {
                return {
                    false: [],
                    true: [],
                };
            },
            finisher: identity(),
        };
    },
    partitionDown(predicate, downstream) {
        return {
            accumulator(collected, item) {
                if (predicate(item)) {
                    collected.true.push(item);
                }
                else {
                    collected.false.push(item);
                }
            },
            supplier() {
                return {
                    false: [],
                    true: [],
                };
            },
            finisher(result) {
                return {
                    false: Methods_1.collect(result.false, downstream),
                    true: Methods_1.collect(result.true, downstream),
                };
            },
        };
    },
};
