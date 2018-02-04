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
 * A predicate assign a boolean value to a pair of objects.
 * @typeparam T Type of the first object. 
 * @typeparam S Type of the second object. 
 */
export interface BiPredicate<T,S> {
    (arg1 : T, arg2: S) : boolean;
};

/**
 * A consumer that takes two value and outputs nothing.
 * @typeparam S Type of the first consumed value. 
 * @typeparam T Type of the second consumed value. 
 */
export interface BiConsumer<S,T> {
    (arg1: S, arg2: T) : void;
};

/**
 * A collector takes all items of a stream and incorporates them
 * into a single object. It does this by first creating an intermediate
 * container (eg. a Set), then processing all items (eg. adding them
 * to the Set), and finally converting the intermediate value to the
 * resulting value (eg. the size of the set).
 */
export interface Collector<S,T,R=T> {
    /**
     * Incorporates each item into the intermediate container.
     */
    accumulator: BiConsumer<T,S>;
    /**
     * Creates a new intermediate container.
     */
    supplier: Supplier<T>;
    /**
     * Transform the intermediate container into the final result.
     */
    finisher: Function<T,R>;
};

/**
 * A factory for producing a {@link Try} representing
 * the result of some operation that may errror.
 */
export interface ITryFactory {
    /**
     * Creates a {@link Try} from a successfully produced value.
     * ```javascript
     * TryFactory.success("foobar").orThrow() // => "foobar"
     * ```
     * @typeparam T Type of the value produced by the operation on success.
     * @param value The successful result of some operation.
     * @return A {@link Try} representing the sucessful operation.
     */
    success<T>(value: T) : Try<T>;

    /**
     * Creates a {@link Try} from a erronous operation.
     * ```javascript
     * TryFactory.error("foobar").orThrow() // => throws Error("foobar")
     * ```
     * @typeparam T Type of the value produced by the operation on success.
     * @param value The error of some erronous operation.
     * @return A {@link Try} representing the erronous operation.
     */
    error<T>(error: Error|String, cause?: Error) : Try<T>;

    /**
     * Creates a {@link Try} from an operation that may succeed or fail to
     * return a value.
     * ```javascript
     *  // returns JSON object or throws if input is not valid JSON string
     * TryFactory.of(() => JSON.parse(input)).orThrow()
     * ```
     * @typeparam T Type of the value produced by the operation on success.
     * @param operation An operation that produces a value, but may fail to do so by throwing an error.
     * @return A {@link Try} representing the result of the operation.
     */
    of<T>(operation: Supplier<T>, cause?: Error) : Try<T>;

    /**
     * Creates a {@link Try} from an operation that may succeed or fail
     * to produce a {@link Try}.
     * @typeparam T Type of the success value of the produced {@link Try}.
     * @param operation Am operation that produces a {@link Try}, but may fail to do so by throwing an error.
     * @return The produced {@link Try} or a {@link Try} representing the error.
     */
    flatOf<T>(operation: Supplier<Try<T>>, cause?: Error) : Try<T>;
};

export interface StreamFactory {
    stream<T>(iterable: Iterable<T>) : Stream<T>;

    /**
     * Creates a stream with the items provided by the given generator.
     * ```javascript
     * generate(index => index)
     * // => Stream[0,1,2,3,4,...]
     * ```
     * @typeparam T Type of the items of the produced stream.
     * @param generator Generator for generating the items of the iterable. It is passed the current index as its argument.
     * @param amount How many items to generate, `Infinity` for an unlimited amount.
     * @return Stream for iterating the given amount of times over the items supplied by the supplier.
     */
    generate<T>(generator: Function<number, T>, amount?: number) : Stream<T>;

    /**
     * Creates a stream starting with the initial seed.
     * ```javascript
     * iterate(42, x => (0x19660D * x + 0x3C6EF35F) % 0x100000000)
     * // Random number generator, linear congruential generator from "Numerical Recipes".
     * ```
     * @typeparam T Type of the items of the produced stream.
     * @param seed Initial item.
     * @param next Function that takes the current item and produces the next item in the sequence.
     * @param amount How many times to iterate, `Infinity` for an unlimited amount.
     * @return Stream for iterating over the provided items the given amount of times.
     */
    iterate<T>(seed: T, next: Function<T,T>, amount?: number) : Stream<T>;

