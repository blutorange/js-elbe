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
        this._count = 0;
        this._sum = 0;
        this._sum2 = 0;
        this._min = undefined;
        this._max = undefined;
    }
    accept(value) {
        this._sum += value;
        this._sum2 += value * value;
        if (this._count > 0) {
            this._max = Math.max(this._max, value);
            this._min = Math.min(this._min, value);
        }
        else {
            this._min = this._max = value;
        }
        this._count += 1;
    }
    get average() {
        return this._count > 0 ? this._sum / this._count : 0;
    }
    get count() {
        return this._count;
    }
    get max() {
        return this._max;
    }
    get min() {
        return this._min;
    }
    get sum() {
        return this._sum;
    }
    get variance() {
        if (this._count === 0) {
            return Infinity;
        }
        const average = this.average;
        return this._sum2 / this._count - average * average;
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
            finisher: identity()
        };
    },
    count() {
        return {
            accumulator(collected, item) {
                collected.count += 1;
            },
            supplier() {
                return {
                    count: 0
                };
            },
            finisher(result) {
                return result.count;
            }
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
            finisher: identity()
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
            finisher: identity()
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
            finisher: identity()
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
                for (let [key, value] of result.entries()) {
                    x.set(key, Methods_1.collect(value[Symbol.iterator](), downstream));
                }
                return x;
            }
        };
    },
    join(delimiter = "", prefix, suffix) {
        return {
            accumulator(collected, item) {
                collected.push(String(item));
            },
            supplier() {
                return prefix != undefined ? [prefix] : [];
            },
            finisher(result) {
                return result.join(delimiter);
            }
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
            }
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
            }
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
            }
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
            }
        };
    },
    summarize(converter = toNumber()) {
        return {
            accumulator(collected, item) {
                collected.accept(converter(item));
            },
            supplier() {
                return new StatisticsImpl;
            },
            finisher: identity()
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
            }
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
                    true: []
                };
            },
            finisher: identity()
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
                    true: []
                };
            },
            finisher(result) {
                return {
                    false: Methods_1.collect(result.false, downstream),
                    true: Methods_1.collect(result.true, downstream)
                };
            }
        };
    },
};
