import { natural, Comparator } from "comparators";
import { Collector, Supplier, Consumer, BiConsumer, Function, Predicate, BiFunction, Try } from "./Interfaces";
import { Collectors } from "./Collectors";
import { TryFactory } from "./Try";

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Transform each element to another element of a different type.
 * ```javascript
 * map([0,1,2,3], x => 2 * x) // => Iterable[0,2,4,6]
 * ```
 * @typeparam T Type of the elements in the given iterable.. 
 * @typeparam S Type of the elements in the produced iterable.
 * @param iterable The iterable to be mapped.
 * @param mapper A function taking each item of the given iterable and transforms it into another item.
 * @return An iterable over the mapped elements.
 */
export function * map<T,S>(iterable : Iterable<T>, mapper: Function<T,S>) : Iterable<S> {
    for (let item of iterable) {
        yield mapper(item);
    }
}

/**
 * Applies the mapping function to each item and return an iterable
 * over all the mapped iterables. 
 * This is equivalent to `concat(map(mapper))`.
 * ```javascript
 * flatMap(["foo","bar"], x => fromString(x)) // => Iterable["f", "o", "o", "b", "a", "r"]
 * flatMap(doTry(["[1]","[2,3]","[4,]"], JSON.parse), x=>x.iterate()) // => Iterable[ [1], [2, 3] ]
 * ```
 * @typeparam T Type of the elements in the given iterable.. 
 * @typeparam S Type of the elements in the produced iterable.
 * @param iterable The iterable to be flat-mapped.
 * @param mapper Mapping function taking each item and producing a new iterable.
 * @return An iterable over all the items of the iterables produced by the mapper.
 */
export function * flatMap<T,S>(iterable : Iterable<T>, mapper: Function<T,Iterable<S>>) : Iterable<S> {
    for (let item of iterable) {
        for (let i of mapper(item)) {
            yield i;
        }
    }
}

/**
 * Chunks together consecutive items for which the classifier
 * returns the same value. Equality is checked with `===`.
 * ```javascript
 * chunk([1,2,3,4,5,6,1,2], i => Math.floor((i-1) / 3)) // => Stream[ [1,2,3], [4,5,6], [1,2] ]
 * ```
 * @typeparam T Type of the elements in the given iterable.
 * @typeparam K Type of the returned value of the chunker,
 * @param iterable The iterable to be chunked.
 * @param classifier It is passed the item as its first argument and the index as its second. Items are chunked together according to the returned value.
 * @return An iterable over the chunked items.
 */
