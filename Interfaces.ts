import { Comparator } from "comparators";

export interface Statistics {
    /** The arithmetic average of the incorporated items. */
    average : number;
    /** The number of incorporated items. */
    count: number;
    /** The largest of the incorporated items. */
    max: number;
    /** The smallest of the incorporated items. */
    min: number;
    /** The arithmetic sum of the incorporated items. */
    sum : number;
    /** The variance of the incorporated items. This is the uncorrected (not sampled) variance. */
    variance: number;
};

/**
 * A function with a single argument.
 * @typeparam T Type of the function's argument.
 * @typeparam R Type of the function's return value. 
 */
export interface Function<T,R> {
    (arg1: T) : R;
};

/**
 * A supplier produces a value without explicit input.
 * @typeparam T Type of the produced value.
 */
export interface Supplier<T> {
    () : T;
};

/**
 * A consumer takes a value and outputs nothing.
 * @typeparam T Type of the consumed value. 
 */
export interface Consumer<T> {
    (object: T) : void;
};

/**
 * A function with a two argument.
 * @typeparam S Type of the function's first argument.
 * @typeparam T Type of the function's second argument.
 * @typeparam R Type of the function's return value. 
 */
export interface BiFunction<S,T,R> {
    (arg1: S, arg2: T) : R;
};

/**
 * A predicate assign a boolean value to an item.
 * @typeparam T Type of the item. 
 */
export interface Predicate<T> {
    (object : T) : boolean;
};

/**
 * A consumer that takes two value and outputs nothing.
 * @typeparam S Type of the first consumed value. 
 * @typeparam T Type of the second consumed value. 
 */
export interface BiConsumer<S,T> {
    (arg1: S, arg2: T) : void;
};

export interface Collector<S,T,R=T> {
    accumulator: BiConsumer<T,S>;
    supplier: Supplier<T>;
    finisher: Function<T,R>;
};

/**
 * A factory for producing a {@link Try} representing
 * the result of some operation that may fail.
 */
export interface ITryFactory {
    /**
     * Creates a {@link Try} from a successfully produced value.
     * @typeparam T Type of the value produced by the operation on success.
     * @param value The successful result of some operation.
     * @return A {@link Try} representing the sucessful operation.
     */
    success<T>(value: T) : Try<T>;
    /**
     * Creates a {@link Try} from a failed operation.
     * @typeparam T Type of the value produced by the operation on success.
     * @param value The error of some failed operation.
     * @return A {@link Try} representing the failed operation.
     */
    failure<T>(error: Error) : Try<T>;
    /**
     * Creates a {@link Try} from an operation that may succeed or fail.
     * @typeparam T Type of the value produced by the operation on success.
     * @param operation An operation that produces a value, but may fail to do so by throwing an error.
     * @return A {@link Try} representing the result of the operation.
     */
    of<T>(operation: Supplier<T>) : Try<T>;
};

export interface StreamFactory {
    stream<T>(iterable: Iterable<T>) : Stream<T>;
    generate<T>(generator: Function<number, T>, amount?: number) : Stream<T>;
    iterate<T>(seed: T, next: Function<T,T>, amount?: number) : Stream<T>;
    repeat<T>(item: T, amount?: number) : Stream<T>;
    times(amount: number, start?: number, end?: number) : Stream<number>;
    fromObject<T>(object: {[s: string] : T}) : Stream<[string,T]>;
    fromObjectKeys(object: {[s: string] : any}) : Stream<string>;
    fromObjectValues<T>(object: {[s: string] : T}) : Stream<T>;
};

export interface Try<T> {
    success : boolean;
    map<S>(mapper: Function<T,S>) : Try<S>;
    flatMap<S>(mapper: Function<T, Try<S>>) : Try<S>;
    recover(backup: Function<Error,T>) : Try<T>;
    stream(factory?: StreamFactory) : Stream<T>;
    iterate() : Iterable<T>;
    orElse(backup: T) : T;
    orThrow() : T;
    fold<S>(successHandler: Function<T,S>, failureHandler: Function<Error,S>) : Try<S>;
    then<S>(mapper: Function<T, S|Try<S>>) : Try<S>;
    catch(mapper: Function<Error, T|Try<T>>) : Try<T>;
}