    /**
     * Creates an stream with the given item occuring the given
     * number of times.
     * ```javascript
     * repeat(0, 9)
     * // => Stream[0,0,0,0,0,0,0,0,0]
     * ```
     * @typeparam T Type of the items of the produced iterable.
     * @param item Item to repeat.
     * @param amount How many times to repeat, `Infinity` for an unlimited amount.
     * @return Stream contains the given item the given number of times.
     */
    repeat<T>(item: T, amount?: number) : Stream<T>;

    /**
     * Creates an stream with numbers starting at the given
     * value and ending at the given value.
     * ```javascript
     * times(3) // => Stream[0,1,2]
     * times(3, 4) // => Stream[4,5,6]
     * times(3, 4, 8) // => Stream[4,6,8]
     * times(1, 10, 12) // => Stream[10]
     * times(0) // => Stream[]
     * times(3, 0, Infinity) // => Stream[NaN, NaN, NaN]
     * times(3, 0, -2) // => Stream[0, -1, -2]
     * times(-3) // => Stream[]
     * times(Infinity) // => Stream[0,1,2,3,4,5,...]
     * ```
     * @typeparam T Type of the items of the produced iterable.
     * @param amount Number of items to produce. Must not be negative.
     * @param start Initial number, defaults to 0.
     * @param end Last number, defaults to `start+amount-1`. May be smaller than end, in which case numbers of decreasing value are generated.
     * @return Stream with the configured numbers.
     */
    times(amount: number, start?: number, end?: number) : Stream<number>;

    /**
     * Creates an stream for iterating over an object's key-value-pairs.
     * Only the object's own property are included.
     * ```javascript
     * fromObject({foo:2, bar: 3})
     * // => Stream[ ["foo", 2], ["bar", 3] ]
     * ```
     * @typeparam T Type of the object's values.
     * @param object The object with the key-value-pairs to be iterated.
     * @return A stream with the object's key-value-pairs.
     */
    fromObject<T>(object: {[s: string] : T}) : Stream<[string,T]>;

    /**
     * Creates a stream for iterating over an object's keys.
     * Only the object's own property are included.
     * ```javascript
     * fromObjectKeys({foo:2, bar: 3, 42: 9})
     * // => Stream["foo", "bar", "42"]
     * ```
     * @param object The object with the keys to be iterated.
     * @return A stream with the object's keys.
     */
    fromObjectKeys(object: {[s: string] : any}) : Stream<string>;

    /**
     * Creates a stream for iterating over an object's values.
     * Only the object's own property are included.
     * ```javascript
     * fromObjectValues({foo:2, bar: 3})
     * // => Stream[2,3]
     * ```
     * @typeparam T Type of the object's values.
     * @param object The object with the values to be iterated.
     * @return A stream with the object's values.
     */
    fromObjectValues<T>(object: {[s: string] : T}) : Stream<T>;
};

/**
 * A try represents the result of an operation, that may
 * have succeeded or failed, and contains several methods
 * for handling success and error cases.
 * ```javascript
 * const t = T.of(() => JSON.parse(input)) // => Try[success=true/false]
 * t.orElse({}); // => The parsed JSON object or an empty object.
 * ```
 * Several methods such as {@link Try.map} take an abitrary callback
 * for manipulating the success or error value. If these methods throw
 * an error, the returned {@link Try} is not successful and contains an
 * error with the stacktrace of the original error added.
 * ```javascript
 * const t = T.of(() => JSON.parse(input))
 * t.mapError(() => {throw new Error("Bad handler")})
 * ``` 
 * @typeparam T Type of the encapsulated success value.
 */
export interface Try<T> {
    /**
     * Whether this {@link Try} represents a successful or failed
     * operation.
     */
    readonly success : boolean;
    
    /**
     * If operation was succesful and the value matches the
     * predicate, returns a {@link Try} with that value, otherwise
     * a {@link Try} with a `No such element` error.
     * @param predicate Test to perform on the success value.
     * @return A {@link Try} with the current success value iff it exists and matches the predicate.
     */
    include(predicate: Predicate<T>) : Try<T>;

