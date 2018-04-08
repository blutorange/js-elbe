import {
    BiConsumer,
    BinaryOperator,
    BiPredicate,
    Collector,
    Comparator,
    Consumer,
    Maybe,
    Predicate,
    Supplier,
    TypedBiFunction,
    TypedFunction,
} from "andross";

import { RBTree } from "bintrees";

import { byKey, natural, sort as arraySort, sortBy as arraySortBy } from "kagura";

import { Collectors } from "./Collectors";

import { ITry } from "./Interfaces";

import { LazyBufferedIterable } from "./LazyBufferedIterable";

import { TryFactory } from "./TryFactory";

import { EMPTY_ITERABLE, wrapIterator } from "./util";

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Transform each element to another element of a different type.
 *
 * ```javascript
 * map([0,1,2,3], x => 2 * x) // => Iterable[0,2,4,6]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @typeparam S Type of the elements in the produced iterable.
 * @param iterable The iterable to be mapped.
 * @param mapper A function taking each item of the given iterable and transforms it into another item.
 * @return An iterable over the mapped elements.
 */
export function * map<T, S>(iterable: Iterable<T>, mapper: TypedFunction<T, S>): Iterable<S> {
    for (const item of iterable) {
        yield mapper(item);
    }
}

/**
 * Applies the mapping function to each item and return an iterable
 * over all the mapped iterables.
 * This is equivalent to `concat(map(mapper))`.
 *
 * ```javascript
 * flatMap(["foo","bar"], x => fromString(x)) // => Iterable["f", "o", "o", "b", "a", "r"]
 * flatMap(doTry(["[1]","[2,3]","[4,]"], JSON.parse), x=>x.iterate()) // => Iterable[ [1], [2, 3] ]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @typeparam S Type of the elements in the produced iterable.
 * @param iterable The iterable to be flat-mapped.
 * @param mapper Mapping function taking each item and producing a new iterable.
 * @return An iterable over all the items of the iterables produced by the mapper.
 */
export function* flatMap<T, S>(iterable: Iterable<T>, mapper: TypedFunction<T, Iterable<S>>): Iterable<S> {
    for (const items of iterable) {
        for (const item of mapper(items)) {
            yield item;
        }
    }
}

/**
 * Chunks together consecutive items for which the classifier
 * returns the same value. Equality is checked with `===`.
 *
 * ```javascript
 * chunkBy([1,2,3,4,5,6,1,2], i => Math.floor((i-1) / 3)) // => Stream[ [1,2,3], [4,5,6], [1,2] ]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @typeparam K Type of the returned value of the chunker,
 * @param iterable The iterable to be chunked.
 * @param classifier It is passed the item as its first argument and the index as its second. Items are chunked together according to the returned value.
 * @return An iterable over the chunked items.
 */