/**
 * A stream represents a sequence of values. Use
 * a factory method for creating streams either from
 * iterables or other objects:
 * ```javascript
 * const myStream = require("streams").stream([1,2,3])
 * const yourStream = require("streams").times(10) // Stream[0,1,2,3,...,9]
 * ```
 * 
 * Streams may be transformed into other stream via 
 * non-terminal methods such as {@link Stream#map}
 * or {@link Stream#filter}:
 * ```javascript
 * stream([1,2,3]).map(x => x * x) // => Stream[2,4,6]
 * stream("foobar").filter(x => x > "c") // => Stream["f", "o", "o", "r"]
 * ```
 * 
 * Streams do not process their items until a terminal
 * operation is applied to the stream:
 * ```javascript
 * // Does not print anything as visit is not a terminal operation.
 * stream("foobar").visit(console.log).filter(x => x > "a")
 * // End is a terminal operation that causes the stream to be processed.
 * stream("foobar").visit(console.log).filter(x => x > "a").end()
 * ```
 * 
 * After a terminal or non-terminal operation was applied, no
 * other operation may be applied to the original stream anymore:
 * ```javascript
 * const myStream = stream([9,10,11])
 * myStream.forEach(console.log) // prints 9,10,11
 * myStream.forEach(console.log) // throws an Error: Stream was already consumed.
 * ```
 * @typeparam T Type of the items in the stream.
 */
export interface Stream<T> {
    [Symbol.iterator]() : Iterator<T>;

    /**
     * Chunks together consecutive items for which the classifier
     * returns the same value. Equality is checked with `===`.
     * ```javascript
     * stream([1,2,3,4,5,6,1,2]).chunk(i => Math.floor((i-1) / 3)) // => Stream[ [1,2,3], [4,5,6], [1,2] ] 
     * ```
     * @typeparam K Type of the returned value of the chunker,
     * @param classifier It is passed the item as its first argument and the index as its second. Items are chunked together according to the returned value.
     * @return A stream over the chunked items.
     */
    chunk<K=any>(classifier: BiFunction<T, number, K>) : Stream<T[]>;

    /**
     * Creates an object and incorporates all items into that object.
     * ```javascript
     * stream([1,2,3]).collect(Collectors.summarize) // => Statistic[min:1, max:3, count: 3, sum: 6, average: 2, variance: 0.67]
     * ```
     * @typeparam S Type of the intermediate object that incorporates each item in order.
     * @typeparam R Type of the final collected value.
     * @param collector How to collect the items.
     * @return The collected value.
     */
    collect<S,R=S>(collector: Collector<T,S,R>) : R;

    /**
     * Same as {@link #collect}, but allows specifying the parts of
     * the collector individually.
     * ```javascript
     * stream([1,2,3]).collect(() => [], (array, x) => array.push(x), x => new Set(x)) // => Set[1,2,3]
     * ```
     * @typeparam S Type of the intermediate value that incorporates each item in order.
     * @typeparam R Type of the final collected value.
     * @param suppplier Provides the intermediate object into which the items are incorporated.
     * @param accumulator Takes the intermediate objects as its first argument and the current items as its seconds, and incorporates the item into the intermediate value. 
     * @param finisher Takes the intermediate object with all the items incoporated, and transforms it into the final value. 
     * @return The final collected value.
     */
    collectWith<S,R=S>(supplier: Supplier<S>, accumulator: BiConsumer<S,T>,  finisher: Function<S,R>) : R;

    /**
     * Concatenates given all iterables into one iterable of all the items.
     * ```javascript
     * stream("foo").concat("bar", "baz") // => Stream["f", "o", "o", "b", "a", "r", "b", "a", "z"]
     * ```
     * @param moreIterable Other iteratbles to be concatenated.
     * @return A stream over all the items of this stream and the given iterables.
     */
    concat(...iterables: Iterable<T>[]) : Stream<T>;

    /**
     * Cycles over the elements of the iterable the given number of times.
     * ```javascript
     * stream([1,2,3]).cycle(3) // => Stream[1,2,3,1,2,3,1,2,3]
     * stream([1,2,3]).cycle().limit(5) // => Stream[1,2,3,1,2]
     * ```
     * @param count The number of cycle. If not given, cycles an unlimited amount of times.
     * @return A stream with the items of the this stream repeating.
     */
    cycle(count?: number) : Stream<T>;

    /**
     * Applies all pending operations, ending this stream.
     * ```javascript
     * stream([1,2,3]).visit(console.log) // Stream[1,2,3]; prints nothing
     * stream([1,2,3]).visit(console.log).end() // prints 1,2,3
     * ```
     */
    end() : void;

    /**
     * Determines whether every items matches the given predicate.
     * ```javascript
     * stream("fooz").every(x => x < "j") // => false
     * ```
     * @param predicate Test to be performed on the items.
     * @return Whether every items matches the given predicate.
     */
    every(predicate: Predicate<T>) : boolean;