    /**
     * Computes a new value by using either the success handler,
     * or the backup handler. If a handler throws, the returned {@link Try}
     * is not successful. If the backup handler is not given and this try
     * is unsuccessful, return a try with the same error.
     * ```javascript
     * TryFactor.success(9).convert(x => x * 2);
     * // => 18

     * TryFactor.error("bad").convert(x => x * x, e => e.message.length);
     * // => 3
     * ```
     * @typeparam S Type of the new value.
     * @param success Handler that maps the successful value to a new value.
     * @param backup Handler that maps the error to a new value.
     * @return The new value, wrapped in a {@link Try} for encapsulating errors.
     */
    convert<S>(success: Function<T,S>, backup?: Function<Error,S>) : Try<S>;
    
    /**
     * Computes a new value by using either the success handler,
     * or the backup handler. If a handler throws, the returned {@link Try}
     * is not successful. If the backup handler is not given and this try
     * is unsuccessful, return a try with the same error.
     * Similar to {@link #convert}, but the handlers return a {@link Try}
     *  directly.
     * ```javascript
     * TryFactor.success("9").convert(x => Try.of(() => JSON.parse(x)));
     * // => Try[value=9]
     * ```
     * @typeparam S Type of the new value.
     * @param success Handler that maps the successful value to a new value.
     * @param backup Handler that maps the error to a new value.
     * @return The new value, wrapped in a {@link Try} for encapsulating errors.
     */
    flatConvert<S>(operation: Function<T, Try<S>>, backup?: Function<Error,Try<S>>) : Try<S>;

    /**
     * Returns the successful value or the backup value in case 
     * this try represents an error.
     * ```javascript
     * TryFactory.error("bad").erElse(0) // => 0
     * ```
     * @param backup The default value in case of an errror.
     * @return The successful value; or the default value.
     */
    orElse(backup: T) : T;
    
    /**
     * If not successful, attempts to compute a value from the error
     * with the given backup handler.
     * ```javascript
     * parseIntSafe = string => {
     *   if (isInt(string)) return parseInt(string);
     *   throw new Error("invalid number format")
     * }
     * 
     * T.of(() => parseIntSafe(input))
     *   .orTry(e => parseIntSafe(e.statusCode))
     * 
     * // => input, status code, or error
     * ```
     * @param backup Backup handler that computes a new value for the error.
     * @return A {@link Try} with the current successful value, the new computed backup value, or an error in case the backup handler threw an error.
     */
    orTry(backup: Function<Error,T>) : Try<T>;

    /**
     * If not successful, attempts to compute a value from the error
     * with the given backup handler. Similar to {@link orTry}, but
     * the backup handler returns a {@link Try} directly.
     * ```javascript
     * parseIntSafe = string => {
     *   if (isInt(string)) return parseInt(string);
     *   throw new Error("invalid number format")
     * }
     * 
     * T.of(() => parseIntSafe(input))
     *   .orTryFlat(e => Try.of(() => parseIntSafe(e.statusCode)))
     * 
     * // => input, status code, or error
     * ```
     * @param backup Backup handler that computes a new value for the error.
     * @return A {@link Try} with the current successful value, the new computed backup value, or an error in case the backup handler threw an error.
     */
    orFlatTry(backup: Function<Error, Try<T>>): Try<T>;

    /**
     * On success, returns the value; otherwise throws the error.
     * ```javascript
     * TryFactory.success(9).orThrow()
     * // => 9
     * 
     * TryFactory.error(new Error()).orThrow()
     * // => throws
     * ```
     * @return The successful value.
     */
    orThrow() : T;

    /**
     * Calls the success handler with the successful value,
     * or the error handler with the error.
     * ```javascript
     * TryFactory.success(9).ifPresent(console.info, console.warn)
     * // informs about 9
     * 
     * TryFactory.error(new Error).ifPresent(console.info, console.warn)
     * // warns about error
     * ```
     * @return This {@link Try}.
     */
    ifPresent(success: Consumer<T>, error?: Consumer<Error>) : this;

    /**
     * Calls the error handler iff this try is not successful,
     * or does nothing otherwise.
     * ```javascript
     * TryFactory.success(9).ifAbsent(console.log)
     * // prints nothing
     * 
     * TryFactory.error(new Error).ifAbsent(console.info)
     * // Informs about error
     * ```
     * @return This {@link Try.}.
     */
    ifAbsent(consumer: Consumer<Error>) : this;

    /**
     * Creates an iterable from either the successful value or the error.
     * ```javascript
     * TryFactory.of(() => parseIntSafe("2.5")).stream().filter(x => x instanceof Error).first()
     * // Error("invalid integer format")
     * ```
     * @return A stream of either the successful value or the error.
     */
    stream(factory?: StreamFactory) : Stream<T|Error>;
    
