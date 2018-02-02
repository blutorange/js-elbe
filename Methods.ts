import { natural, Comparator } from "comparators";
import { Collector, Supplier, BiConsumer, Function, Predicate, Consumer, BiFunction, Try } from "./Interfaces";
import { Collectors } from "./Collectors";
import { TryFactory } from "./Try";

const hasOwnProperty = Object.prototype.hasOwnProperty;
const IDENTITY = x => x;

export function * map<T,S>(iterable : Iterable<T>, mapper: Function<T,S>) : Iterable<S> {
    for (let item of iterable) {
        yield mapper(item);
    }
}

export function * flatMap<T,S>(iterable : Iterable<T>, mapper: Function<T,Iterable<S>>) : Iterable<S> {
    for (let item of iterable) {
        for (let i of mapper(item)) {
            yield i;
        }
    }
}

export function * filter<T>(iterable : Iterable<T>, predicate : Predicate<T>) : Iterable<T> {
    for (let item of iterable) {
        if (predicate(item)) {
            yield item;
        }
    }
}

export function * doTry<T,S>(iterable: Iterable<T>, mapper: Function<T,S>) : Iterable<Try<S>> {
    for (let item of iterable) {
        yield TryFactory.of(() => mapper(item));
    }
}

export function partition<T>(iterable: Iterable<T>, predicate: Predicate<T>) : {false:T[],true:T[]} {
    return collect(iterable, Collectors.partition(predicate));
};

export function group<T,K>(iterable: Iterable<T>, classifier: Function<T,K>) : Map<K, T[]> {
    return collect(iterable, Collectors.group(classifier));
};

export function join<T>(iterable: Iterable<T>, delimiter: string = "", prefix? : string, suffix? : string) : string {
    return collect(iterable, Collectors.join(delimiter, prefix, suffix));
}

/**
 * Consider converting the stream to an array and sorting this
 * array if you do not need a stream for further operation. 
 * @param iterable Iterable with items to sort.
 * @param comparator How to sort the items. Default to the natural order.
 * @return A stream in sorted order.
 */
export function sort<T>(iterable: Iterable<T>, comparator?: Comparator<T>) : Iterable<T> {
    const arr = Array.from(iterable);
    arr.sort(comparator);
    return arr[Symbol.iterator]();
}

export function distinct<T>(iterable: Iterable<T>) : Iterable<T> {
    const set = new Set(iterable);
    return set.values();
}

export function * distinctBy<T>(iterable: Iterable<T>, keyExtractor: Function<T,any>) : Iterable<T> {
    const set = new Set();
    for (let item of iterable) {
        const key = keyExtractor(item);
        if (!set.has(key)) {
            yield item;
            set.add(key);
        }
    }
}

export function * limit<T>(iterable: Iterable<T>, limit: number) : Iterable<T> {
    for (let item of iterable) {
        yield item;
        if (--limit < 1) {
            return;
        }
    }
}

export function * skip<T>(iterable: Iterable<T>, skip: number) : Iterable<T> {
    const it = iterable[Symbol.iterator]();
    while (skip-->0) {
        if (it.next().done) {
            return;
        }
    }
    for (let entry = it.next(); !entry.done; entry = it.next()) {
        yield entry.value;
    }
}

export function * reverse<T>(iterable: Iterable<T>) : Iterable<T> {
    const arr = Array.from(iterable);
    for (let i = arr.length; i-->0;) {
        yield arr[i];
    }
}

export function * concat<T>(iterable: Iterable<T>, ...moreIterables: Iterable<T>[]) : Iterable<T> {
    for (let item of iterable) {
        yield item;
    }
    for (let iterable of moreIterables) {
        for (let item of iterable) {
            yield item;
        }
    }
}

export function size(iterable : Iterable<any>) : number {
    let i = 0;
    for (let item of iterable) ++i;
    return i;
}

export function find<T>(iterable: Iterable<T>, predicate: Predicate<T>) : T {
    for (let item of iterable) {
        if (predicate(item)) {
            return item;
        }
    }
    return undefined;
}

export function every<T>(iterable: Iterable<T>, predicate: Predicate<T>) : boolean {
    for (let item of iterable) {
        if (!predicate(item)) {
            return false;
        }
    }
    return true;
}