    /**
     * Searches for the first occurence of an item matching the predicate.
     * ```javascript
     * stream(["foo1", "bar,"foo2").find(x => x.startsWith("foo")) // => "foo1"
     * ```
     * @param predicate Test to be performed on the items.
     * @return The item iff found, `undefined` otherwise.
     */
    find(predicate: Predicate<T>) : T;

    /**
     * Applies the mapping function to each item and return a stream
     * over all the mapped iterables.
     * This is equivalent to `concat(map(mapper))``.
     * ```javascript
     * stream(["foo","bar"]).flatMap(x => x) // => Stream["f", "o", "o", "b", "a", "r"]
     * stream(["[1]","[2,3]","[4,]"]).try(JSON.parse).flatMap(x=>x.stream()) // => Stream[ [1], [2, 3] ]
     * ```
     * @typeparam S Type of the elements in the produced stream.
     * @param mapper Mapping function taking each item and producing a new stream or iterable.
     * @return A stream over all the items of the iterables produced by the mapper.
     */
    flatMap<S>(mapper: Function<T,Iterable<S>>) : Stream<S>;

    /**
     * Removes all elements from the iterable for which the
     * predicate does not return `true`.
     * ```javascript
     * stream([4,-4,2,-9]).filter(x => x > 0) // => Stream[4,2]
     * ```
     * @param predicate Testing function returning `true` iff the item is to be kept, `false` otherwise.
     * @return A stream over all item for which the predicate returned `true`.
     */
    filter(predicate : Predicate<T>) : Stream<T>;

    /**
     * Passes each item of this stream to the given consumer.
     * ```javascript
     * stream([1,2,3]).forEach(console.log); // prints 1,2,3
     * ```
     * @param consumer A callback that receives each item of this stream in order.
     */
    forEach(consumer: Consumer<T>) : void;

    /**
     * Splits the items into several groups, according to the given
     * classifier.
     * ```javascript
     * stream(["a", "foo", "is", "some", "buzz"]).group(x => x.length) // => Map [ 1 => ["a"], 2 => ["is"], 3 => "is", 4 => ["some", "buzz"] ]
     * ```
     * @typearam K Type of the group key.
     * @param classifier Returns the group for each item.
     * @return A map with the groups as keys and arrays as values, containg all the items for that group.
     */    
    group<K=any>(classifier: Function<T,K>) : Map<K, T[]>;

    /**
     * Determines whether thsi stream contains the given item.
     * Equivalence is checked with ```===```. This is
     * equivalent to ```stream(...).some(x => x === object)`.
     * ```javascript
     * stream("foobar").has("o") // => true
     * ```
     * @return Whether the given object is contained in this stream.
     */
    has(object: T) : boolean;

    /**
     * Adds the index to each element of this stream. The index starts at 0.
     * ```javascript
     * stream(["foo", "bar"]).index() // => Stream<[ [0, "foo"], [1, "bar"] ]>
     * ```
     * @return A stream with each item being an array consisting of the item's index and the item itself. The index starts at 0.
     */
    index() : Stream<[number, T]>;

    /**
     * Joins every time with the given delimiter, optionally prepending a
     * prefix and appending a suffix to the output.
     * ```javascript
     * stream([1,2,3]).join(",", "[", "]") // => "[1,2,3]"
     * ```
     * @param delimiter String inserted between the items.
     * @param prefix String prepended to the joined string.
     * @param suffix String appended to the joined string.
     * @return A string consisting of the prefix, the items joined with the delimiter, and the suffix.
     */
    join(delimiter?: string, prefix? : string, suffix? : string) : string;

    /**
     * Limits the stream to at most the given number of elements.
     * ```javascript
     *  stream([1,2,3,4,5,6]).limit(3) // => Stream[1,2,3]
     * ```
     * @param limit The maximum number of items in the resulting iterable.
     * @return A stream with at most the given number of items.
     */
    limit(limitTo: number) : Stream<T>;

    /**
     * Transform each element to another element of a possibly different type.
     * ```javascript
     * stream([0,1,2,3]).map(x => 2 * x) // => Stream[0,2,4,6]
     * ```
     * @typeparam S Type of the elements in the produced iterable.
     * @param mapper A function taking each item of this stream and transforms it into another item.
     * @return An iterable over the mapped elements.
     */
    map<S>(mapper : Function<T,S>) : Stream<S>;
    