    /**
     * Creates an iterable from either the successful value or the error.
     * @return An iterable over either the successful value or the error.
     */
    iterate() : Iterable<T|Error>;

    /**
     * Similar to {@link #convert}, but works like a `thenable`-object.
     * The handlers are allowed to return either the new value directly,
     * or a {@link Try} with the new value.
     * ```javascript
     * TryFactory.of(...).then(x => JSON.parse(x))
     * 
     * TryFactory.of(...).then(x => Try.of(() => JSON.parse(x)))
     * ```
     * @typeparam S Type of the new value.
     * @param success Handler that maps the successful value to a new value.
     * @param backup Handler that maps the error to a new value.
     * @return The new value, wrapped in a {@link Try} for encapsulating errors.
     */
    then<S>(success: Function<T, S|Try<S>>, error: Function<Error, S|Try<S>>) : Try<S>;

    /**
     * Similar to {@link #orTry}, but works like a `thenable`-object.
     * The handler is allowed to return either the new value directly,
     * or a {@link Try} with the new value.
     * ```javascript
     * TryFactory.error("bad").catch(e => 0)
     * 
     * TryFactory.error("bad").catch(e => Try.success(0))
     * ```
     * @typeparam S Type of the new value.
     * @param backup Handler that maps the error to a new value.
     * @return The new value, wrapped in a {@link Try} for encapsulating errors.
     */
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
 * non-terminal methods such as {@link Stream.map}
 * or {@link Stream.filter}:
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
    concat(...iterables: Iterable<T>[]) : this;

    /**
     * Cycles over the elements of the iterable the given number of times.
     * ```javascript
     * stream([1,2,3]).cycle(3) // => Stream[1,2,3,1,2,3,1,2,3]
     * stream([1,2,3]).cycle().limit(5) // => Stream[1,2,3,1,2]
     * ```
     * @param count The number of cycle. If not given, cycles an unlimited amount of times.
     * @return A stream with the items of the this stream repeating.
     */
    cycle(count?: number) : this;

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
     * @param predicate Test to be performed on the items. It is passed the current item and the current index.
     * @return The item iff found, `undefined` otherwise.
     */
    find(predicate: BiPredicate<T, number>) : T|undefined;

    /**
     * Searches for the first occurence of an item matching the predicate,
     * and returns the index, or `-1` otherwise.
     * ```javascript
     * stream(["foo1", "bar, "foo2").find(x => x.startsWith("foo")) // => 0
     * ```
     * @param predicate Test to be performed on the items. It is passed the current item and the current index.
     * @return The index iff the item was found, `-1` otherwise.
     */
    findIndex(predicate: BiPredicate<T, number>) : number;

    /**
     * Returns the first item.
     * ```javascript
     * first("foo") // => "f"
     * first("") // => undefined
     * ```
     * @return The item at the first position, or undefined if empty.
     */
    first() : T|undefined;

    /**
     * Applies the mapping function to each item and return a stream
     * over all the mapped iterables.
     * This is equivalent to `concat(map(mapper))``.
     * ```javascript
     * stream(["foo","bar"]).flatMap(x => x)
     * // => Stream["f", "o", "o", "b", "a", "r"]
     * 
     * stream(["[1]","[2,3]","[4,]"]).try(JSON.parse).flatMap(x=>x.stream())
     * // => Stream[ [1], [2, 3] ]
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
    filter(predicate : Predicate<T>) : this;

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
     * Returns the last item.
     * ```javascript
     * stream("foo").last() // => "o"
     * stream("").last() // => undefined
     * ```
     * @return The item at the last position, or undefined if empty.
     */
    last() : T|undefined;

    /**
     * Limits the stream to at most the given number of elements.
     * ```javascript
     *  stream([1,2,3,4,5,6]).limit(3) // => Stream[1,2,3]
     * ```
     * @param limit The maximum number of items in the resulting iterable.
     * @return A stream with at most the given number of items.
     */
    limit(limitTo: number) : this;

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
     * Returns the items at the n-th position.
     * ```javascript
     * stream("foo").nth(1) // => "f"
     * 
     * stream("foo").nth(3) // => undefined
     * ```
     * @param n The position of the item to get.
     * @return The item at the given position, or undefined if not found.
     */
    nth(n: number) : T|undefined;

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
    reverse() : this;

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
     * @return A stream with the given number of items skipped.
     * @see {@link limit}
     */
    skip(toSkip: number) : this;