export function some<T>(iterable: Iterable<T>, predicate: Predicate<T>) : boolean {
    for (let item of iterable) {
        if (predicate(item)) {
            return true;
        }
    }
    return false;
}

export function none<T>(iterable: Iterable<T>, predicate: Predicate<T>) : boolean {
    return !some(iterable, predicate);
}

export function has<T>(iterable: Iterable<T>, object: T) : boolean {
    return some(iterable, item => item === object);
}

export function min<T>(iterable: Iterable<T>, comparator : Comparator<T> = natural) : T {
    let first = true;
    let min : T;
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

export function max<T>(iterable: Iterable<T>, comparator : Comparator<T> = natural) : T {
    let first = true;
    let min : T;
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

export function reduce<T,S>(iterable: Iterable<T>, reducer: BiFunction<S,T,S>, initialValue: S) : S {
    for (let item of iterable) {
        initialValue = reducer(initialValue, item);
    }
    return initialValue;
}

export function reduceSame<T>(iterable: Iterable<T>, reducer: BiFunction<T,T,T>) : T {
    let reduced : T;
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

export function collect<T,S,R=S>(iterable: Iterable<T>, collector: Collector<T,S,R>) : R {
    return collectWith(iterable, collector.supplier, collector.accumulator, collector.finisher);
}

export function collectWith<T,S,R=S>(iterable: Iterable<T>, supplier: Supplier<S>, accumulator: BiConsumer<S,T>, finisher: Function<S,R> = IDENTITY) : R {
    const collected = supplier();
    for (let item of iterable) {
        accumulator(collected, item);
    }
    return finisher(collected);
}

export function toArray<T>(iterable: Iterable<T>) : T[] {
    return Array.from(iterable);
}

export function toSet<T>(iterable: Iterable<T>) : Set<T> {
    return new Set(iterable);
}

export function toMap<T, K,V>(iterable: Iterable<T>, keyMapper: Function<any,K>, valueMapper: Function<any,V>) : Map<K,V> {
    return collect(iterable, Collectors.toMap(keyMapper, valueMapper));
}

export function * fromObject<T>(object: {[s: string] : T}) : Iterable<[string,T]> {
    for (let key in object) {
        if (hasOwnProperty.call(object, key)) {
            yield [key, object[key]];
        }
    }
}

export function * fromObjectKeys(object: {[s: string] : any}) : Iterable<string> {
    for (let key in object) {
        if (hasOwnProperty.call(object, key)) {
            yield key;
        }
    }
}

export function * fromObjectValues<T>(object: {[s: string] : T}) : Iterable<T> {
    for (let key in object) {
        if (hasOwnProperty.call(object, key)) {
            yield object[key];
        }
    }
}

/**
 * @param generator Generator for generating the items of the stream. It is passed the current index as its argument.
 * @param amount How many items to generate, -1 for an unlimited amount.
 * @return Iterable for iterating the given amount of times over the items supplied by the supplier.
 */
export function * generate<T>(generator: Function<number, T>, amount: number = -1) : Iterable<T> {
    for (let i = 0; i < amount; ++i) {
        yield generator(i);
    }
}

export function * times(amount: number, start: number = 0, step: number = 1) : Iterable<number> {
    for (let i = 0, j = start ; i < amount; ++i, j += step) {
        yield j;
    }
}

/**
 * @param item Item to repeat.
 * @param amount How many times to repeat, -1 for an unlimited amount.
 * @return Iterable for iterating over the provided item the given amount of times.
 */
export function * repeat<T>(item: T, amount: number = -1) : Iterable<T> {
    for (let i = 0; i < amount; ++i) {
        yield item;
    }
}

/**
 * @param seed Initial item.
 * @param next Function that takes the current item and produces the next item in the sequence.
 * @param amount How many times to iterate, -1 for an unlimited amount.
 * @return Iterable for iterating over the provided item the given amount of times.
 */
export function * iterate<T>(seed: T, next: Function<T,T>, amount: number = -1) : Iterable<T> {
    for (let i = 0; i < amount; ++i) {
        yield seed;
        seed = next(seed);
    }
}