export function* chunkBy<T, K = any>(iterable: Iterable<T>, classifier: TypedBiFunction<T, number, K>): Iterable<T[]> {
    let currentClass;
    let first = true;
    let index = -1;
    let chunk: T[] = [];
    for (const item of iterable) {
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

/**
 * Chunks the items into chunks of chunkSize. This is equivalent
 * to `chunkBy(iterable, (_, i) => Math.floor(i/chunkSize))`.
 *
 * ```javascript
 * chunk([1,2,3,4,5], 2) // => Iterable[ [1,2], [3,4], [5] ]
 * chunk([1,2,3,4,5], 1) // => Iterable[ [1], [2], [3], [4], [5] ]
 * chunk([1,2,3,4,5], 0) // => Iterable[]
 * chunk([1,2,3,4,5], -1) // => Iterable[]
 * chunk([1,2,3,4,5], NaN) // => Iterable[]
 * chunk([1,2,3,4,5], Infinity) // => Iterable[[1,2,3,4,5]]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be chunked.
 * @param chunkSize Size of the produced chunks.
 * @return An iterable over the chunked items.
 */
export function* chunk<T>(iterable: Iterable<T>, chunkSize: number): Iterable<T[]> {
    if (chunkSize < 1 || isNaN(chunkSize)) {
        return;
    }
    let count = chunkSize;
    let chunk = [];
    for (const item of iterable) {
        --count;
        chunk.push(item);
        if (count < 1) {
            yield chunk;
            chunk = [];
            count = chunkSize;
        }
    }
    if (chunk.length > 0) {
        yield chunk;
    }
}

/**
 * Produces an iterable over pairs of consisting of an item of the given iterable and
 * the corresponding item of the other iterable.
 * If one of the given iterable is longer, the shorter one is appended with `undefined`.
 *
 * ```javascript
 * zip(["foo", "bar"], [3, 4])
 * // => Iterable[ ["foo",3], ["bar", 4] ]
 *
 * zip(["foo", "bar"], [3])
 * // => Iterable[ ["foo",3], ["bar", undefined] ]
 *
 * toMap(zip(["foo", "bar"], [3, 4]), x=>x[0], x=>x[1])
 * // => Map[ "foo" => 3, "bar" => 4] ]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be zipped with the other.
 * @param other Other iterable to be zipped to the given iterable.
 * @return An iterable over all the produced pairs.
 */
export function * zip<T, S>(iterable: Iterable<T>, other: Iterable<S>): Iterable<[Maybe<T>, Maybe<S>]> {
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

/**
 * Produces an iterable over tuples of consisting of an item of the given iterable and
 * the corresponding items of the other iterables.
 * If any of the iterables has a different length than the others,
 * the shorter ones appended with `undefined` to the length of the longest.
 *
 * ```javascript
 * zipSame("ab", ["cd", "ef"])
 * // => Iterable[ ["a","c", "d"], ["b", "d", "f"] ]
 *
 * zipSame("abc", ["d", "ef"])
 * // => Iterable[ ["a","d", "e"], ["b", undefined, "f"], ["c", undefined, undefined] ]
 *
 * toArray(zipSame("fb",["oa","or"])).map(x=>x.map(String).join("")).join("")
 * // => "foobar"
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterables to be zipped with the others.
 * @param others Other iterable to be zipped to the given iterable.
 * @return An iterable over al the produced tuples.
 */
export function* zipSame<T>(iterable: Iterable<T>, others: Iterable<T>[]): Iterable<Maybe<T>[]> {
    const it = [iterable[Symbol.iterator]()];
    for (const other of others) {
        it.push(other[Symbol.iterator]());
    }
    let res = it.map(x => x.next());
    while (!res.every(x => x.done)) {
        yield res.map(x => x.done ? undefined : x.value);
        res = it.map(x => x.next());
    }
}

/**
 * Removes all elements from the iterable for which the
 * predicate does not return `true`.
 *
 * ```javascript
 * filter([4,-4,2,-9], x => x > 0) // => Iterable[4,2]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be filtered.
 * @param predicate Testing function returning `true` iff the item is to be kept, `false` otherwise.
 * @return An iterable over all item for which the predicate returned `true`.
 */
export function * filter<T>(iterable: Iterable<T>, predicate: Predicate<T>): Iterable<T> {
    for (const item of iterable) {
        if (predicate(item)) {
            yield item;
        }
    }
}

/**
 * Similar to {@link map}, but handles any error that may be thrown by
 * the mapper by wrapping them in a {@link Try}. This is equivalen to
 * `map(x => Try.of(() => mapper(x)))`
 *
 * ```javascript
 * doTry(["[1]","[2,3]","[4,]"], JSON.parse)
 * // => Iterable[ Try[1], Try[2,3], Try[ParseError] ]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @typeparam S Type of the elements wrapped in a {@link Try} in the produced iterable.
 * @param iterable The iterable to to be processed.
 * @param mapper Mapping function that takes an item of the given iterable and produces a mapped item. If it throws an error, the resulting {@link Try} is not successful.
 * @return An iterable over the mapped elements, wrapped in a {@link Try} for encapsulating thrown errors.
 */
export function* tryMap<T, S>(iterable: Iterable<T>, mapper: TypedFunction<T, S>): Iterable<ITry<S>> {
    for (const item of iterable) {
        yield TryFactory.of(() => mapper(item));
    }
}

/**
 * Passes the given iterable to the the operation and returns its result,
 * wrapped in a {@link Try} in case the operation throws an error.
 * Usually used for performing a terminal operation with error handling
 * on the iterable.
 *
 * ```javascript
 * tryCompute([1,2,3], it => reduce(it, item => {throw new Error()}, 0))
 * // => Try[success=false]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @typeparam S Type of the value produced by the operation.
 * @param iterable The iterable to to be processed.
 * @param operation Takes the given iterable and returns a value. If it throws an error, the resulting {@link Try} is not successful.
 * @return The result of the operation, wrapped in a {@link Try} for encapsulating thrown errors.
 */
export function tryCompute<T, S>(iterable: Iterable<T>, operation: TypedFunction<Iterable<T>, S>): ITry<S> {
    return TryFactory.of(() => operation(iterable));
}

/**
 * Same as {@link end}, but encapsulates any errors thrown. Applies
 * all pending operation to the pipeline.
 *
 * ```javascript
 * tryEnd(visit([1,2,3], console.log)) // prints 1,2,3
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to to be processed.
 * @return The encapsulated error, if any was thrown.
 */
export function tryEnd<T>(iterable: Iterable<T>): ITry<void> {
    return TryFactory.of(() => end(iterable));
}

/**
 * Splits the items into two groups according to the given
 * discriminator.
 *
 * ```javascript
 * partition([-3,2,9,-4], x => x > 0)
 * // => { false: [-3,-4], true: [2,9]}
 *
 * partition([], x => x > 0)
 * // => { false: [], true: []}
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be partitioned.
 * @param discriminator Partitions each item into one of two groups by returning `true` of `false`.
 * @return An object containing the partitioned items.
 */
export function partition<T>(iterable: Iterable<T>, discriminator: Predicate<T>): { false: T[], true: T[] } {
    return collect(iterable, Collectors.partition(discriminator));
}

/**
 * Splits the items into several groups, according to the given
 * classifier.
 *
 * ```javascript
 * group(["a", "foo", "is", "some", "buzz"], x => x.length)
 * // => Map [ 1 => ["a"], 2 => ["is"], 3 => "is", 4 => ["some", "buzz"] ]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @typearam K Type of the group key.
 * @param iterable The iterable to be grouped.
 * @param classifier Returns the group for each item.
 * @return A map with the groups as keys and arrays as values, containg all the items for that group.
 */
export function group<T, K>(iterable: Iterable<T>, classifier: TypedFunction<T, K>): Map<K, T[]> {
    return collect(iterable, Collectors.group(classifier));
}

/**
 * Joins every time with the given delimiter, optionally prepending a
 * prefix and appending a suffix to the output.
 *
 * ```javascript
 * join([1,2,3], ",", "[", "]") // => "[1,2,3]"
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be joined.
 * @param delimiter String inserted between the items.
 * @param prefix String prepended to the joined string.
 * @param suffix String appended to the joined string.
 * @return A string consisting of the prefix, the items joined with the delimiter, and the suffix.
 */
export function join<T>(iterable: Iterable<T>, delimiter?: string, prefix?: string, suffix?: string): string {
    return collect(iterable, Collectors.join(delimiter, prefix, suffix));
}

/**
 * Sorts the items. Consider converting the iterable to an array and sorting
 * this array if you do not need an iterable for further operations.
 *
 * This method might create a new array, but if it does, calling `toArray` with
 * the returned iterable will return that array instead of allocating a new array.
 *
 * ```javascript
 * sort(["foobar", "a", "bar", Comparators.byField("length")] // => Iterable["a", "bar", "foobar"]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable with to be sorted.
 * @param comparator How to sort the items. Default to the natural order.
 * @return An iterable with the items in sorted order.
 */
export function sort<T>(iterable: Iterable<T>, comparator?: Comparator<T>): Iterable<T> {
    const arr = toArray(iterable, true);
    arraySort(arr, comparator);
    return arr;
}

/**
 * Similar to {@link unique}, but allows for a custom key to
 * be specified, according to which uniqueness is determined.
 *
 * ```javascript
 * distinct([4,1,3,4,1,3,1,9])
 * // => Iterable[4,1,3,9]
 *
 * distinct({id:4},{id:2},{id:4]}, customer => customer.id)
 * // => Iterable[ {id:4}, {id:2} ]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be made unique
 * @param keyExtractor Returns a key for each item. Items with duplicate keys are removed. Defaults to taking the item itself as the key.
 * @return An iterable with all duplicates removed.
 */
export function * uniqueBy<T, K = any>(iterable: Iterable<T>, keyExtractor: TypedFunction<T, K>): Iterable<T> {
    const set = new Set();
    for (const item of iterable) {
        const key = keyExtractor(item);
        if (!set.has(key)) {
            set.add(key);
            yield item;
        }
    }
}

/**
 * Filters all elements that are considered equal according to
 * the given comparator. If two items are equal, the first one
 * is included in the resulting iterable. Consider using
 * {@link uniqueBy} if possible for better performance.
 *
 * ```javascript
 * unique([4,1,3,4,1,3,1,9])
 * // => Iterable[4,1,3,9]
 *
 * unique({id:4},{id:2},{id:4]}, (x,y) => x.id - y.id)
 * // => Iterable[ {id:4}, {id:2} ]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be made unique
 * @param comparator Takes two items and returns 0 if they are equal. Defaults to taking determining equality by `===`.
 * @return An iterable with all duplicates removed.
 */
export function* unique<T>(iterable: Iterable<T>, comparator?: Comparator<T>): Iterable<T> {
    if (comparator !== undefined) {
        const set = new RBTree(comparator);
        for (const item of iterable) {
            if (set.insert(item)) {
                yield item;
            }
        }
    }
    else {
        const set = new Set();
        for (const item of iterable) {
            if (!set.has(item)) {
                set.add(item);
                yield item;
            }
        }
    }
}

/**
 * Adds the index to each element of the given iterable. The index starts at 0
 *
 * ```javascript
 * index(["foo", "bar"]) // => Iterable<[ {index: 0, value: "foo"}, {index: 1, value: "bar"} ]>
 * ```
 *
 * @typeparam T Type of the element in the iterable.
 * @param iterable The iterable to be indexed.
 * @return An iterable with each item being an object containing the item's index and the item itself. The index starts at 0.
 */
export function* index<T>(iterable: Iterable<T>): Iterable<{index: number, value: T}> {
    let index = 0;
    for (const value of iterable) {
        yield {index, value};
        index += 1;
    }
}

/**
 * Limits the iterable to at most the given number of elements.
 *
 * ```javascript
 *  limit([1,2,3,4,5,6], NaN) // => Iterable[1,2,3,4,5,6]
 *  limit([1,2,3,4,5,6], 0) // => Iterable[]
 *  limit([1,2,3,4,5,6], 3) // => Iterable[1,2,3]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be limited.
 * @param limit The maximum number of items in the resulting iterable. Default to `Infinity`.
 * @return An iterable with at most the given number of items.
 */
export function* limit<T>(iterable: Iterable<T>, limit: number = Infinity): Iterable<T> {
    if (limit < 1) {
        return;
    }
    limit -= 1;
    for (const item of iterable) {
        yield item;
        if (--limit < 0) {
            break;
        }
    }
}

/**
 * Cycles over the elements of the iterable the given number of times.
 *
 * ```javascript
 * cycle([1,2,3], NaN) // => Iterable[]
 * cycle([1,2,3], 3) // => Iterable[1,2,3,1,2,3,1,2,3]
 * limit(cycle([1,2,3]), 5) // => Iterable[1,2,3,1,2]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be cycled.
 * @param count The number of cycle. If not given, cycles an unlimited amount of times.
 * @return An iterable with the items of the given iterable repeating.
 */
export function* cycle<T>(iterable: Iterable<T>, count: number = Infinity): Iterable<T> {
    if (count < 1 || isNaN(count)) {
        return;
    }
    const lazy = new LazyBufferedIterable(iterable);
    for (let i = 0; i < count; ++i) {
        for (const item of lazy) {
            yield item;
        }
    }
}

/**
 * Calls the given consumer once for each item. The consumer is
 * not called before the stream is consumed by some terminal operation.
 *
 * ```javascript
 * visit([1,2,3], console.log)
 * // => Iterable[1,2,3]
 * // prints `1,2,3` once the stream is consumed.
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be limited.
 * @param consumer Callback taking each item.
 * @return An iterable with the same items as the given iterable.
 */
export function* visit<T>(iterable: Iterable<T>, consumer: Consumer<T>) {
    for (const item of iterable) {
        consumer(item);
        yield item;
    }
}

/**
 * Discards the given number of items from the iterable.
 *
 * ```javascript
 * skip([1,2,3,4,5,6], NaN) // => Iterable[1,2,3,4,5,6]
 * skip([1,2,3,4,5,6], 0) // => Iterable[1,2,3,4,5,6]
 * skip([1,2,3,4,5,6], 3) // => Iterable[4,5,6]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be skipped.
 * @param toSkip Number of items to skip. Default to `Infinity`.
 * @return An iterable with the given number of items skipped.
 * @see {@link limit}
 */
export function* skip<T>(iterable: Iterable<T>, toSkip: number = Infinity): Iterable<T> {
    const it = iterable[Symbol.iterator]();
    while (--toSkip >= 0 && !it.next().done) {/**/}
    for (let entry = it.next(); !entry.done; entry = it.next()) {
        yield entry.value;
    }
}

/**
 * Reverses the order of the items.
 *
 * Note that the items need to be saved temporarily, so that this
 * does not work with unlimite streams, as the last item needs to
 * be accesed first.
 *
 * This method might create a new array, but if it does, calling `toArray` with
 * the returned iterable will return that array instead of allocating a new array.
 *
 * ```javascript
 * reverse([1,2,3]) // => Iterable[3,2,1]
 * reverse([]) // => Iterable[]
 * reverse(factory.step(Infinity)) // hangs
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be reversed.
 * @return An iterable with the items in reversed order.
 */
export function* reverse<T>(iterable: Iterable<T>): Iterable<T> {
    const arr = toArray(iterable, true);
    for (let i = arr.length; i-- > 0;) {
        yield arr[i];
    }
}

/**
 * Concatenates all iterables into one iterable of all the items.
 *
 * ```javascript
 * concat("foo", "bar", "baz") // => Iterable["f", "o", "o", "b", "a", "r", "b", "a", "z"]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable Iteratbles to be concatenated.
 * @return An iterable over all the items of the given iterables.
 */
export function* concat<T>(...iterables: Iterable<T>[]): Iterable<T> {
    for (const iterable of iterables) {
        for (const item of iterable) {
            yield item;
        }
    }
}

/**
 * Counts the items.
 *
 * ```javascript
 * count([1,2,3]) // => 3
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be counted.
 * @return The number of items in the iterable.
 */
export function size(iterable: Iterable<any>): number {
    let i = 0;
    for (const it = iterable[Symbol.iterator](); !it.next().done;) {
        ++i;
    }
    return i;
}

/**
 * Similar to {@link Methods}#sort, but sorts items by comparing them according
 * to the given key extractor and comparator. For each item, a key is extracted,
 * two items are then compared by comparing theirs keys with the given comparator.
 *
 * This method might create a new array, but if it does, calling `toArray` with
 * the returned iterable will return that array instead of allocating a new array.
 *
 * ```javascript
 * sortBy(["foo", "foobar", "bar"], x => x.length)
 * // => Iterable["foo", "bar", "foobar"]
 *
 * const user1 = {name: "Dave", birth: {day: 5, month: 4, year: 1990}}
 * const user2 = {name: "Maria", birth: {day: 9, month: 11, year: 2005}}
 * const user3 = {name: "Odo", birth: {day: 22, month: 7, year: 2004}}
 *
 * sortBy([user1, user2, user3], user => user.birth, (lhs,rhs) => lhs.year - rhs.year)
 * // => Iterable[user1, user3, user1]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param keyExtractor Extracts the key by which the sort order is determined. Default to identity `x => x`.
 * @param comparator Comparator for comparing two keys. Defaults to the natural comparator using `<` and `>`.
 * @return An iterable with the items in sorted order.
 */
export function sortBy<T, K>(iterable: Iterable<T>, keyExtractor: TypedFunction<T, K>, comparator?: Comparator<K>): Iterable<T> {
    const arr = toArray(iterable, true);
    arraySortBy(arr, keyExtractor, comparator);
    return arr;
}

/**
 * Similar to {@link Methods}#filter, but filters out all items not equivalent to
 * the given target. Items are compared to the target by first extracting a key
 * with the given key extractor, and then comparing the keys with the given
 * comparator.
 *
 * ```javascript
 * filterBy(["foo", "bar", "foobar"], x => x.length)
 * // => Iterable["foo", "bar"]
 *
 * const user1 = {name: "Dave", birth: {day: 5, month: 4, year: 2005}}
 * const user2 = {name: "Maria", birth: {day: 9, month: 11, year: 2005}}
 * const user3 = {name: "Odo", birth: {day: 22, month: 7, year: 2004}}
 *
 * filterBy([user1, user2, user3], 2005, user => user.birth, (lhs,rhs) => lhs.year - rhs.year)
 * // => Iterable[user1, user2]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param target Target for filterting. All items in the iterable not equivalent to the target are removed.
 * @param keyExtractor Extracts the key by which equality is determined. Default to identity `x => x`.
 * @param comparator Comparator for comparing two keys. Defaults to the natural comparator using `<` and `>`.
 * @return An iterable with the items not matching the target removed.
 */
export function * filterBy<T, K>(iterable: Iterable<T>, target: K, keyExtractor: TypedFunction<T, K>, comparator?: Comparator<K>): Iterable<T> {
    if (comparator !== undefined) {
        for (const item of iterable) {
            if (comparator(target, keyExtractor(item)) === 0) {
                yield item;
            }
        }
    }
    else {
        for (const item of iterable) {
            if (target === keyExtractor(item)) {
                yield item;
            }
        }
    }
}

/**
 * Searches for the first occurence of an item matching the predicate.
 *
 * ```javascript
 * find(["foo1", "bar,"foo2"], x => x.startsWith("foo")) // => "foo1"
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be scanned.
 * @param predicate Test to be performed on the items. It is passed the current item and the current index.
 * @return The item iff found, undefined otherwise.
 */
export function find<T>(iterable: Iterable<T>, predicate: BiPredicate<T, number>): Maybe<T> {
    let index = -1;
    for (const item of iterable) {
        if (predicate(item, ++index)) {
            return item;
        }
    }
    return undefined;
}

/**
 * Searches for the first occurence of an item matching the predicate,
 * and returns the index; or `-1` otherwise.
 *
 * ```javascript
 * findIndex(["foo1", "bar, "foo2"], x => x.startsWith("foo")) // => 0
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be scanned.
 * @param predicate Test to be performed on the items. It is passed the current item and the current index.
 * @return The index iff the item was found, `-1` otherwise.
 */
export function findIndex<T>(iterable: Iterable<T>, predicate: BiPredicate<T, number>): number {
    let index = 0;
    for (const item of iterable) {
        if (predicate(item, index)) {
            return index;
        }
        index += 1;
    }
    return -1;
}

/**
 * Determines whether every items matches the given predicate.
 *
 * ```javascript
 * every("fooz", x => x < "j") // => false
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be scanned.
 * @param predicate Test to be performed on the items.
 * @return Whether every items matches the given predicate.
 */
export function every<T>(iterable: Iterable<T>, predicate: Predicate<T>): boolean {
    for (const item of iterable) {
        if (!predicate(item)) {
            return false;
        }
    }
    return true;
}

/**
 * Determines whether at least one items matches the given predicate.
 *
 * ```javascript
 * some("fooz", x => x < "j") // => true
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be scanned.
 * @param predicate Test to be performed on the items.
 * @return Whether some (at least one) item matches the given predicate.
 */
export function some<T>(iterable: Iterable<T>, predicate: Predicate<T>): boolean {
    for (const item of iterable) {
        if (predicate(item)) {
            return true;
        }
    }
    return false;
}

/**
 * Determines whether no item matches the given predicate. This
 * is equivalent to `!some(iterable, predicate)`.
 *
 * ```javascript
 * none("fooz", "x => x < "j") // => false
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be scanned.
 * @param predicate Test to be performed on each item.
 * @return Whether no item matches the given predicate.
 */
export function none<T>(iterable: Iterable<T>, predicate: Predicate<T>): boolean {
    return !some(iterable, predicate);
}

/**
 * Determines whether the iterable contains the given item.
 * Equivalence is checked with `===`. This is
 * equivalent to `some(iterable, x => x === object)`.
 *
 * ```javascript
 * has("foobar", "o") // => true
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be scanned.
 * @return Whether the given object is contained in the iterable.
 */
export function has<T>(iterable: Iterable<T>, object: T): boolean {
    return some(iterable, item => item === object);
}

/**
 * Consumes the given amount of items from the iterable, adding it
 * to the sink, and returns an iterable over the remaining items.
 *
 * ```javascript
 * const sink = [];
 * consume("foobar", sink, 0, 3);
 * // => sink is now ["f", "o", "o"]
 *
 * consume("foobar", console.log, 0, 3);
 * // => logs "f", "o", "o"
 *
 * consume("foobar", console.log, 0, -3);
 * // => logs nothing
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be scanned.
 * @param sink If an array, consmed items are added to the array. Otherwise, the consumer is called with the consumed item.
 * @param maxAmount Maximum number of items to consume. Defaults to `Infinity`.
 * @param offset Where to start removing items from the iterable. Defaults to `0`.
 * @return An iterable over the remaining items.
 */
export function consume<T>(iterable: Iterable<T>, sink: T[] | Consumer<T>, offset: number = 0, maxAmount: number = Infinity): Iterable<T> {
    if (maxAmount < 1 || isNaN(maxAmount) || isNaN(offset)) {
        return iterable;
    }

    const it = iterable[Symbol.iterator]();
    let result: IteratorResult<T>;

    // go to offset position
    let head: Iterable<T> = EMPTY_ITERABLE;
    if (offset >= 1) {
        const headArray: T[] = [];
        --offset;
        do {
            result = it.next();
            if (result.done) {
                break;
            }
            headArray.push(result.value);
        } while (--offset >= 0);
        head = headArray;
    }

    // splice of the items
    --maxAmount;
    if (Array.isArray(sink)) {
        do {
            result = it.next();
            if (result.done) {
                break;
            }
            sink.push(result.value);
        } while (--maxAmount >= 0);
    }
    else {
        do {
            result = it.next();
            if (result.done) {
                break;
            }
            sink(result.value);
        } while (--maxAmount >= 0);
    }
    return concat(head, fromIter(it));
}

export function consumeFirst<T>(iterable: Iterable<T>, sink: T[] | Consumer<T>): Iterable<T> {
    const it = iterable[Symbol.iterator]();
    const result = it.next();
    if (!result.done) {
        if (Array.isArray(sink)) {
            sink.push(result.value);
        }
        else {
            sink(result.value);
        }
    }
    return wrapIterator(it);
}

/**
 * Converts each item to a promise and returns a promise
 * that is resolved with an iterable of results when all
 * of the created Promises resolve, or rejected when any
 * Promise is rejected.
 *
 * ```javascript
 * promise([1,2,3], id => fetch(`/user/${id}`))
 *     .then(s => s.forEach(renderUser))
 *     .catch(console.error)
 * // Calls the renderUser method with the Response for each user request.
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @typeparam S Type of the item of the promises.
 * @param iterable The iterable to be scanned.
 * @param promiseConverter Takes each item and creates a promise.
 * @return A promise that resolves when all promises resolve; or is rejected when any promise is rejected.
 */
export function promise<T, S>(iterable: Iterable<T>, promiseConverter: TypedFunction<T, Promise<S>>): Promise<Iterable<S>> {
    return Promise.all(map(iterable, promiseConverter));
}

/**
 * Computes the minimum of the items, as determined by the given sort key.
 *
 * ```javascript
 * minBy(["foo","foobar", "gg"], x => x.length)
 * // => "gg"
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be minimized.
 * @param sortKey Takes an item and produces the key by which the minimum is determined.
 * @return The smallest item, or `undefined` iff there are no items.
 */
export function minBy<T, K = any>(iterable: Iterable<T>, sortKey: TypedFunction<T, K>): Maybe<T> {
    return min(iterable, byKey(sortKey));
}

/**
 * Computes the minimum of the items, as determined by the given sort key.
 *
 * ```javascript
 * maxBy(["foo","foobar", "gg"], x => x.length)
 * // => "foobar"
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be maximized.
 * @param sortKey Takes an item and produces the key by which the maximum is determined.
 * @return The smallest item, or `undefined` iff there are no items.
 */
export function maxBy<T, K = any>(iterable: Iterable<T>, sortKey: TypedFunction<T, K>): Maybe<T> {
    return max(iterable, byKey(sortKey));
}

/**
 * Computes the minimum of the items.
 *
 * ```javascript
 * min([3,2,9,4]) // => 9
 * min(["foo", "bar", "I"], Comparators.byField("length")) // => "I"
 * min([]) // => undefined
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be minimized.
 * @param comparator How two items are compared. Defaults to the natural order, ie. by using `&lt;` and `&gt;`.
 * @return The smallest item. If there are multiple smallest items, returns the first.  `undefined` iff the iterable is empty.
 */
export function min<T>(iterable: Iterable<T>, comparator: Comparator<T> = natural): Maybe<T> {
    let first = true;
    let min: Maybe<T>;
    for (const item of iterable) {
        if (first) {
            min = item;
            first = false;
        }
        else {
            if (comparator(item, min as T) < 0) {
                min = item;
            }
        }
    }
    return min;
}

/**
 * Computes the maxmimum of the items.
 *
 * ```javascript
 * max([3,2,9,4]) // => 9
 * max(["foo", "bar", "I"], Comparators.byField("length")) // => "foo"
 * max([]) // => undefined
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be maximized.
 * @param comparator How two items are compared. Defaults to the natural order, ie. by using `&lt;` and `&gt;`.
 * @return The largest item. If there are multiple largest items, returns the first. `undefined` iff the iterable is empty.
 */
export function max<T>(iterable: Iterable<T>, comparator: Comparator<T> = natural): Maybe<T> {
    let first = true;
    let max: Maybe<T>;
    for (const item of iterable) {
        if (first) {
            max = item;
            first = false;
        }
        else {
            if (comparator(item, max as T) > 0) {
                max = item;
            }
        }
    }
    return max;
}

/**
 * Coalesces all items into one value.
 *
 * ```javascript
 * reduce([1,2,3], (sum,x) => sum + x, 10) // => 16
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @typeparam S Type of the reduced value.
 * @param iterable The iterable to be reduced.
 * @param reducer Takes the current reduced value as its first argument and the current item as its second, combines the item with the current reduced value, and returns that value.
 * @param initialValue The initial value of the reduction.
 * @return The reduced value, or the initial value iff the iterable is empty.
 */
export function reduce<T, S>(iterable: Iterable<T>, reducer: TypedBiFunction<S, T, S>, initialValue: S): S {
    for (const item of iterable) {
        initialValue = reducer(initialValue, item);
    }
    return initialValue;
}

/**
 * Similar to {@link reduce}, but reduces to items of the same type
 * as the items and thus does not require an initial value.
 *
 * ```javascript
 * reduceSame([1,2,3], (sum,x) => sum + x) // => 6
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be reduced.
 * @param reducer Takes the current reduced value as its first argument and the current item as its second, combines the item with the current reduced value, and returns that value.
 * @return The reduced value, or undefined iff the iterable is empty.
 */
export function reduceSame<T>(iterable: Iterable<T>, reducer: TypedBiFunction<T, T, T>): Maybe<T> {
    let reduced: Maybe<T>;
    let first = true;
    for (const item of iterable) {
        if (first) {
            reduced = item;
            first = false;
        }
        else {
            reduced = reducer(reduced as T, item);
        }
    }
    return reduced;
}

/**
 * Sums all items arithmetically.
 *
 * ```javascript
 * sum([1,2,3]) // => 6
 * sum(["I", "of", "Borg"], x => x.length) // => 7
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be summed.
 * @param converted Converts an item into a number. Defaults to `Number(...)`.
 * @return The sum of the items.
 */
export function sum<T>(iterable: Iterable<T>, converter?: TypedFunction<T, number>): number {
    return collect(iterable, Collectors.sum(converter));
}

/**
 * Applies all pending operations, ending the given iterable.
 *
 * ```javascript
 * visit([1,2,3], console.log) // Iterable[1,2,3]; prints nothing
 * end(visit([1,2,3], console.log)) // prints 1,2,3
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be terminated.
 */
export function end<T>(iterable: Iterable<T>): void {
    const it = iterable[Symbol.iterator]();
    // tslint:disable-next-line:curly
    while (!it.next().done);
}

/**
 * Returns the item at the n-th position.
 *
 * ```javascript
 * nth("foo", -1) // => "f"
 *
 * nth("foo", 0) // => "f"
 *
 * nth("foo", 2) // => "o"
 *
 * nth("foo", 3) // => undefined
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be scanned.
 * @param n The position of the item to get.
 * @return The item at the given position, or undefined if not found.
 */
export function nth<T>(iterable: Iterable<T>, n: number): Maybe<T> {
    if (n < 0 || isNaN(n)) {
        return undefined;
    }
    n -= 1;
    for (const item of iterable) {
        if (n < 0) {
            return item;
        }
        n -= 1;
    }
    return undefined;
}

/**
 * Returns the first item.
 *
 * ```javascript
 * first("foo") // => "f"
 * first("") // => undefined
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be scanned.
 * @return The item at the first position, or undefined if empty.
 */
export function first<T>(iterable: Iterable<T>): Maybe<T> {
    for (const item of iterable) {
        return item;
    }
    return undefined;
}

/**
 * Returns the last item.
 *
 * ```javascript
 * last("foo") // => "o"
 * last("") // => undefined
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be scanned.
 * @return The item at the last position, or undefined if empty.
 */
export function last<T>(iterable: Iterable<T>): Maybe<T> {
    let last;
    for (const item of iterable) {
        last = item;
    }
    return last;
}

/**
 * Creates and object an incorporates all items into that object.
 *
 * ```javascript
 * collect([1,2,3], Collectors.summarize) // => Statistic[min:1, max:3, count: 3, sum: 6, average: 2, variance: 0.67]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @typeparam S Type of the intermediate value that incorporates each item in order.
 * @typeparam R Type of the final collected value.
 * @param iterable The iterable to be collected.
 * @param collector How to collect the items.
 * @return The collected value.
 */
export function collect<T, S, R = S>(iterable: Iterable<T>, collector: Collector<T, S, R>): R {
    return collectWith(iterable, collector.supplier, collector.accumulator, collector.finisher);
}

/**
 * Same as {@link collect}, but allows specifying the parts of
 * the collector individually.
 *
 * ```javascript
 * collect([1,2,3], () => [], (array, x) => array.push(x), x => new Set(x))
 * // => Set[1,2,3]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @typeparam S Type of the intermediate value that incorporates each item in order.
 * @typeparam R Type of the final collected value.
 * @param iterable The iterable to be collected.
 * @param suppplier Provides the intermediate object into which the items are incorporated.
 * @param accumulator Takes the intermediate objects as its first argument and the current items as its seconds, and incorporates the item into the intermediate value.
 * @param finisher Takes the intermediate object with all the items incoporated, and transforms it into the final value.
 * @return The final collected value.
 */
export function collectWith<T, S, R = S>(iterable: Iterable<T>, supplier: Supplier<S>, accumulator: BiConsumer<S, T>, finisher: TypedFunction<S, R>): R {
    const collected = supplier();
    for (const item of iterable) {
        accumulator(collected, item);
    }
    return finisher(collected);
}

/**
 * Creates an array with the items of the given iterable.
 * If the underlying iterable is an array, returns that
 * array instead of creating a new array.
 *
 * ```javascript
 * toArray("foobar")
 * // => ["f", "o", "o", "b", "a", "r"]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to to be converted.
 * @param fresh Iff true, always creates a new array. Otherise, reuses existing array when possible.
 * @return An array with the items.
 */
export function toArray<T>(iterable: Iterable<T>, fresh: boolean = false): T[] {
    if (Array.isArray(iterable) && !fresh) {
        return iterable;
    }
    return Array.from(iterable);
}

/**
 * This returns an iterable that can be iterated over any number of times.
 * If the iterable is an array, set, map or string etc, it simpy return the
 * iterable, otherwise it stores the items temporarily.
 *
 * ```javascript
 * function * foo() {
 *   return 1;
 *   return 2;
 *   return 3;
 * }
 *
 * const transientIterable = foo();
 * Array.from(transientIterable) // => [1,2,3]
 * Array.from(transientIterable) // => []
 *
 * const persistentIterable = fork(foo());
 * Array.from(persistentIterable) // => [1,2,3]
 * Array.from(persistentIterable) // => [1,2,3]
 * ```
 *
 * Note that buffering takes place on-demand, so the following will not
 * enter an infinite loop:
 *
 * ```javascript
 * // Create an iterable with an unlimited amount of items.
 * const iterable = repeat(Math.random, Infinity);
 *
 * // Fork the iterable first, then limit to a finite number of items.
 * // Items already produced are not recomputed.
 * Array.from(limit(fork(iterable), 3)) // => [0.28, 0.14, 0.97]
 * Array.from(limit(fork(iterable), 2)) // => [0.28, 0.14]
 * Array.from(limit(fork(iterable), 4)) // => [0.28, 0.14, 0.97, 0.31]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to to be persisted.
 * @return A persistent iterable.
 */
export function fork<T>(iterable: Iterable<T>): Iterable<T> {
    if (Array.isArray(iterable) || iterable instanceof LazyBufferedIterable || iterable instanceof Set || iterable instanceof Map || typeof iterable === "string") {
        return iterable;
    }
    return new LazyBufferedIterable(iterable);
}

/**
 * Creates a set with the items of the given iterable.
 * If the underlying iterable is a set, returns that
 * set instead of creating a new set.
 *
 * ```javascript
 * toSet("foobar")
 * // => Set["f", "o", "b", "a", "r"]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to to be converted.
 * @param fresh Iff true, always creates a new set. Otherise, reuses existing set when possible.
 * @return A set with the items.
 */
export function toSet<T>(iterable: Iterable<T>, fresh: boolean = false): Set<T> {
    if ((iterable instanceof Set) && !fresh) {
        return iterable;
    }
    return new Set(iterable);
}

/**
 * Creates a map from the items of the given iterable. The item's
 * key and value is extracted by the given key and value mapper.
 *
 * When two items have the same key, the optional merge
 * function is called with the two items and the result
 * of the merge function is used as the value for that key.
 * If no merge function is given, the value of the item
 * encountered first is taken.
 *
 * ```javascript
 * toMap(["foo", "bar"], x => x, x => x.length)
 * // => Map[ "foo" => 3, "bar" => 3 ]
 * ```
 *
 * @typeparam T Type of the elements in the given iterable.
 * @typeparam K Type of the map's keys.
 * @typeparam V Type of the map's values.
 * @param iterable The iterable to to be converted.
 * @param keyMapper Transforms an item into the map key to be used.
 * @param valueMapper Transforms an item into the value used for the corresponding key.
 * @param merger A merge function called when two items map to the same key and returns the merged value.  Called with two items having the same key, the first argument is the item encountered first in the stream.
 * @return A map with all the mapped key-value-pairs of the items.
 */
export function toMap<T, K, V>(iterable: Iterable<T>, keyMapper: TypedFunction<any, K>, valueMapper: TypedFunction<any, V>, merger?: BinaryOperator<V>): Map<K, V> {
    return collect(iterable, Collectors.toMap(keyMapper, valueMapper, merger));
}

/**
 * Creates an iterable for iterating over an object's key-value-pairs.
 * Only the object's own property are included.
 *
 * ```javascript
 * fromObject({foo:2, bar: 3})
 * // => Iterable[ {key: "foo", value: 2}, {key: "bar", value: 3} ]
 * ```
 *
 * @typeparam T Type of the object's values.
 * @param object The object with the key-value-pairs to be iterated.
 * @return An iterable with the object's key-value-pairs.
 */
export function* fromObject<T>(object: { [s: string]: T }): Iterable<{key: string, value: T}> {
    for (const key in object) {
        if (hasOwnProperty.call(object, key)) {
            yield {key, value: object[key]};
        }
    }
}

/**
 * Creates an iterable for iterating over an object's keys.
 * Only the object's own property are included.
 *
 * ```javascript
 * fromObjectKeys({foo:2, bar: 3, 42: 9})
 * // => Iterable["foo", "bar", "42"]
 * ```
 *
 * @param object The object with the keys to be iterated.
 * @return An iterable with the object's keys.
 */
export function* fromObjectKeys(object: { [s: string]: any }): Iterable<string> {
    for (const key in object) {
        if (hasOwnProperty.call(object, key)) {
            yield key;
        }
    }
}

/**
 * Creates an iterable for iterating over an object's values.
 * Only the object's own property are included.
 *
 * ```javascript
 * fromObjectValues({foo:2, bar: 3})
 * // => Iterable[2,3]
 * ```
 *
 * @typeparam T Type of the object's values.
 * @param object The object with the values to be iterated.
 * @return An iterable with the object's values.
 */
export function* fromObjectValues<T>(object: { [s: string]: T }): Iterable<T> {
    for (const key in object) {
        if (hasOwnProperty.call(object, key)) {
            yield object[key];
        }
    }
}

/**
 * Creates an iterable of random numbers. The generated numbers are
 * in the interval `[0,1]`. When the amount of numbers to generate
 * is not specified, an unlimited amount of numbers are generated.
 * Use methods such as {@link Methods.limit} to limit the iterable or
 * {@link Methods.consume} to extract only a few numbers.
 *
 * **Please note that the generated numbers are not cryptographically
 * secure random numbers and must not be used in any context dealing
 * with security.**
 *
 * ```javascript
 * random(3) // => Iterable[3 random numbers]
 *
 * random(-1) // => Iterable[]
 *
 * limit(random(Infinity), 5) // => Iterable[5 random numbers]
 *
 * first(random(10)) // => 1 random number
 * ```
 *
 * @param amount How many random numbers to generate. Defaults to `Infinity`.
 * @return A stream with the specified amount of random numbers.
 */
export function random(amount?: number): Iterable<number> {
    return generate(Math.random, amount);
}

/**
 * Creates an iterable from the given iterable or iterator. If it is an
 * iterable, returns that iterable, otherwise create an iterabl reading
 * from the iterator.
 *
 * ```javascript
 * fromIter([1,2,3]) // => Iterable[1,2,3]
 *
 * const set = new Set([1,2,3])
 * fromIter(set.values().next()) // => Iterable[2,3]
 * ```
 *
 * @typeparam T Type of the generated items.
 * @param iterableOrIterator Iterable or iterator from which to read the items.
 * @return An iterable over the iterable's or the iterator's items.
 */
export function fromIter<T>(iterableOrIterator: Iterable<T> | Iterator<T>): Iterable<T> {
    if (Symbol.iterator in iterableOrIterator) {
        return iterableOrIterator as Iterable<T>;
    }
    return wrapIterator(iterableOrIterator as Iterator<T>);
}

/**
 * Creates an iterable with the items provided by the given generator.
 *
 * ```javascript
 * generate(index => index, 2) // => Iterable[0,1,2]
 * generate(index => index, 0) // => Iterable[]
 * generate(index => index) // => Iterable[0,1,2,3,4,...]
 * generate(index => index, Infinity) // => Iterable[0,1,2,3,4,...]
 * generate(index => index, -Infinity) // => Iterable[]
 * generate(index => index, NaN) // => Iterable[]
 * ```
 *
 * @typeparam T Type of the generated items.
 * @param generator Generator for generating the items of the iterable. It is passed the current index as its argument.
 * @param amount How many items to generate, `Infinity` for an unlimited amount.
 * @return Iterable for iterating the given amount of times over the items supplied by the supplier.
 */
export function* generate<T>(generator: TypedFunction<number, T>, amount: number = Infinity): Iterable<T> {
    if (amount < 1 || isNaN(amount)) {
        return;
    }
    let i = 0;
    while (--amount >= 0) {
        yield generator(i++);
    }
}

/**
 * Creates an iterable with numbers starting at the given
 * value and ending at the given value.
 *
 * ```javascript
 * times(3) // => Iterable(0,1,2)
 * times(3, 4) // => Iterable(4,5,6)
 * times(3, 4, 8) // => Iterable(4,6,8)
 * times(1, 10, 12) // => Iterable(10)
 * times(0) // => Iterable()
 * times(3, 0, -2) // => Iterable(0, -1, -2)
 * times(-3) // => Iterable()
 * times(5, 0, Infinity) // => Iterable(0, NaN, NaN, NaN, Infinity)
 * times(5, Infinity, 0) // => Iterable(Infinity, NaN, NaN, NaN, 0)
 * times(Infinity) // => Iterable(0, 0, 0, 0, ...)
 * times(Infinity, 2, 3) // => Iterable(2, 2, 2, 2, ...)
 * times(NaN) // => Iterable()
 * times(5, NaN) // => Iterable(NaN, NaN, NaN, NaN, NaN)
 * times(5, 2, NaN) // => Iterable(2, NaN, NaN, NaN, NaN)
 * times(5, NaN, 7) // => Iterable(NaN, NaN, NaN, NaN, 7)
 * times(NaN, 0, 5) // => Iterable()
 * times(NaN, NaN, NaN) // => Iterable()
 *
 * ```
 *
 * @typeparam T Type of the items of the produced iterable.
 * @param amount Number of items to produce. Must not be negative.
 * @param start Initial number, defaults to 0.
 * @param end Last number, defaults to `start+amount-1`. May be smaller than end, in which case numbers of decreasing value are generated.
 * @return Iterable with the configured numbers.
 */
export function* times(amount: number, start: number = 0, end: number = start + amount - 1): Iterable<number> {
    amount = Math.floor(Math.max(0, amount));
    const diff = end - start;
    let step = amount !== Infinity  && amount > 1 ? (diff / (amount - 1)) : 0;
    if (!isFinite(step)) {
        step = NaN;
    }
    const half = amount === 1 ? 1 : Math.floor(amount / 2);
    for (let i = 0; i < half; ++i) {
        yield start + (i === 0 ? 0 : i * step);
    }
    // This makes sure that the end is not missed
    // due to floating point errors.
    for (let i = amount - half - 1; i >= 0; --i) {
        yield end - (i === 0 ? 0 : i * step);
    }
}

/**
 * Creates an iterable with numbers starting at the given
 * value and separated from each other by the given step.
 *
 * ```javascript
 * step(3) // => Iterable(0,1,2)
 * step(3, 4) // => Iterable(4, 5, 6)
 * step(3, 4, 8) // => Iterable(4, 12, 20)
 * step(-3) // => Iterable()
 * step(3, -4) // => Iterable(-4, -3, -2)
 * step(3, 4, -2) // => Iterable(4, 2, 0)
 * step(3, -4, -2) // => Iterable(-4, -6, -8)
 * step(Infinity) // => Iterable(0, 1, 2, 3, ...)
 * step(-Infinity) // => Iterable()
 * step(Infinity, 5) // => Iterable(5, 6, 7, 8, ...)
 * step(Infinity, 5, 2) // => Iterable(5, 7, 9, 11, ...)
 * step(3, Infinity) // => Iterable(Infinity, Infinity, Infinity)
 * step(4, 0, Infinity) // => Iterable(0, Infinity, Infinity, Infinity)
 * step(4, Infinity, Infinity) // => Iterable(Infinity, Infinity, Infinity, Infinity)
 * step(4, -Infinity, Infinity) // => Iterable(-Infinity, NaN, NaN, NaN)
 * step(Infinity, 2, Infinity) // => Iterable(2, Infinity, Infinity, Infinity, ...)
 * step(Infinity, Infinity, 2) // => Iterable(Infinity, Infinity, Infinity, Infinity, ...)
 * step(Infinity, -Infinity, 2) // => Iterable(-Infinity, -Infinity, -Infinity, -Infinity, ...)
 * step(Infinity, Infinity, Infinity) // => Iterable(Infinity, Infinity, Infinity, Infinity, ...)
 * step(NaN) // => Iterable()
 * step(5, NaN) // => Iterable(NaN, NaN, NaN, NaN, NaN)
 * step(5, 1, NaN) // => Iterable(1, NaN, NaN, NaN, NaN)
 * step(5, Infinity, NaN) // => Iterable(Infinity, NaN, NaN, NaN, NaN)
 * step(5, -Infinity, NaN) // => Iterable(-Infinity, NaN, NaN, NaN, NaN)
 * step(5, NaN, 2) // => Iterable(NaN, NaN, NaN, NaN, NaN)
 * step(5, NaN, NaN) // => Iterable(NaN, NaN, NaN, NaN, NaN)
 * step(NaN, NaN, NaN) // => Iterable()
 * ```
 *
 * @typeparam T Type of the items of the produced iterable.
 * @param amount Number of items to produce. Must not be negative.
 * @param start Initial number, defaults to 0.
 * @param step How far apart the individual items are, defaults to 1.
 * @return Iterable with the configured numbers.
 */
export function* step(amount: number, start: number = 0, step: number = 1): Iterable<number> {
    amount = Math.floor(Math.max(0, amount));
    let x = start;
    for (let i = 0; i < amount; ++i) {
        yield x;
        x += step;
    }
}

/**
 * Creates an iterable with the given item occuring the given
 * number of times.
 *
 * ```javascript
 * repeat(0, 9)
 * // => Iterable[0,0,0,0,0,0,0,0,0]
 *
 * repeat(0, 0) // => Iterable[]
 * repeat(0, -Infinity) // => Iterable[]
 * repeat(0, Infinity) // => Iterable[0,0,0,...]
 * repeat(0, NaN) // => Iterable[]
 * ```
 *
 * @typeparam T Type of the items of the produced iterable.
 * @param item Item to repeat.
 * @param amount How many times to repeat, `Infinity` for an unlimited amount.
 * @return Iterable contains the given item the given number of times.
 */
export function* repeat<T>(item: T, amount: number = Infinity): Iterable<T> {
    if (amount < 1 || isNaN(amount)) {
        return;
    }
    while (--amount >= 0) {
        yield item;
    }
}

/**
 * Creates an iterable starting with the initial seed.
 *
 * ```javascript
 * iterate(42, x => (0x19660D * x + 0x3C6EF35F) % 0x100000000)
 * // Random number generator, linear congruential generator from "Numerical Recipes".
 *
 * iterate(2, x => 2*x, 3) // => Iterable[2,4,8]
 * iterate(2, x => 2*x, 0) // => Iterable[]
 * iterate(2, x => 2*x, Infinity) // => Iterable[2,4,8,16,...]
 * iterate(2, x => 2*x, -Infinity) // => Iterable[]
 * iterate(2, x => 2*x, NaN) // => Iterable[]
 * ```
 *
 * @typeparam T Type of the items of the produced iterable.
 * @param seed Initial item.
 * @param next Function that takes the current item and produces the next item in the sequence.
 * @param amount How many times to iterate, `Infinity` for an unlimited amount.
 * @return Iterable for iterating over the provided items the given amount of times.
 */
export function* iterate<T>(seed: T, next: TypedFunction<T, T>, amount: number = Infinity): Iterable<T> {
    if (amount < 1 || isNaN(amount)) {
        return;
    }
    while ( --amount >= 0) {
        yield seed;
        seed = next(seed);
    }
}