    /**
     * Slices the items into chunks of sliceSize.
     * ```javascript
     * stream([1,2,3,4,5]).slice(2) // => Stream[ [1,2], [3,4], [5] ]
     * ```
     * @param sliceSize Size of the produced chunks.
     * @return A stream over the sliced items.
     */
    slice(sliceSize: number) : Stream<T[]>;

    /**
     * Determines whether at least one items matches the given predicate.
     * ```javascript
     * stream("fooz").some(x => x < "j") // => true
     * ```
     * @param predicate Test to be performed on the items.
     * @return Whether some (at least one) item matches the given predicate. 
     */
    some(predicate: Predicate<T>) : boolean;

    /**
     * Sorts the items. Consider converting the stream to an array and sorting
     * this array if you do not need a stream for further operations. 
     * ```javascript
     * stream(["foobar", "a", "bar").sor(Comparators.byField("length")]
     * // => Stream["a", "bar", "foobar"]
     * ```
     * @param comparator How to sort the items. Default to the natural order, ie. by using `&lt;` and `&gt;`.
     * @return A stream with the items in sorted order.
     */
    sort(comparator?: Comparator<T>) : this;

    /**
     * Sums all items arithmetically.
     * ```javascript
     * stream([1,2,3]).sum() // => 6
     * stream(["I", "of", "Borg"]).sum(x => x.length) // => 7
     * ```
     * @param converted Converts an item into a number. Defaults to `Number(...)`.
     * @return The sum of the items.
     */
    sum(converter?: Function<T, number>) : number;

    /**
     * Maps each item to the result of the given operation,
     * wrapped in a {@link Try} for error handling.
     * ```javascript
     * stream(["1","7","7a"])
     *   .try(SON.parse)
     *   .discardError(console.error)
     *   .toArray();
     * // => ["success", "success", "error"]
     * ```
     * @typeparam S Type of the result of the operation.
     * @param operation Takes each item and returns a mapped value, or throws an `Error`.
     * @return A stream with the mapped values and additional methods for handling errors.
     */
    try<S>(operation: Function<T,S>) : TryStream<S>;

    /**
     * Passes this stream to the the operation and returns its result,
     * wrapped in a {@link Try} in case the operation throws an error.
     * Usually used for performing a terminal operation with error handling
     * on the stream.
     * ```javascript
     * stream([1,2,3]).tryCompute(s => s.sum(item => {throw new Error()}))
     * // => Try[success=false]
     * ```
     * @typeparam S Type of the value produced by the operation.
     * @param operation Takes this stream and returns value. If it throws an error, the resulting {@link Try} is not successful.
     * @return The result of the operation, wrapped in a {@link Try} for encapsulating thrown errors.
     */
    tryCompute<S>(operation: Function<Stream<T>, S>) : Try<S>;

    /**
     * Same as {@link #end}, but encapsulates any errors thrown. Applies
     * all pending operation to the pipeline.
     * ```javascript
     * // prints 1,2,3
     * stream([1,2,3]).visit(console.log).tryEnd()
     * ```
     * @return The encapsulated error, if any was thrown.
     */
    tryEnd() : Try<void>;

    /**
     * Creates an array with the items of this stream.
     * ```javascript
     * stream("foobar").toArray()
     * // => ["f", "o", "o", "b", "a", "r"]
     * ```
     * @return An array with the items.
     */
    toArray() : T[];
    
    /**
     * Creates a set with the items of this stream.
     * ```javascript
     * stream("foobar").toSet()
     * // => Set["f", "o", "b", "a", "r"]
     * ```
     * @return A set with the items.
     */
    toSet() : Set<any>;

    /**
     * Creates a map from the items of this stream.
     * ```javascript
     * stream(["foo", "bar"]).toMap(x => x, x => x.length)
     * // => Map[ "foo" => 3, "bar" => 3 ]
     * ```
     * @typeparam K Type of the map's keys.
     * @typeparam V Type of the map's values.
     * @param keyMapper Transforms an item into the map key to be used.
     * @param valueMapper Transforms an item into the value used for the corresponding key.
     * @return A map with all the mapped key-value-pairs of the items.
     */
    toMap<K,V>(keyMapper: Function<any,K>, valueMapper: Function<any,V>) : Map<K,V>;