    /**
     * Computes the maxmimum of the items.
     * ```javascript
     * stream([6,2,3,9,4]).max() // => 9
     * stream(["foo", "bar", "I"]).max(Comparators.byField("length")) // => "foo"
     * stream([]).max() // => undefined
     * ```
     * @param comparator How two items are compared. Defaults to the natural order, ie. by using `&lt;` and `&gt;`.
     * @return The largest item. If there are multiple largest items, returns the first. `undefined` iff this stream is empty.
     */
    max(comparator : Comparator<T>) : T;

    /**
     * Computes the minimum of the items.
     * ```javascript
     * stream([3,2,9,4]).min() // => 9
     * stream(["foo", "bar", "I"].min(Comparators.byField("length")) // => "I"
     * stream([]).min() // => undefined
     * ```
     * @param comparator How two items are compared. Defaults to the natural order, ie. by using `&lt;` and `&gt;`.
     * @return The smallest item. If there are multiple smallest items, returns the first.  `undefined` iff this stream is empty.
     */
    min(comparator : Comparator<T>) : T;

    /**
     * Splits the items into two groups according to the given
     * discriminator.
     * ```javascript
     * stream([-3,2,9,-4]).partition(x => x > 0) // => { false: [-3,-4], true: [2,9]}
     * ```
     * @param discriminator Partitions each item into one of two groups by returning `true` of `false`.
     * @return An object containing the partitioned items.
     */
    partition(predicate: Predicate<T>) : {false:T[],true:T[]};

    /**
     * Coalesces all items into one value.
     * ```javascript
     * stream([1,2,3]).reduce((sum,x) => sum + x, 10) // => 16
     * ```
     * @typeparam S Type of the reduced value.
     * @param reducer Takes the current reduced value as its first argument and the current item as its second, combines the item with the current reduced value, and returns that value.
     * @param initialValue The initial value of the reduction.
     * @return The reduced value, or the initial value iff this stream is empty.
     */
    reduce<S>(reducer: BiFunction<S,T,S>, initialValue: S) : S;

    /**
     * Similar to {@link reduceSame}, but reduces to items of the same type
     * as the items and thus does not require an explicit initial value.
     * ```javascript
     * stream([1,2,3]).reduceSame((sum,x) => sum + x) // => 6
     * ```
     * @param reducer Takes the current reduced value as its first argument and the current item as its second, combines the item with the current reduced value, and returns that value.
     * @return The reduced value, or undefined iff the iterable is empty.
     */
    reduceSame(reducer: BiFunction<T,T,T>) : T;

    /**
     * Reverses the order of the items. Note that the items
     * need to be saved temporarily.
     * ```javascript
     * stream([1,2,3]).reverse() // => Stream[3,2,1]
     * ```
     * @return A stream with the items in reversed order.
     */
    reverse() : Stream<T>;

    /**
     * Counts the items.
     * ```javascript
     * stream([1,2,3]).count() // => 3
     * ```
     * @return The number of items in this stream.
     */
    size() : number;

    /**
     * Discards the given number of items from this stream.
     * ```javascript
     * stream([1,2,3,4,5,6]).skip(3) // => Stream[4,5,6] 
     * ```
     * @return An iterable with the given number of items skipped.
     * @see {@link limit}
     */
    skip(toSkip: number) : Stream<T>;

    /**
     * Slices the items into chunks of sliceSize.
     * ```javascript
     * stream([1,2,3,4,5]).slice(2) // => Stream[ [1,2], [3,4], [5] ]
     * ```
     * @param sliceSize Size of the produced chunks.
     * @return A stream over the sliced items.
     */
    slice(sliceSize: number) : Stream<T[]>;
    some(predicate: Predicate<T>) : boolean;
    sort(comparator?: Comparator<T>) : Stream<T>;
    sum(converter?: Function<T, number>) : number;
    /**
     * ```javascript
     * stream(["1","7","7a"])
     *   .try(JSON.parse)
     *   .map(x => x.fold(v => "success", e => "error"))
     *   .flatMap(x => x.stream())
     *   .toArray();
     * // => ["success", "success", "error"]
     * ```
     */
    try<S>(mapper: Function<T,S>) : Stream<Try<S>>;
    toArray() : T[];
    toSet() : Set<any>;
    toMap<K,V>(keyMapper: Function<any,K>, valueMapper: Function<any,V>) : Map<K,V>;
    unique(keyExtractor?: Function<T,any>) : Stream<T>;
    visit(consumer: Consumer<T>) : Stream<T>;
    zip<S>(other: Iterable<S>) : Stream<[T, S]>;
    zipSame(...others: Iterable<T>[]) : Stream<T[]>;
};