export function * chunk<T, K=any>(iterable: Iterable<T>, classifier: BiFunction<T, number, K>) : Iterable<T[]> {
    let currentClass = undefined;
    let first = true;
    let index = -1;
    let chunk : T[] = [];
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

/**
 * Slices the items into chunks of sliceSize. This is equivalent
 * to `chunk(iterable, (_, i) => Math.floor(i/sliceSize))`.
 * ```javascript
 * slice([1,2,3,4,5], 2) // => Iterable[ [1,2], [3,4], [5] ]
 * ```
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be sliced.
 * @param sliceSize Size of the produced chunks.
 * @return An iterable over the sliced items.
 */
export function * slice<T>(iterable: Iterable<T>, sliceSize: number) : Iterable<T[]> {
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

/**
 * Produces an iterable over tuples of consisting of an item of the given iterable and
 * the corresponding item of the other iterable.
 * ```javascript
 * zip(["foo", "bar"], [3, 4]) // => Iterable[ ["foo",3], ["bar", 4] ]
 * toMap(zip(["foo", "bar"], [3, 4]), x=>x, x=>x) // => Map[ "foo" => 3, "bar" => 4] ]
 * ```
 * @typeparam T Type of the elements in the given iterable.. 
 * @param iterable The iterable to be zipped with the other.
 * @param other Other iterable to be zipped to the given iterable.
 * @return An iterable over al the produced tuples.
 */
export function * zip<T,S>(iterable: Iterable<T>, other: Iterable<S>) : Iterable<[T, S]> {
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
 * and yiel
 * ```javascript
 * zipSame("ab", ["cd", "ef"]) // => Iterable[ ["a","b"], ["c", "d"], ["e", "f"] ]
 * Array.from(zipSame("fb",["oa","or"])).map(x=>x.map(String).join("")).join("") // => "foobar"
 * ```
 * @typeparam T Type of the elements in the given iterable.. 
 * @param iterable The iterables to be zipped with the others.
 * @param others Other iterable to be zipped to the given iterable.
 * @return An iterable over al the produced tuples.
 */
export function * zipSame<T>(iterable: Iterable<T>, others: Iterable<T>[]) : Iterable<T[]> {
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

/**
 * Removes all elements from the iterable for which the
 * predicate does not return `true`.
 * ```javascript
 * filter([4,-4,2,-9], x => x > 0) // => Iterable[4,2]
 * ```
 * @typeparam T Type of the elements in the given iterable.. 
 * @param iterable The iterable to be filtered.
 * @param predicate Testing function returning `true` iff the item is to be kept, `false` otherwise.
 * @return An iterable over all item for which the predicate returned `true`.
 */
export function * filter<T>(iterable : Iterable<T>, predicate : Predicate<T>) : Iterable<T> {
    for (let item of iterable) {
        if (predicate(item)) {
            yield item;
        }
    }
}

/**
 * Similar to {@link map}, but handles any error that may be thrown by
 * the mapper by wrapping them in a {@link Try}. This is equivalen to
 * <code>map(x => Try.of(() => mapper(x)))</code>
 * ```javascript
 * doTry(["[1]","[2,3]","[4,]"], JSON.parse) // => Iterable[ Try[1], Try[2,3], Try[ParseError] ]
 * ```
 * @typeparam T Type of the elements in the given iterable. 
 * @typeparam S Type of the elements wrapped in a {@link Try} in the produced iterable.
 * @param iterable The iterable to to be processed.
 * @param mapper Mapping function that takes an item of the given iterable and produces a mapped item. If it throws an error, the resulting {@link Try} is not successful.
 * @return An iterable over the mapped elements, wrapped in a {@link Try} for encapsulating thrown errors.
 */
export function * doTry<T,S>(iterable: Iterable<T>, mapper: Function<T,S>) : Iterable<Try<S>> {
    for (let item of iterable) {
        yield TryFactory.of(() => mapper(item));
    }
}

/**
 * Splits the items into two groups according to the given
 * discriminator.
 * ```javascript
 * partition([-3,2,9,-4], x => x > 0) // => { false: [-3,-4], true: [2,9]}
 * ```
 * @typeparam T Type of the elements in the given iterable.. 
 * @param iterable The iterable to be partitioned.
 * @param discriminator Partitions each item into one of two groups by returning `true` of `false`.
 * @return An object containing the partitioned items.
 */
export function partition<T>(iterable: Iterable<T>, discriminator: Predicate<T>) : {false:T[],true:T[]} {
    return collect(iterable, Collectors.partition(discriminator));
};

/**
 * Splits the items into several groups, according to the given
 * classifier.
 * ```javascript
 * group(["a", "foo", "is", "some", "buzz"], x => x.length) // => Map [ 1 => ["a"], 2 => ["is"], 3 => "is", 4 => ["some", "buzz"] ]
 * ```
 * @typeparam T Type of the elements in the given iterable.. 
 * @typearam K Type of the group key.
 * @param iterable The iterable to be grouped.
 * @param classifier Returns the group for each item.
 * @return A map with the groups as keys and arrays as values, containg all the items for that group.
 */
export function group<T,K>(iterable: Iterable<T>, classifier: Function<T,K>) : Map<K, T[]> {
    return collect(iterable, Collectors.group(classifier));
};

/**
 * Joins every time with the given delimiter, optionally prepending a
 * prefix and appending a suffix to the output.
 * ```javascript
 * join([1,2,3], ",", "[", "]") // => "[1,2,3]"
 * ```
 * @typeparam T Type of the elements in the given iterable.. 
 * @param iterable The iterable to be joined.
 * @param delimiter String inserted between the items.
 * @param prefix String prepended to the joined string.
 * @param suffix String appended to the joined string.
 * @return A string consisting of the prefix, the items joined with the delimiter, and the suffix.
 */
export function join<T>(iterable: Iterable<T>, delimiter: string = "", prefix? : string, suffix? : string) : string {
    return collect(iterable, Collectors.join(delimiter, prefix, suffix));
}

/**
 * Sorts the items. Consider converting the iterable to an array and sorting
 * this array if you do not need an iterable for further operations. 
 * ```javascript
 * sort(["foobar", "a", "bar", Comparators.byField("length")] // => Iterable["a", "bar", "foobar"]
 * ```
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable with to be sorted.
 * @param comparator How to sort the items. Default to the natural order.
 * @return An iterable with the items in sorted order.
 */
export function sort<T>(iterable: Iterable<T>, comparator?: Comparator<T>) : Iterable<T> {
    const arr = Array.from(iterable);
    arr.sort(comparator);
    return arr[Symbol.iterator]();
}

/**
 * Similar to {@link distinct}, but allows for a custom key to
 * be specified, according to which uniqueness is determined.
 * ```javascript
 *  distinct([4,1,3,4,1,3,1,9]) // => Iterable[4,1,3,9]
 *  distinct({id:4},{id:2},{id:4]}, customer => customer.id) // => Iterable[ {id:4}, {id:2} ]
 * ```
 * @typeparam T Type of the elements in the given iterable.. 
 * @param iterable The iterable to be made unique
 * @param keyExtractor Returns a key for each item. Items with duplicate keys are removed. Defaults to taking the item itself as the key.
 * @return An iterable with all duplicates removed.
 */
export function * unique<T>(iterable: Iterable<T>, keyExtractor?: Function<T,any>) : Iterable<T> {
    // Set guarantees insertion order.
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

/**
 * Adds the index to each element of the given iterable. The index starts at 0
 * ```javascript
 * index(["foo", "bar"]) // => Iterable<[ [0, "foo"], [1, "bar"] ]>
 * ```
 * @typeparam T Type of the element in the iterable. 
 * @param iterable The iterable to be indexed.
 * @return An iterable with each item being an array consisting of the item's index and the item itself. The index starts at 0.
 */
export function * index<T>(iterable: Iterable<T>) : Iterable<[number, T]> {
    let i = 0;
    for (let item of iterable) {
        yield [i, item];
        i += 1;
    }
};

/**
 * Limits the iterable to at most the given number of elements.
 * ```javascript
 *  limit([1,2,3,4,5,6], 3) // => Iterable[1,2,3]
 * ```
 * @typeparam T Type of the elements in the given iterable.. 
 * @param iterable The iterable to be limited.
 * @param limit The maximum number of items in the resulting iterable.
 * @return An iterable with at most the given number of items.
 */
export function * limit<T>(iterable: Iterable<T>, limit: number) : Iterable<T> {
    for (let item of iterable) {
        yield item;
        if (--limit < 1) {
            break;
        }
    }
}

/**
 * Cycles over the elements of the iterable the given number of times.
 * ```javascript
 * cycle([1,2,3], 3) // => Iterable[1,2,3,1,2,3,1,2,3]
 * limit(cycle([1,2,3]), 5) // => Iterable[1,2,3,1,2]
 * ```
 * @typeparam T Type of the elements in the given iterable.
 * @param iterable The iterable to be cycled.
 * @param count The number of cycle. If not given, cycles an unlimited amount of times.
 * @return An iterable with the items of the given iterable repeating.
 */
export function * cycle<T>(iterable: Iterable<T>, count: number = Infinity) : Iterable<T> {
    count = Math.max(0, count);
    const items = Array.from(iterable);
    for (let i = 0; i < count; ++i) {
        for (let item of items) {
            yield item;
        }
    }
}

/**
 * Calls the given consumer once for each item. The consumer is
 * not called before the stream is consumed by some terminal operation.
 * ```javascript
 * visit([1,2,3], console.log) // => Iterable[1,2,3]; prints `1,2,3` once the stream is consumed.
 * ```
 * @typeparam T Type of the elements in the given iterable.. 
 * @param iterable The iterable to be limited.
 * @param consumer Callback taking each item.
 * @return An iterable with the same items as the given iterable.
 */
export function * visit<T>(iterable: Iterable<T>, consumer: Consumer<T>) {
    for (let item of iterable) {
        consumer(item);
        yield item;
    }
}

/**
 * Discards the given number of items from the iterable.
 * ```javascript
 * skip([1,2,3,4,5,6], 3) // => Iterable[4,5,6] 
 * ```
 * @typeparam T Type of the elements in the given iterable.. 
 * @param iterable The iterable to be skipped.
 * @return An iterable with the given number of items skipped.
 * @see {@link limit}
 */
export function * skip<T>(iterable: Iterable<T>, skip: number) : Iterable<T> {
    const it = iterable[Symbol.iterator]();
    while (skip-->0) {
        if (it.next().done) {
            break;
        }
    }
    for (let entry = it.next(); !entry.done; entry = it.next()) {
        yield entry.value;
    }
}

/**
 * Reverses the order of the items. Note that the items
 * need to be saved temporarily.
 * ```javascript
 * reverse([1,2,3]) // => Iterable[3,2,1]
 * ```
 * @typeparam T Type of the elements in the given iterable.. 
 * @param iterable The iterable to be reversed.
 * @return An iterable with the items in reversed order.
 */
export function * reverse<T>(iterable: Iterable<T>) : Iterable<T> {
    const arr = Array.from(iterable);
    for (let i = arr.length; i-->0;) {
        yield arr[i];
    }
}

/**
 * Concatenates all iterables into one iterable of all the items.
 * ```javascript
 * concat("foo", "bar", "baz") // => Iterable["f", "o", "o", "b", "a", "r", "b", "a", "z"]
 * ```
 * @typeparam T Type of the elements in the given iterable.. 
 * @param iterable The iterable to be concatenated to the others.
 * @param moreIterable Other iteratbles to be concatenated.
 * @return An iterable over all the items of the given iterables.
 */
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

/**
 * Counts the items.
 * ```javascript
 * count([1,2,3]) // => 3 
 * ```
 * @typeparam T Type of the elements in the given iterable. 
 * @param iterable The iterable to be counted.
 * @return The number of items in the iterable.
 */
export function size(iterable : Iterable<any>) : number {
    let i = 0;
    for (let it = iterable[Symbol.iterator](); !it.next().done;) ++i;
    return i;
}

/**
 * Searches for the first occurence of an item matching the predicate.
 * ```javascript
 * find(["foo1", "bar,"foo2"], x => x.startsWith("foo")) // => "foo1"
 * ```
 * @typeparam T Type of the elements in the given iterable. 
 * @param iterable The iterable to be scanned.
 * @param predicate Test to be performed on the items.
 * @return The item iff found, undefined otherwise.
 */
export function find<T>(iterable: Iterable<T>, predicate: Predicate<T>) : T {
    for (let item of iterable) {
        if (predicate(item)) {
            return item;
        }
    }
    return undefined;
}

/**
 * Determines whether every items matches the given predicate.
 * ```javascript
 * every("fooz", x => x < "j") // => false
 * ```
 * @typeparam T Type of the elements in the given iterable. 
 * @param iterable The iterable to be scanned.
 * @param predicate Test to be performed on the items.
 * @return Whether every items matches the given predicate.
 */
export function every<T>(iterable: Iterable<T>, predicate: Predicate<T>) : boolean {
    for (let item of iterable) {
        if (!predicate(item)) {
            return false;
        }
    }
    return true;
}

/**
 * Determines whether at least one items matches the given predicate.
 * ```javascript
 * some("fooz", x => x < "j") // => true
 * ```
 * @typeparam T Type of the elements in the given iterable. 
 * @param iterable The iterable to be scanned.
 * @param predicate Test to be performed on the items.
 * @return Whether some (at least one) item matches the given predicate. 
 */
export function some<T>(iterable: Iterable<T>, predicate: Predicate<T>) : boolean {
    for (let item of iterable) {
        if (predicate(item)) {
            return true;
        }
    }
    return false;
}

/**
 * Determines whether no item matches the given predicate. This
 * is equivalent to <code>!some(iterable, predicate)</code>.
 * ```javascript
 * none("fooz", "x => x < "j") // => false
 * ```
 * @typeparam T Type of the elements in the given iterable. 
 * @param iterable The iterable to be scanned.
 * @param predicate Test to be performed on each items.
 * @return Whether no item matches the given predicate.
 */
export function none<T>(iterable: Iterable<T>, predicate: Predicate<T>) : boolean {
    return !some(iterable, predicate);
}

/**
 * Determines whether the iterable contains the given item.
 * Equivalence is checked with <code>===</code>. This is
 * equivalent to `some(iterable, x => x === object)`.
 * ```javascript
 * has("foobar", "o") // => true
 * ```
 * @typeparam T Type of the elements in the given iterable. 
 * @param iterable The iterable to be scanned.
 * @return Whether the given object is contained in the iterable.
 */
export function has<T>(iterable: Iterable<T>, object: T) : boolean {
    return some(iterable, item => item === object);
}

/**
 * Computes the minimum of the items.
 * ```javascript
 * min([3,2,9,4]) // => 9
 * min(["foo", "bar", "I"], Comparators.byField("length")) // => "I"
 * min([]) // => undefined
 * ```
 * @typeparam T Type of the elements in the given iterable. 
 * @param iterable The iterable to be minimized.
 * @param comparator How two items are compared. Defaults to the natural order, ie. by using `&lt;` and `&gt;`.
 * @return The smallest item. If there are multiple smallest items, returns the first.  `undefined` iff the iterable is empty.
 */
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

/**
 * Computes the maxmimum of the items.
 * ```javascript
 * max([3,2,9,4]) // => 9
 * max(["foo", "bar", "I"], Comparators.byField("length")) // => "foo"
 * max([]) // => undefined
 * ```
 * @typeparam T Type of the elements in the given iterable. 
 * @param iterable The iterable to be maximized.
 * @param comparator How two items are compared. Defaults to the natural order, ie. by using `&lt;` and `&gt;`.
 * @return The largest item. If there are multiple largest items, returns the first. `undefined` iff the iterable is empty.
 */
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

/**
 * Coalesces all items into one value.
 * ```javascript
 * reduce([1,2,3], (sum,x) => sum + x, 10) // => 16
 * ```
 * @typeparam T Type of the elements in the given iterable. 
 * @typeparam S Type of the reduced value.
 * @param iterable The iterable to be reduced.
 * @param reducer Takes the current reduced value as its first argument and the current item as its second, combines the item with the current reduced value, and returns that value.
 * @param initialValue The initial value of the reduction.
 * @return The reduced value, or the initial value iff the iterable is empty.
 */
export function reduce<T,S>(iterable: Iterable<T>, reducer: BiFunction<S,T,S>, initialValue: S) : S {
    for (let item of iterable) {
        initialValue = reducer(initialValue, item);
    }
    return initialValue;
}

/**
 * Similar to {@link reduce}, but reduces to items of the same type
 * as the items and thus does not require an initial value.
 * ```javascript
 * reduceSame([1,2,3], (sum,x) => sum + x) // => 6
 * ```
 * @typeparam T Type of the elements in the given iterable. 
 * @param iterable The iterable to be reduced.
 * @param reducer Takes the current reduced value as its first argument and the current item as its second, combines the item with the current reduced value, and returns that value.
 * @return The reduced value, or undefined iff the iterable is empty.
 */
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

/**
 * Sums all items arithmetically.
 * ```javascript
 * sum([1,2,3]) // => 6
 * sum(["I", "of", "Borg"], x => x.length) // => 7
 * ```
 * @typeparam T Type of the elements in the given iterable. 
 * @param iterable The iterable to be summed.
 * @param converted Converts an items into a number. Defaults to <code>Number(...)</code>.
 * @return The sum of the items.
 */
export function sum<T>(iterable: Iterable<T>, converter?: Function<T, number>) : number {
    return collect(iterable, Collectors.sum(converter));
};

/**
 * Applies all pending operations, ending the given iterable.
 * ```javascript
 * visit([1,2,3], console.log) // Iterable[1,2,3]; prints nothing
 * end(visit([1,2,3], console.log)) // prints 1,2,3
 * ```
 * @typeparam T Type of the elements in the given iterable. 
 * @param iterable The iterable to be terminated.
 */
export function end<T>(iterable: Iterable<T>) : void {
    const it = iterable[Symbol.iterator]();
    while (!it.next().done);
}

/**
 * Creates and object an incorporates all items into that object.
 * ```javascript
 * collect([1,2,3], Collectors.summarize) // => Statistic[min:1, max:3, count: 3, sum: 6, average: 2, variance: 0.67]
 * ```
 * @typeparam T Type of the elements in the given iterable. 
 * @typeparam S Type of the intermediate value that incorporates each item in order.
 * @typeparam R Type of the final collected value.
 * @param iterable The iterable to be collected.
 * @param collector How to collect the items.
 * @return The collected value.
 */
export function collect<T,S,R=S>(iterable: Iterable<T>, collector: Collector<T,S,R>) : R {
    return collectWith(iterable, collector.supplier, collector.accumulator, collector.finisher);
};

/**
 * Same as {@link collect}, but allows specifying the parts of
 * the collector individually.
 * ```javascript
 * collect([1,2,3], () => [], (array, x) => array.push(x), x => new Set(x)) // => Set[1,2,3]
 * ```
 * @typeparam T Type of the elements in the given iterable. 
 * @typeparam S Type of the intermediate value that incorporates each item in order.
 * @typeparam R Type of the final collected value.
 * @param iterable The iterable to be collected.
 * @param suppplier Provides the intermediate object into which the items are incorporated.
 * @param accumulator Takes the intermediate objects as its first argument and the current items as its seconds, and incorporates the item into the intermediate value. 
 * @param finisher Takes the intermediate object with all the items incoporated, and transforms it into the final value. 
 * @return The final collected value.
 */
export function collectWith<T,S,R=S>(iterable: Iterable<T>, supplier: Supplier<S>, accumulator: BiConsumer<S,T>, finisher: Function<S,R>) : R {
    const collected = supplier();
    for (let item of iterable) {
        accumulator(collected, item);
    }
    return finisher(collected);
};

/**
 * Creates an array with the items of the given iterable.
 * ```javascript
 * toArray("foobar") // => ["f", "o", "o", "b", "a", "r"]
 * ```
 * @typeparam T Type of the elements in the given iterable. 
 * @param iterable The iterable to to be converted.
 * @return An array with the items.
 */
export function toArray<T>(iterable: Iterable<T>) : T[] {
    return Array.from(iterable);
}

/**
 * Creates a set with the items of the given iterable.
 * ```javascript
 * toSet("foobar") // => Set["f", "o", "b", "a", "r"]
 * ```
 * @typeparam T Type of the elements in the given iterable. 
 * @param iterable The iterable to to be converted.
 * @return A set with the items.
 */
export function toSet<T>(iterable: Iterable<T>) : Set<T> {
    return new Set(iterable);
}

/**
 * Creates a map from the items of the given iterable.
 * ```javascript
 * toMap(["foo", "bar"], x => x, x => x.length) // => Map[ "foo" => 3, "bar" => 3 ]
 * ```
 * @typeparam T Type of the elements in the given iterable.
 * @typeparam K Type of the map's keys.
 * @typeparam V Type of the map's values.
 * @param iterable The iterable to to be converted.
 * @param keyMapper Transforms an item into the map key to be used.
 * @param valueMapper Transforms an item into the value used for the corresponding key.
 * @return A map with all the mapped key-value-pairs of the items.
 */
export function toMap<T, K, V>(iterable: Iterable<T>, keyMapper: Function<any,K>, valueMapper: Function<any,V>) : Map<K,V> {
    return collect(iterable, Collectors.toMap(keyMapper, valueMapper));
}

/**
 * Creates an iterable for iterating over an object's key-value-pairs.
 * Only the object's own property are included.
 * ```javascript
 * fromObject({foo:2, bar: 3}) // => Iterable[ ["foo", 2], ["bar", 3] ]
 * ```
 * @typeparam T Type of the object's values.
 * @param object The object with the key-value-pairs to be iterated.
 * @return An iterable with the object's key-value-pairs.
 */
export function * fromObject<T>(object: {[s: string] : T}) : Iterable<[string,T]> {
    for (let key in object) {
        if (hasOwnProperty.call(object, key)) {
            yield [key, object[key]];
        }
    }
}

/**
 * Creates an iterable for iterating over an object's keys.
 * Only the object's own property are included.
 * ```javascript
 * fromObjectKeys({foo:2, bar: 3, 42: 9}) // => Iterable["foo", "bar", "42"]
 * ```
 * @param object The object with the keys to be iterated.
 * @return An iterable with the object's keys.
 */
export function * fromObjectKeys(object: {[s: string] : any}) : Iterable<string> {
    for (let key in object) {
        if (hasOwnProperty.call(object, key)) {
            yield key;
        }
    }
}

/**
 * Creates an iterable for iterating over an object's values.
 * Only the object's own property are included.
 * ```javascript
 * fromObjectValues({foo:2, bar: 3}) // => Iterable[2,3]
 * ```
 * @typeparam T Type of the object's values.
 * @param object The object with the values to be iterated.
 * @return An iterable with the object's values.
 */
export function * fromObjectValues<T>(object: {[s: string] : T}) : Iterable<T> {
    for (let key in object) {
        if (hasOwnProperty.call(object, key)) {
            yield object[key];
        }
    }
}

/**
 * Creates an iterable with the items provided by the given generator.
 * ```javascript
 * generate(index => index) // => Iterable(0,1,2,3,4,...)
 * ```
 * @typeparam T Type of the generated items.
 * @param generator Generator for generating the items of the iterable. It is passed the current index as its argument.
 * @param amount How many items to generate, <code>Infinity</code> for an unlimited amount.
 * @return Iterable for iterating the given amount of times over the items supplied by the supplier.
 */
export function * generate<T>(generator: Function<number, T>, amount: number = Infinity) : Iterable<T> {
    amount = Math.max(0, amount);
    for (let i = 0; i < amount; ++i) {
        yield generator(i);
    }
}

/**
 * Creates an iterable with numbers starting at the given
 * value and ending at the given value.
 * ```javascript
 * times(3) // => Iterable(0,1,2)
 * times(3, 4) // => Iterable(4,5,6)
 * times(3, 4, 8) // => Iterable(4,6,8)
 * times(1, 10, 12) // => Iterable(10)
 * times(0) // => Iterable()
 * times(3, 0, Infinity) // => Iterable(NaN, NaN, NaN)
 * times(3, 0, -2) // => Iterable(0, -1, -2)
 * times(-3) // => Iterable()
 * times(Infinity) // => Iterable(0,1,2,3,4,5,...)
 * ```
 * @typeparam T Type of the items of the produced iterable.
 * @param amount Number of items to produce. Must not be negative.
 * @param start Initial number, defaults to 0.
 * @param end Last number, defaults to <code>start+amount-1</code>. May be smaller than end, in which case numbers of decreasing value are generated.
 * @return Iterable with the configured numbers.
 */
export function * times(amount: number, start: number = 0, end: number = start+amount-1) : Iterable<number> {
    amount = Math.floor(Math.max(0, amount));
    let step = amount > 1 ? (end-start)/(amount-1) : 0;
    if (!isFinite(step)) {
        step = NaN;
    } 
    const half = Math.floor(amount / 2);
    for (let i = 0; i < half; ++i) {
        yield start + i * step;
    }
    // This makes sure that the end is not missed
    // due to floating point errors.
    for (let i = amount - half - 1; i >= 0; --i) {
        yield end - i * step;
    }
}

/**
 * Creates an iterable with the given item occuring the given
 * number of times.
 * ```javascript
 * repeat(0, 9) // => Iterable[0,0,0,0,0,0,0,0,0]
 * ```
 * @typeparam T Type of the items of the produced iterable.
 * @param item Item to repeat.
 * @param amount How many times to repeat, <code>Infinity</code> for an unlimited amount.
 * @return Iterable contains the given item the given number of times.
 */
export function * repeat<T>(item: T, amount: number = Infinity) : Iterable<T> {
    amount = Math.max(0, amount);
    for (let i = 0; i < amount; ++i) {
        yield item;
    }
};

/**
 * Creates an iterable starting with the initial seed.
 * ```javascript
 * iterate(42, x => (0x19660D * x + 0x3C6EF35F) % 0x100000000) // Random number generator, linear congruential generator from "Numerical Recipes".
 * ```
 * @typeparam T Type of the items of the produced iterable.
 * @param seed Initial item.
 * @param next Function that takes the current item and produces the next item in the sequence.
 * @param amount How many times to iterate, <code>Infinity</code> for an unlimited amount.
 * @return Iterable for iterating over the provided items the given amount of times.
 */
export function * iterate<T>(seed: T, next: Function<T,T>, amount: number = Infinity) : Iterable<T> {
    amount = Math.max(0, amount);
    for (let i = 0; i < amount; ++i) {
        yield seed;
        seed = next(seed);
    }
}