    /**
     * Similar to {@link #distinct}, but allows for a custom key to
     * be specified, according to which uniqueness is determined.
     * ```javascript
     * stream([4,1,3,4,1,3,1,9]).distinct()
     * // => Stream[4,1,3,9]
     * 
     * stream({id:4},{id:2},{id:4]}, customer => customer.id).distinct()
     * // => Stream[ {id:4}, {id:2} ]
     * ```
     * @param keyExtractor Returns a key for each item. Items with duplicate keys are removed. Defaults to taking the item itself as the key.
     * @return A stream with all duplicates removed.
     */
    unique(keyExtractor?: Function<T,any>) : this;

    /**
     * Calls the given consumer once for each item. Note that the consumer is
     * not called before the stream is consumed by some terminal operation.
     * ```javascript
     * stream([1,2,3]).visit(console.log)
     * // => Stream[1,2,3]
     * // prints `1,2,3` once the stream is consumed.
     * ```
     * @param consumer Callback taking each item.
     * @return A stream with the same items as this stream.
     */
    visit(consumer: Consumer<T>) : this;

    /**
     * Produces a stream over tuples of consisting of an item of the given iterable;
     * and the corresponding item of the other iterable.
     * If one of the iterables is longer, the shorter one is
     * appended with `undefined`.
     * ```javascript
     * stream(["foo", "bar"].zip([3, 4])
     * // => Stream[ ["foo",3], ["bar", 4] ]
     * 
     * stream(["foo", "bar"]).zip([3, 4]).toMap(x=>x[0], x=>x[1])
     * // => Map[ "foo" => 3, "bar" => 4] ]
     * ```
     * @param other Other iterable to be zipped to this stream.
     * @return A stream over all the produced tuples.
     */
    zip<S>(other: Iterable<S>) : Stream<[T, S]>;

    /**
     * Produces a stream over tuples of consisting of an item of this stream and
     * the corresponding items of the other iterables.
     * If any of the iterables has a different length than the others,
     * the shorter ones appended with `undefined` to the length of the longest.
     * ```javascript
     * stream("ab").zipSame(["cd", "ef"])
     * // => Iterable[ ["a","c", "d"], ["b", "d", "f"] ]
     * 
     * stream("abc").zipSame(["d", "ef"])
     * // => Iterable[ ["a","d", "e"], ["b", undefined, "f"], ["c", undefined, undefined] ]
     * 
     * stream("fb").zipSame(["oa","or"]).map(x=>x.map(String).join("")).join("").toArray()
     * // => "foobar"
     * ```
     * @param others Other iterable to be zipped to the given iterable.
     * @return A stream over al the produced tuples.
     */
    zipSame(...others: Iterable<T>[]) : Stream<T[]>;
};

/**
 * Contains several convenience methods for easier error handling
 * with {@link Try}. A try-stream is created by using the {@link Stream.try}
 * method.
 * ```javascript
 * stream(input).try(operation).orElse(0)
 * 
 * // The above is equivalent to the following:
 * 
 * stream(input).map(operation).map(x => x.orElse(0))
 * ```
 * @typeparam T Type of the items in the stream.
 */
export interface TryStream<T> extends Stream<Try<T>> {
    /**
     * Passes all errors to the given handler and removes
     * them from the stream.
     * ```javascript
     * stream(...).try(JSON.parse).discardError().toArray()
     * // => [json1, json2, ...]
     * // prints all errors encountered during parsing
     * ```
     * @param handler For handling the errors. Defaults to `console.error`.
     * @return A stream with all the errors removed.
     */
    discardError(handler?: Consumer<Error>) : Stream<T>;

    /**
     * Passes each successful value or error to the given handler.
     * ```javascript
     * stream(...).try(JSON.parse).forEachResult(
     *   json => { process(...) },
     *   error => console.error(error)
     * )
     * ```
     * @param success Handler that is passed all successful values.
     * @param error Optional handler that is passed all errors. Defaults to `console.error`.
     */
    forEachResult(success: Consumer<T>, error?: Consumer<Error>) : void;

    /**
     * Applies the given test to the successful values and
     * produces an error for those that do not match.
     * ```javascript
     * stream("12a").try(JSON.parse).include(x => x < 2)
     * // => Stream[ Try[value=1], Try[error="does not match"], Try[error="invalid JSON"] ]
     * ```
     * @param predicate Test successful values need to pass for includsion.
     * @return A try-stream with all successful values passing the test.
     */
    include(predicate: Predicate<T>) : this;

    /**
     * Computes a new value from each successful value or error. 
     * If the operation or backup function throws an error, or if
     * no backup is provided, the {@link Try} is not successful. 
     * Similar to {@link #flatConvert}, but the operation and
     * backup handlers return a {@link Try} directly. 
     * ```javascript
     * stream(["\"1\"", "\"1.5\""]).try(JSON.parse).convert(x => Try.of(() => parseIntSafe(x)))
     * // Stream[ Try[value=1], Try[error="not an int" ]
     * ```
     * @typeparam S Type of the new value.
     * @param operation Mapper that converts each succesful values into a {@link Try} of the new value.
     * @param backup Optional mapper that converts each error into a {@link Try} of the new value.
     * @return A try-stream with the converted values, or any thrown errors.
     */
    flatConvert<S>(operation: Function<T, Try<S>>, backup?: Function<Error,Try<S>>) : TryStream<S>;
 
    /**
     * Computes a new value from each successful value or error. 
     * If the operation or backup function throws an error, or if
     * no backup is provided, the {@link Try} is not successful. 
     * ```javascript
     * stream("12a").try(JSON.parse).convert(x => 2*x)
     * // Stream[ Try[value=1], Try[value=2], Try[error="invalidJSON"] ]
     * ```
     * @typeparam S Type of the new value.
     * @param operation Mapper that converts each succesful values into the new one.
     * @param backup Optional mapper that converts each error into the new value.
     * @return A try-stream with the converted values, or any thrown errors.
     */
    convert<S>(operation: Function<T,S>, backup?: Function<Error,S>) : TryStream<S>;
 
    /**
     * Returns a stream with each items being either the successful value 
     * of the {@link Try} or the given backup value.
     * ```javascript
     * stream("12a").try(JSON.parse).orElse(undefined)
     * // Stream[1,2,undefined]
     * ```
     * @param backup A default value for errors.
     * @return A stream with either the successful value or the backup value.
     */
    orElse(backup: T) : Stream<T>;
 
    /**
     * Calls the given error handler for all errors.
     * ```javascript
     * stream("12a").try(JSON.parse).onError(console.warn).end()
     * // => Stream[ Try[value=1], Try[value=2], Try[error="invalid JSON"] ]
     * // Warns about errors once the stream is consumed.
     * ```
     * @param success Handler called with successful values.
     * @param error Handler called with errors. If not present, it is not called.
     * @return This try-stream.
     */
    onError(handler: Consumer<Error>) : this;
 
    /**
     * Calls the given success handler for all successful
     * values and the given error handler, if present, for all errors.
     * ```javascript
     * stream("12a").try(JSON.parse).onSuccess(console.info, console.warn)
     * // => Stream[ Try[value=1], Try[value=2], Try[error="invalid JSON"] ]
     * // Informs about success and warns about errors once the stream is consumed.
     * ```
     * @param success Handler called with successful values.
     * @param error Handler called with errors. If not present, it is not called.
     * @return This try-stream.
     */
    onSuccess(success: Consumer<T>, error?: Consumer<Error>): this;
 
    /**
     * Throws iff any {@link Try} is not successful. Otherwise
     * unwraps all tries and returns a stream with the contained
     * successful values.
     * ```javascript
     * stream("12a").try(JSON.parse).orThrow().toArray()
     * // throws Error("invalid JSON")
     * ```
     * @return A stream with the successful values.
     */
    orThrow() : Stream<T>;
 
    /**
     * Applies the backup handler to each error, producing
     * a value of the same type as the succesful value of this
     * try-stream. If the handler throws, the resulting {@link Try}
     * is not successful.
     * ```javascript
     * stream(["https://...", "https://..."]).try(GetSync).orTry(e => e.status)
     * // Stream[ Try[value="response"], Try[value="Not found"] ]
     * ```
     * @param backup Handler that takes each error and produces a backup value.
     * @return A try-stream with all errornous values replaced with the backup values.
     */
    orTry(backup: Function<Error,T>) : this;
}