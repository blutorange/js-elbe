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

/**
 * Represents various statistics of a set of numbers.
 */
export interface IStatistics {
    /** The arithmetic average of the incorporated items. */
    average: number;
    /** The number of incorporated items. */
    count: number;
    /** The largest of the incorporated items. */
    max: number;
    /** The smallest of the incorporated items. */
    min: number;
    /** The arithmetic sum of the incorporated items. */
    sum: number;
    /** The variance of the incorporated items. This is the uncorrected (not sampled) variance. */
    variance: number;
    /**
     * @return Object with all statistics.
     */
    toJSON(): {average: number, count: number, max: number, min: number, sum: number, variance: number};
}

/**
 * A factory for producing an {@link ITry} representing
 * the result of some operation that may throw an error.
 */
export interface ITryFactory {
    /**
     * Creates a {@link ITry} from a successfully produced value.
     *
     * ```javascript
     * TryFactory.success("foobar").orThrow() // => "foobar"
     * ```
     *
     * @typeparam T Type of the value produced by the operation on success.
     * @param value The successful result of some operation.
     * @return A {@link ITry} representing the sucessful operation.
     */
    success<T>(value: T): ITry<T>;

    /**
     * Creates a {@link ITry} from a erronous operation.
     *
     * ```javascript
     * TryFactory.error("foobar").orThrow() // => throws Error("foobar")
     * ```
     *
     * @typeparam T Type of the value produced by the operation on success.
     * @param value The error of some erronous operation.
     * @return A {@link ITry} representing the erronous operation.
     */
    error<T>(error: Error | string, cause?: Error): ITry<T>;

    /**
     * Creates a {@link ITry} from an operation that may succeed or fail to
     * return a value.
     *
     * ```javascript
     *  // returns JSON object or throws if input is not valid JSON string
     * TryFactory.of(() => JSON.parse(input)).orThrow()
     * ```
     *
     * @typeparam T Type of the value produced by the operation on success.
     * @param operation An operation that produces a value, but may fail to do so by throwing an error.
     * @return A {@link ITry} representing the result of the operation.
     */
    of<T>(operation: Supplier<T>, cause?: Error): ITry<T>;

    /**
     * Creates a {@link ITry} from an operation that may succeed or fail
     * to produce a {@link ITry}.
     * @typeparam T Type of the success value of the produced {@link ITry}.
     * @param operation Am operation that produces a {@link ITry}, but may fail to do so by throwing an error.
     * @return The produced {@link ITry} or a {@link ITry} representing the error.
     */
    flatOf<T>(operation: Supplier<ITry<T>>, cause?: Error): ITry<T>;
}

export interface IStreamFactory {
    /**
     * Creates a stream from the given iterable. The iterable
     * is consumed as part of stream operations. If it is not
     * a repeatable iterable and multiple iterations over it are
     * required, use {@link IStream#fork}. The iterable is queried
     * only on-demand, thus allowing for generators that produce an
     * unlimited number of items.
     *
     * ```javascript
     * const stream1 = factory.stream("foo");
     * // => Stream["f", "o", "o"]
     *
     * const stream2 = factory.stream("[1,2,3]");
     * // => Stream[1, 2, 3]
     *
     * const stream3 = factory.stream(new Set([1,2,3]).values());
     * // => Stream[1, 2, 3]
     *
     * function * generator() {
     *   let i = 0;
     *   while (true) yield ++i;
     * }
     *
     * const stream4 = factory.stream(generator());
     * // => Stream[1, 2, 3, 4, 5, 6, ...]
     * ```
     *
     * @typeparam T Type of the items of the produced stream.
     * @param iterables Source from which the items are taken.
     * @return A stream over the iterables' values.
     */
    stream<T>(iterable: Iterable<T>): IStream<T>;

    /**
     * Creates an empty stream with no items.
     *
     * @typeparam T Type of the items of the produced stream.
     * @return A stream with no items.
     */
    empty<T>(): IStream<T>;

    /**
     * Creates a stream with the items provided by the given generator.
     *
     * ```javascript
     * generate(index => index) // => Stream[0,1,2,3,4,...]
     * generate(index => index, 0) // => Stream[]
     * generate(index => index) // => Stream[0,1,2,3,4,...]
     * generate(index => index, Infinity) // => Stream[0,1,2,3,4,...]
     * generate(index => index, -Infinity) // => Stream[]
     * generate(index => index, NaN) // => Stream[]
     * ```
     *
     * @typeparam T Type of the items of the produced stream.
     * @param generator Generator for generating the items of the iterable. It is passed the current index as its argument.
     * @param amount How many items to generate, `Infinity` for an unlimited amount.
     * @return Stream for iterating the given amount of times over the items supplied by the supplier.
     */
    generate<T>(generator: TypedFunction<number, T>, amount?: number): IStream<T>;

    /**
     * Creates a stream of random numbers. The generated numbers are
     * in the interval `[0,1]`. When the amount of numbers to generate
     * is not specified, an unlimited amount of numbers are generated.
     * Use methods such as {@link IStream#limit} to limit the stream.
     *
     * **Please note that the generated numbers are not cryptographically
     * secure random numbers and must not be used in any context dealing
     * with security.**
     *
     * ```javascript
     * random(3).toArray() // => [3 random numbers]
     *
     * random(-1).toArray() // => []
     *
     * random(Infinity).limit(5) // => [5 random numbers]
     *
     * random(10).first() // => 1 random number
     *
     * ```
     *
     * @param amount How many random numbers to generate. Defaults to `Infinity`.
     * @return A stream with the specified amount of random numbers.
     */
    random(amount?: number): IStream<number>;

    /**
     * Creates a stream starting with the initial seed.
     *
     * ```javascript
     * iterate(42, x => (0x19660D * x + 0x3C6EF35F) % 0x100000000)
     * // Random number generator, linear congruential generator from "Numerical Recipes".
     * iterate(2, x => 2*x, 3) // => Stream[2,4,8]
     * iterate(2, x => 2*x, 0) // => Stream[]
     * iterate(2, x => 2*x, Infinity) // => Stream[2,4,8,16,...]
     * iterate(2, x => 2*x, -Infinity) // => Stream[]
     * iterate(2, x => 2*x, NaN) // => Stream[]
     * ```
     *
     * @typeparam T Type of the items of the produced stream.
     * @param seed Initial item.
     * @param next Function that takes the current item and produces the next item in the sequence.
     * @param amount How many times to iterate, `Infinity` for an unlimited amount.
     * @return Stream for iterating over the provided items the given amount of times.
     */
    iterate<T>(seed: T, next: TypedFunction<T, T>, amount?: number): IStream<T>;

    /**
     * Creates an stream with the given item occuring the given
     * number of times.
     *
     * ```javascript
     * repeat(0, 9)
     * // => Stream[0,0,0,0,0,0,0,0,0]
     *
     * repeat(0, 0) // => Stream[]
     * repeat(0, -Infinity) // => Stream[]
     * repeat(0, Infinity) // => Stream[0,0,0,...]
     * repeat(0, NaN) // => Stream[]
     * ```
     *
     * @typeparam T Type of the items of the produced stream.
     * @param item Item to repeat.
     * @param amount How many times to repeat, `Infinity` for an unlimited amount.
     * @return Stream contains the given item the given number of times.
     */
    repeat<T>(item: T, amount?: number): IStream<T>;

    /**
     * Creates a stream with numbers starting at the given
     * value and separated from each other by the given step.
     *
     * ```javascript
     * times(3) // => Stream(0,1,2)
     * times(3, 4) // => Stream(4, 5, 6)
     * times(3, 4, 8) // => Stream(4, 12, 20)
     * times(-3) // => Stream()
     * times(3, -4) // => Stream(-4, -3, -2)
     * times(3, 4, -2) // => Stream(4, 2, 0)
     * times(3, -4, -2) // => Stream(-4, -6, -8)
     * times(Infinity) // => Stream(0, 1, 2, 3, ...)
     * times(-Infinity) // => Stream()
     * times(Infinity, 5) // => Stream(5, 6, 7, 8, ...)
     * times(Infinity, 5, 2) // => Stream(5, 7, 9, 11, ...)
     * times(3, Infinity) // => Stream(Infinity, Infinity, Infinity)
     * times(4, 0, Infinity) // => Stream(0, Infinity, Infinity, Infinity)
     * times(4, Infinity, Infinity) // => Stream(Infinity, Infinity, Infinity, Infinity)
     * times(4, -Infinity, Infinity) // => Stream(-Infinity, NaN, NaN, NaN)
     * times(Infinity, 2, Infinity) // => Stream(2, Infinity, Infinity, Infinity, ...)
     * times(Infinity, Infinity, 2) // => Stream(Infinity, Infinity, Infinity, Infinity, ...)
     * times(Infinity, -Infinity, 2) // => Stream(-Infinity, -Infinity, -Infinity, -Infinity, ...)
     * times(Infinity, Infinity, Infinity) // => Stream(Infinity, Infinity, Infinity, Infinity, ...)
     * times(NaN) // => Stream()
     * times(5, NaN) // => Stream(NaN, NaN, NaN, NaN, NaN)
     * times(5, 1, NaN) // => Stream(1, NaN, NaN, NaN, NaN)
     * times(5, Infinity, NaN) // => Stream(Infinity, NaN, NaN, NaN, NaN)
     * times(5, -Infinity, NaN) // => Stream(-Infinity, NaN, NaN, NaN, NaN)
     * times(5, NaN, 2) // => Stream(NaN, NaN, NaN, NaN, NaN)
     * times(5, NaN, NaN) // => Stream(NaN, NaN, NaN, NaN, NaN)
     * times(NaN, NaN, NaN) // => Stream()
     * ```
     *
     * @param amount Number of items to produce. Must not be negative.
     * @param start Initial number, defaults to 0.
     * @param step How far apart the individual items are, defaults to 1.
     * @return Stream with the configured numbers.
     */
    step(amount: number, start?: number, step?: number): IStream<number>;

    /**
     * Creates an stream with numbers starting at the given
     * value and ending at the given value.
     *
     * ```javascript
     * times(3) // => Stream[0, 1, 2]
     * times(3, 4) // => Stream[4, 5, 6]
     * times(3, 4, 8) // => Stream[4, 6, 8]
     * times(1, 10, 12) // => Stream[10]
     * times(0) // => Stream[]
     * times(3, 0, -2) // => Stream[0, -1, -2]
     * times(-3) // => Stream[]
     * times(5, 0, Infinity) // => Stream(0, NaN, NaN, NaN, Infinity)
     * times(5, Infinity, 0) // => Stream(Infinity, NaN, NaN, NaN, 0)
     * times(Infinity) // => Stream(0, 0, 0, 0, ...)
     * times(Infinity, 2, 3) // => Stream(2, 2, 2, 2, ...)
     * times(NaN) // => Stream()
     * times(5, NaN) // => Stream(NaN, NaN, NaN, NaN, NaN)
     * times(5, 2, NaN) // => Stream(2, NaN, NaN, NaN, NaN)
     * times(5, NaN, 7) // => Stream(NaN, NaN, NaN, NaN, 7)
     * times(NaN, 0, 5) // => Stream()
     * times(NaN, NaN, NaN) // => Stream()
     * ```
     *
     * @typeparam T Type of the items of the produced stream.
     * @param amount Number of items to produce. Must not be negative.
     * @param start Initial number, defaults to 0.
     * @param end Last number, defaults to `start+amount-1`. May be smaller than end, in which case numbers of decreasing value are generated.
     * @return Stream with the configured numbers.
     */
    times(amount: number, start?: number, end?: number): IStream<number>;

    /**
     * Creates an stream for iterating over an object's key-value-pairs.
     * Only the object's own property are included.
     *
     * ```javascript
     * fromObject({foo:2, bar: 3})
     * // => Stream[ {key: "foo", value: 2}, {key: "bar", value: 3} ]
     * ```
     *
     * @typeparam T Type of the object's values.
     * @param object The object with the key-value-pairs to be iterated.
     * @return A stream with the object's key-value-pairs.
     */
    fromObject<T>(object: { [s: string]: T }): IStream<{key: string, value: T}>;

    /**
     * Creates a stream for iterating over an object's keys.
     * Only the object's own property are included.
     *
     * ```javascript
     * fromObjectKeys({foo:2, bar: 3, 42: 9})
     * // => Stream["foo", "bar", "42"]
     * ```
     *
     * @param object The object with the keys to be iterated.
     * @return A stream with the object's keys.
     */
    fromObjectKeys(object: { [s: string]: any }): IStream<string>;

    /**
     * Creates a stream for iterating over an object's values.
     * Only the object's own property are included.
     *
     * ```javascript
     * fromObjectValues({foo:2, bar: 3})
     * // => Stream[2,3]
     * ```
     *
     * @typeparam T Type of the object's values.
     * @param object The object with the values to be iterated.
     * @return A stream with the object's values.
     */
    fromObjectValues<T>(object: { [s: string]: T }): IStream<T>;
}

/**
 * A try represents the result of an operation, that may
 * have succeeded or failed, and contains several methods
 * for handling success and error cases.
 *
 * ```javascript
 * const t = T.of(() => JSON.parse(input)) // => Try[success=true/false]
 * t.orElse({}); // => The parsed JSON object or an empty object.
 * ```
 *
 * Several methods such as {@link ITry.map} take an abitrary callback
 * for manipulating the success or error value. If these methods throw
 * an error, the returned {@link ITry} is not successful and contains an
 * error with the stacktrace of the original error added.
 *
 * ```javascript
 * const t = T.of(() => JSON.parse(input))
 * t.mapError(() => {throw new Error("Bad handler")})
 * ```
 *
 * @typeparam T Type of the encapsulated success value.
 */
export interface ITry<T> {
    /**
     * Whether this {@link ITry} represents a successful or failed
     * operation.
     */
    readonly success: boolean;

    /**
     * If operation was succesful and the value matches the
     * predicate, returns a {@link ITry} with that value, otherwise
     * a {@link ITry} with a `No such element` error.
     * @param predicate Test to perform on the success value.
     * @return A {@link ITry} with the current success value iff it exists and matches the predicate.
     */
    include(predicate: Predicate<T>): ITry<T>;

    /**
     * Computes a new value by using either the success handler,
     * or the backup handler. If the mapper throws, the backup is
     * applied. If the backup throws as well, the returned {@link ITry}
     * is not successful. If the backup handler is not given and this try
     * is unsuccessful, return a try with the same error.
     *
     * ```javascript
     * TryFactor.success(9).convert(x => x * 2);
     * // => 18
     *
     * TryFactor.error("bad").convert(x => x * x, e => e.message.length);
     * // => 3
     * ```
     *
     * @typeparam S Type of the new value.
     * @param mapper Handler that maps the successful value to a new value.
     * @param backup Handler that maps the error to a new value.
     * @return The new value, wrapped in a {@link ITry} for encapsulating errors.
     */
    convert<S>(mapper: TypedFunction<T, S>, backup?: TypedFunction<Error, S>): ITry<S>;

    /**
     * Computes a new value by using either the success handler,
     * or the backup handler. If the mapper throws, the backup is
     * applied. If the backup throws as well, the returned Try
     * is not successful. If the backup handler is not given and this
     * try is unsuccessful, return a try with the same error. Similar
     * to #convert, but the handlers return a Try directly.
     *
     * ```javascript
     * TryFactor.success("9").convert(x => Try.of(() => JSON.parse(x)));
     * // => Try[value=9]
     * ```
     *
     * @typeparam S Type of the new value.
     * @param success Handler that maps the successful value to a new value.
     * @param backup Handler that maps the error to a new value.
     * @return The new value, wrapped in a {@link ITry} for encapsulating errors.
     */
    flatConvert<S>(operation: TypedFunction<T, ITry<S>>, backup?: TypedFunction<Error, ITry<S>>): ITry<S>;

    /**
     * Returns the successful value or the backup value in case
     * this try represents an error.
     *
     * ```javascript
     * TryFactory.error("bad").erElse(0) // => 0
     * ```
     *
     * @param backup The default value in case of an errror.
     * @return The successful value; or the default value.
     */
    orElse(backup: T): T;

    /**
     * If not successful, attempts to compute a value from the error
     * with the given backup handler.
     *
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
     *
     * @param backup Backup handler that computes a new value for the error.
     * @return A {@link ITry} with the current successful value, the new computed backup value, or an error in case the backup handler threw an error.
     */
    orTry(backup: TypedFunction<Error, T>): ITry<T>;

    /**
     * If not successful, attempts to compute a value from the error
     * with the given backup handler. Similar to {@link orTry}, but
     * the backup handler returns a {@link ITry} directly.
     *
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
     *
     * @param backup Backup handler that computes a new value for the error.
     * @return A {@link ITry} with the current successful value, the new computed backup value, or an error in case the backup handler threw an error.
     */
    orFlatTry(backup: TypedFunction<Error, ITry<T>>): ITry<T>;

    /**
     * On success, returns the value; otherwise throws the error.
     *
     * ```javascript
     * TryFactory.success(9).orThrow()
     * // => 9
     *
     * TryFactory.error(new Error()).orThrow()
     * // => throws
     * ```
     *
     * @return The successful value.
     */
    orThrow(): T;

    /**
     * Calls the success handler with the successful value,
     * or the error handler with the error.
     *
     * ```javascript
     * TryFactory.success(9).ifPresent(console.info, console.warn)
     * // informs about 9
     *
     * TryFactory.error(new Error).ifPresent(console.info, console.warn)
     * // warns about error
     * ```
     *
     * @return This {@link ITry}.
     */
    ifPresent(success: Consumer<T>, error?: Consumer<Error>): this;

    /**
     * Calls the error handler iff this try is not successful,
     * or does nothing otherwise.
     *
     * ```javascript
     * TryFactory.success(9).ifAbsent(console.log)
     * // prints nothing
     *
     * TryFactory.error(new Error).ifAbsent(console.info)
     * // Informs about error
     * ```
     *
     * @return This {@link ITry}..
     */
    ifAbsent(consumer: Consumer<Error>): this;

    /**
     * Creates an stream from either the successful value or the error.
     *
     * ```javascript
     * TryFactory.of(() => parseIntSafe("2.5")).stream().filter(x => x instanceof Error).first()
     * // Error("invalid integer format")
     * ```
     *
     * @return A stream of either the successful value or the error.
     */
    stream(factory?: IStreamFactory): IStream<T | Error>;

    /**
     * Creates an iterable over either the successful value or the error.
     * @return A stream over either the successful value or the error.
     */
    iterate(): Iterable<T | Error>;

   /**
    * Hook for JSON.stringify. Returns a JSON representation
    * of itself, containing its value and whether it represents
    * a success or failure of an operation.
    * @return An object with keys `result` (contained value) and `success` (whether the operation was successful).
    */
    toJSON(): {result: T | string, success: boolean};

    /**
     * Unwraps the try an returns either the contained successful
     * value or the error.
     * @return Either the contained value or the error.
     */
    unwrap(): T | Error;

    /**
     * Similar to [[Try.convert]], but works like a `thenable`-object.
     * The handlers are allowed to return either the new value directly,
     * or a {@link ITry} with the new value.
     *
     * ```javascript
     * TryFactory.of(...).then(x => JSON.parse(x))
     *
     * TryFactory.of(...).then(x => Try.of(() => JSON.parse(x)))
     * ```
     *
     * @typeparam S Type of the new value.
     * @param success Handler that maps the successful value to a new value.
     * @param backup Handler that maps the error to a new value.
     * @return The new value, wrapped in a {@link ITry} for encapsulating errors.
     */
    then<S>(success: TypedFunction<T, S | ITry<S>>, error?: TypedFunction<Error, S | ITry<S>>): ITry<S>;

    /**
     * Similar to {@link #orTry}, but works like a `thenable`-object.
     * The handler is allowed to return either the new value directly,
     * or a {@link ITry} with the new value.
     *
     * ```javascript
     * TryFactory.error("bad").catch(e => 0)
     *
     * TryFactory.error("bad").catch(e => Try.success(0))
     * ```
     *
     * @param backup Handler that maps the error to a new value.
     * @return The new value, wrapped in a {@link ITry} for encapsulating errors.
     */
    catch(mapper: TypedFunction<Error, T | ITry<T>>): ITry<T>;
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
export interface IStream<T> {
    [Symbol.iterator](): Iterator<T>;

    /**
     * Chunks the items into chunks of chunkSize.
     *
     * ```javascript
     * stream([1,2,3,4,5]).chunk(2) // => Stream[ [1,2], [3,4], [5] ]
     * stream([1,2,3,4,5]).chunk(1) // => Stream[ [1], [2], [3], [4], [5] ]
     * stream([1,2,3,4,5]).chunk(0) // => Stream[]
     * stream([1,2,3,4,5]).chunk(NaN) // => Stream[]
     * stream([1,2,3,4,5]).chunk(Infinity) // => Stream[[1,2,3,4,5]]
     * ```
     *
     * @param chunkSize Size of the produced chunks.
     * @return A stream over the chunked items.
     */
    chunk(chunkSize: number): IStream<T[]>;

    /**
     * Chunks together consecutive items for which the classifier
     * returns the same value. Equality is checked with `===`.
     *
     * ```javascript
     * stream([1,2,3,4,5,6,1]).chunkBy(i => i & 10) // => Stream[ [1,2], [3,4], [5,6], [1] ]
     * ```
     *
     * @typeparam K Type of the returned value of the chunker,
     * @param classifier It is passed the item as its first argument and the index as its second. Items are chunked together according to the returned value.
     * @return A stream over the chunked items.
     */
    chunkBy<K = any>(classifier: TypedBiFunction<T, number, K>): IStream<T[]>;

    /**
     * Creates an object and incorporates all items into that object.
     *
     * ```javascript
     * stream([1,2,3]).collect(Collectors.summarize) // => Statistic[min:1, max:3, count: 3, sum: 6, average: 2, variance: 0.67]
     * ```
     *
     * @typeparam S Type of the intermediate object that incorporates each item in order.
     * @typeparam R Type of the final collected value.
     * @param collector How to collect the items.
     * @return The collected value.
     */
    collect<S, R = S>(collector: Collector<T, S, R>): R;

    /**
     * Same as {@link #collect}, but allows specifying the parts of
     * the collector individually.
     *
     * ```javascript
     * stream([1,2,3]).collect(() => [], (array, x) => array.push(x), x => new Set(x)) // => Set[1,2,3]
     * ```
     *
     * @typeparam S Type of the intermediate value that incorporates each item in order.
     * @typeparam R Type of the final collected value.
     * @param suppplier Provides the intermediate object into which the items are incorporated.
     * @param accumulator Takes the intermediate objects as its first argument and the current items as its seconds, and incorporates the item into the intermediate value.
     * @param finisher Takes the intermediate object with all the items incoporated, and transforms it into the final value.
     * @return The final collected value.
     */
    collectWith<S, R = S>(supplier: Supplier<S>, accumulator: BiConsumer<S, T>, finisher: TypedFunction<S, R>): R;

    /**
     * Concatenates all given iterables with this stream into one stream of all the items.
     *
     * ```javascript
     * stream("foo").concat("bar", "baz") // => Stream["f", "o", "o", "b", "a", "r", "b", "a", "z"]
     * ```
     *
     * @param moreIterable Other iteratbles to be concatenated.
     * @return A stream over all the items of this stream and the given iterables.
     */
    concat(...iterables: Iterable<T>[]): this;

    /**
     * Consumes the given amount of items at a given offse from the start of
     * from this stream, and adds thems to the sink. The items at the start
     * of the stream and the remaining items can be read from the returned
     * stream.
     *
     * ```javascript
     * const sink = [];
     * const s = stream("foobar").consume(sink, 0, 3);
     * // => sink is now ["f", "o", "o"]
     * s.join() // => "bar"
     *
     * const sink2 = [];
     * const s2 = stream("foobar").consume(sink, 2, 3);
     * // => sink is now ["o", "b", "a"]
     * s2.join() // => "for"
     *
     * stream("foobar").consume(console.log, 0, 3);
     * // => logs "f", "o", "o"
     *
     * stream("foobar").consume(console.log, 0, -3);
     * // => logs nothing
     * ```
     *
     * @param sink If an array, consmed items are added to the array. Otherwise, the consumer is called with the consumed item.
     * @param maxAmount Maximum number of items to consume. Defaults to `Infinity`.
     * @param offset Where to start consuming items. Defaults to `0`.
     * @return A stream over the remaining items.
     */
    consume(sink: T[] | Consumer<T>, offset?: number, maxAmount?: number): this;

    /**
     * Cycles over the elements of this stream the given number of times.
     *
     * ```javascript
     * stream([1,2,3]).cycle(NaN) // => Stream[]
     * stream([1,2,3]).cycle(0) // => Stream[]
     * stream([1,2,3]).cycle(3) // => Stream[1,2,3,1,2,3,1,2,3]
     * stream([1,2,3]).cycle().limit(5) // => Stream[1,2,3,1,2]
     * ```
     *
     * @param count The number of cycle. If not given, cycles an unlimited amount of times.
     * @return A stream with the items of the this stream repeating.
     */
    cycle(count?: number): this;

    /**
     * Applies all pending operations, ending this stream.
     *
     * ```javascript
     * stream([1,2,3]).visit(console.log) // Stream[1,2,3]; prints nothing
     * stream([1,2,3]).visit(console.log).end() // prints 1,2,3
     * ```
     *
     */
    end(): void;

    /**
     * Determines whether every items matches the given predicate.
     *
     * ```javascript
     * stream("fooz").every(x => x < "j") // => false
     * ```
     *
     * @param predicate Test to be performed on the items.
     * @return Whether every items matches the given predicate.
     */
    every(predicate: Predicate<T>): boolean;

    /**
     * Searches for the first occurence of an item matching the predicate.
     *
     * ```javascript
     * stream(["foo1", "bar,"foo2").find(x => x.startsWith("foo")) // => "foo1"
     * ```
     *
     * @param predicate Test to be performed on the items. It is passed the current item and the current index.
     * @return The item iff found, `undefined` otherwise.
     */
    find(predicate: BiPredicate<T, number>): Maybe<T>;

    /**
     * Searches for the first occurence of an item matching the predicate,
     * and returns the index, or `-1` otherwise.
     *
     * ```javascript
     * stream(["foo1", "bar, "foo2").find(x => x.startsWith("foo")) // => 0
     * ```
     *
     * @param predicate Test to be performed on the items. It is passed the current item and the current index.
     * @return The index iff the item was found, `-1` otherwise.
     */
    findIndex(predicate: BiPredicate<T, number>): number;

    /**
     * Returns the first item and closes the stream. It cannot be read anymore.
     *
     * ```javascript
     * stream("foo").first() // => "f"
     * stream("").first() // => undefined
     *
     * const s = stream("foobar");
     * s.first()
     * s.first() // => Error
     * ```
     *
     * @return The item at the first position, or undefined if empty.
     */
    first(): Maybe<T>;

    /**
     * Applies the mapping function to each item and return a stream
     * over all the mapped iterables.
     * This is equivalent to `concat(map(mapper))``.
     *
     * ```javascript
     * stream(["foo","bar"]).flatMap(x => x)
     * // => Stream["f", "o", "o", "b", "a", "r"]
     *
     * stream(["[1]","[2,3]","[4,]"]).try(JSON.parse).flatMap(x=>x.stream())
     * // => Stream[ [1], [2, 3] ]
     * ```
     *
     * @typeparam S Type of the elements in the produced stream.
     * @param mapper Mapping function taking each item and producing a new stream or iterable.
     * @return A stream over all the items of the iterables produced by the mapper.
     */
    flatMap<S>(mapper: TypedFunction<T, Iterable<S>>): IStream<S>;

    /**
     * Removes all elements from this stream for which the
     * predicate does not return `true`.
     *
     * ```javascript
     * stream([4,-4,2,-9]).filter(x => x > 0) // => Stream[4,2]
     * ```
     *
     * @param predicate Testing function returning `true` iff the item is to be kept, `false` otherwise.
     * @return A stream over all item for which the predicate returned `true`.
     */
    filter(predicate: Predicate<T>): this;

    /**
     * Similar to {@link IStream}#filter, but filters out all items not equivalent to
     * the given target. Items are compared to the target by first extracting a key
     * with the given key extractor, and then comparing the keys with the given
     * comparator.
     *
     * ```javascript
     * stream(["foo", "bar", "foobar"]).filterBy(x => x.length)
     * // => Stream["foo", "bar"]
     *
     * const user1 = {name: "Dave", birth: {day: 5, month: 4, year: 2005}}
     * const user2 = {name: "Maria", birth: {day: 9, month: 11, year: 2005}}
     * const user3 = {name: "Odo", birth: {day: 22, month: 7, year: 2004}}
     *
     * stream([user1, user2, user3]).filterBy(2005, user => user.birth, (lhs,rhs) => lhs.year - rhs.year)
     * // => Stream[user1, user2]
     * ```
     *
     * @param target Target for filterting. All items in the stream not equivalent to the target are removed.
     * @param keyExtractor Extracts the key by which equality is determined. Default to identity `x => x`.
     * @param comparator Comparator for comparing two keys. Defaults to the natural comparator using `<` and `>`.
     */
    filterBy<K>(target: K, keyExtractor: TypedFunction<T, K>, comparator?: Comparator<K>): this;

    /**
     * Passes each item of this stream to the given consumer.
     *
     * ```javascript
     * stream([1,2,3]).forEach(console.log); // prints 1,2,3
     * ```
     *
     * @param consumer A callback that receives each item of this stream in order.
     */
    forEach(consumer: Consumer<T>): void;

    /**
     * This returns a stream that leaves the original stream open and iterable.
     * If the underlying iterable is an array, set, map or string etc, it simpy
     * reuses that iterable, otherwise it buffers the items temporarily.
     *
     * ```javascript
     * function * foo() {
     *   return 1;
     *   return 2;
     *   return 3;
     * }
     *
     * const transientStream = stream(foo());
     * transientStream.toArray() // => [1,2,3]
     * transientStream.toArray() // => Error: Stream was consumed already.
     *
     * const persistentStream = stream(foo())
     * persistentStream.fork().toArray() // => [1,2,3]
     * persistentStream.fork().toArray() // => [1,2,3]
     * persistentStream.toArray()        // => [1,2,3]
     * persistentStream.fork()           // => Error: Stream was consumed already.
     * ```
     *
     * Note that buffering takes place on-demand, so the following will not
     * enter an infinite loop:
     *
     * ```javascript
     * // Create a stream with an unlimited amount of items.
     * const stream = TypesafeStreamFactory.repeat(Math.random, Infinity);
     *
     * // Fork the stream first, then limit to a finite number of items.
     * // Items already produced are not recomputed.
     * stream.fork().limit(3).toArray() // => [0.28, 0.14, 0.97]
     * stream.fork().limit(2).toArray() // => [0.28, 0.14]
     * stream.fork().limit(4).toArray() // => [0.28, 0.14, 0.97, 0.31]
     * ```
     *
     * @return A forked stream that leaves the original stream usable.
     */
    fork(): this;

    /**
     * Splits the items into several groups, according to the given
     * classifier.
     *
     * ```javascript
     * stream(["a", "foo", "is", "some", "buzz"]).group(x => x.length) // => Map [ 1 => ["a"], 2 => ["is"], 3 => "is", 4 => ["some", "buzz"] ]
     * ```
     *
     * @typearam K Type of the group key.
     * @param classifier Returns the group for each item.
     * @return A map with the groups as keys and arrays as values, containing all the items for that group.
     */
    group<K = any>(classifier: TypedFunction<T, K>): Map<K, T[]>;

    /**
     * Determines whether thsi stream contains the given item.
     * Equivalence is checked with ```===```. This is
     * equivalent to ```stream(...).some(x => x === object)`.
     *
     * ```javascript
     * stream("foobar").has("o") // => true
     * ```
     *
     * @return Whether the given object is contained in this stream.
     */
    has(object: T): boolean;

    /**
     * Extracts and return at most `maxAmount` items of this stream, starting
     * at the given start position. All items up to the starting point and the
     * remaining items are left in this stream and can still be read from it.
     *
     * ```javascript
     * const s = stream("foobar");
     * s.splice(0, 3); // => ["f", "o", "o"]
     * s.join() // => "bar"
     *
     * const s2 = stream("foobar");
     * s.splice(2,3); // => ["o", "b", "a"]
     * s.join() // => "for"
     *
     * const s = stream("foobar");
     * s.splice(0, 3); // => ["f", "o", "o"]
     * s.join() // => "bar"
     *
     * stream("foo").splice(0, 0) // => []
     * stream("foo").splice(0, NaN) // => []
     * stream("foo").splice(NaN, 2) // => []
     * ```
     *
     * @param maxAmount Maximum number if items to read from this stream. Defaults to `Infinity`.
     * @param offset Position at which to start removing items from the stream. Default to `0`.
     * @return At most `maxAmount` items from the given start position of this stream.
     */
    splice(offset?: number, maxAmount?: number): T[];

    /**
     * Adds the index to each element of this stream. The index starts at 0.
     *
     * ```javascript
     * stream(["foo", "bar"]).index().toMap(({value}) => value, ({index}) => index})
     * // => Map<"foo" => 0, "bar" => 1>
     * ```
     *
     * @return A stream with each item being an array consisting of the item's index and the item itself. The index starts at 0.
     */
    index(): IStream<{index: number, value: T}>;

    /**
     * Joins every time with the given delimiter, optionally prepending a
     * prefix and appending a suffix to the output.
     *
     * ```javascript
     * stream([1,2,3]).join(",", "[", "]") // => "[1,2,3]"
     * ```
     *
     * @param delimiter String inserted between the items. Defaults to the empty string.
     * @param prefix String prepended to the joined string. Defaults to the empty string.
     * @param suffix String appended to the joined string. Defaults to the empty string.
     * @return A string consisting of the prefix, the items joined with the delimiter, and the suffix.
     */
    join(delimiter?: string, prefix?: string, suffix?: string): string;

    /**
     * Returns the last item.
     *
     * ```javascript
     * stream("foo").last() // => "o"
     * stream("").last() // => undefined
     * ```
     *
     * @return The item at the last position, or undefined if empty.
     */
    last(): Maybe<T>;

    /**
     * Limits the stream to at most the given number of elements.
     *
     * ```javascript
     *  stream([1,2,3,4,5,6]).limit(NaN) // => Stream[1,2,3,4,5,6]
     *  stream([1,2,3,4,5,6]).limit(0) // => Stream[1,2,3,4,5,6]
     *  stream([1,2,3,4,5,6]).limit(3) // => Stream[1,2,3]
     * ```
     *
     * @param limit The maximum number of items in the resulting stream. Defaults to Infinity.
     * @return A stream with at most the given number of items.
     */
    limit(limitTo?: number): this;

    /**
     * Transform each element to another element of a possibly different type.
     *
     * ```javascript
     * stream([0,1,2,3]).map(x => 2 * x) // => Stream[0,2,4,6]
     * ```
     *
     * @typeparam S Type of the elements in the produced stream.
     * @param mapper A function taking each item of this stream and transforms it into another item.
     * @return A stream over the mapped elements.
     */
    map<S>(mapper: TypedFunction<T, S>): IStream<S>;

    /**
     * Computes the maxmimum of the items.
     *
     * ```javascript
     * stream([6,2,3,9,4]).max() // => 9
     * stream(["foo", "bar", "I"]).max(Comparators.byField("length")) // => "foo"
     * stream([]).max() // => undefined
     * ```
     *
     * @param comparator How two items are compared. Defaults to the natural order, ie. by using `&lt;` and `&gt;`.
     * @return The largest item. If there are multiple largest items, returns the first. `undefined` iff this stream is empty.
     */
    max(comparator?: Comparator<T>): Maybe<T>;

    /**
     * Computes the maximum of the items, as determined by the given sort key.
     *
     * ```javascript
     * stream(["foo","foobar", "gg"]).maxBy(x => x.length)
     * // => "gg"
     * ```
     *
     * @param sortKey Takes an item and produces the key by which the maximum is determined.
     * @return The smallest item, or `undefined` iff there are no items.
     */
    maxBy<K = any>(sortKey: TypedFunction<T, K>): Maybe<T>;

    /**
     * Computes the minimum of the items.
     *
     * ```javascript
     * stream([3,2,9,4]).min() // => 9
     * stream(["foo", "bar", "I"].min(Comparators.byField("length")) // => "I"
     * stream([]).min() // => undefined
     * ```
     *
     * @param comparator How two items are compared. Defaults to the natural order, ie. by using `&lt;` and `&gt;`.
     * @return The smallest item. If there are multiple smallest items, returns the first.  `undefined` iff this stream is empty.
     */
    min(comparator?: Comparator<T>): Maybe<T>;

    /**
     * Computes the minimum of the items, as determined by the given sort key.
     *
     * ```javascript
     * stream(["foo","foobar", "gg"]).minBy(x => x.length)
     * // => "gg"
     * ```
     *
     * @param sortKey Takes an item and produces the key by which the minimum is determined.
     * @return The smallest item, or `undefined` iff there are no items.
     */
    minBy<K = any>(sortKey: TypedFunction<T, K>): Maybe<T>;

    /**
     * Returns the first item and keeps the stream open. The remaining
     * items can still be read from the stream.
     *
     * ```javascript
     * stream("foo").shift() // => "f"
     * stream("").shift() // => undefined
     *
     * const s = stream("foobar");
     * s.shift() // => "f"
     * s.shift() // => "o"
     * s.shift() // => "o"
     * s.join() // => "bar"
     * ```
     *
     * @return The item at the first position, or undefined if empty.
     */
    shift(): Maybe<T>;

    /**
     * Determines whether no item matches the given predicate. This
     * is equivalent to `!stream.some(predicate)`.
     *
     * ```javascript
     * stream("fooz").none(x => x === "o") // => false
     * ```
     *
     * @param predicate Test to be performed on each item.
     * @return Whether no item matches the given predicate.
     */
    none(predicate: Predicate<T>): boolean;

    /**
     * Returns the items at the n-th position.
     *
     * ```javascript
     * stream("foo").nth(1) // => "f"
     *
     * stream("foo").nth(3) // => undefined
     * ```
     *
     * @param n The position of the item to get.
     * @return The item at the given position, or undefined if not found.
     */
    nth(n: number): Maybe<T>;

    /**
     * Splits the items into two groups according to the given
     * discriminator.
     *
     * ```javascript
     * stream([-3,2,9,-4]).partition(x => x > 0) // => { false: [-3,-4], true: [2,9]}
     * ```
     *
     * @param discriminator Partitions each item into one of two groups by returning `true` of `false`.
     * @return An object containing the partitioned items.
     */
    partition(discriminator: Predicate<T>): { false: T[], true: T[] };

    /**
     * Converts each item to a promise and returns a promise
     * that is resolved with a stream of results when all
     * of the created Promises resolve, or rejected when any
     * Promise is rejected.
     *
     * ```javascript
     * stream([1,2,3])
     *   .promise(id => fetch(`/user/${id}`))
     *   .then(s => s.forEach(renderUser))
     *   .catch(console.error)
     * // Calls the renderUser method with the Response for each user request.
     * ```
     *
     * @typeparam S Type of the item of the promises.
     * @param promiseConverter Takes each item and creates a promise.
     * @return A promise that resolves when all promises resolve; or is rejected when any promise is rejected.
     */
    promise<S>(promiseConverter: TypedFunction<T, Promise<S>>): Promise<IStream<S>>;

    /**
     * Coalesces all items into one value.
     *
     * ```javascript
     * stream([1,2,3]).reduce((sum,x) => sum + x, 10) // => 16
     * ```
     *
     * @typeparam S Type of the reduced value.
     * @param reducer Takes the current reduced value as its first argument and the current item as its second, combines the item with the current reduced value, and returns that value.
     * @param initialValue The initial value of the reduction.
     * @return The reduced value, or the initial value iff this stream is empty.
     */
    reduce<S>(reducer: TypedBiFunction<S, T, S>, initialValue: S): S;

    /**
     * Similar to {@link reduceSame}, but reduces to items of the same type
     * as the items and thus does not require an explicit initial value.
     *
     * ```javascript
     * stream([1,2,3]).reduceSame((sum,x) => sum + x) // => 6
     * ```
     *
     * @param reducer Takes the current reduced value as its first argument and the current item as its second, combines the item with the current reduced value, and returns that value.
     * @return The reduced value, or undefined iff the stream is empty.
     */
    reduceSame(reducer: TypedBiFunction<T, T, T>): Maybe<T>;

    /**
     * Reverses the order of the items.
     *
     * Note that the items need to be saved temporarily, so that this
     * does not work with unlimited streams, as the last item needs to
     * be accesed first.
     *
     * This method might create a new array, but if it does, calling `toArray` on
     * the returned stream will return that array instead of allocating a new array.
     *
     * ```javascript
     * stream([1,2,3]).reverse() // => Stream[3,2,1]
     * stream(factory.step(Infinity)).reverse() // hangs
     * ```
     *
     * @return A stream with the items in reversed order.
     */
    reverse(): this;

    /**
     * Counts the items.
     *
     * ```javascript
     * stream([1,2,3]).count() // => 3
     * ```
     *
     * @return The number of items in this stream.
     */
    size(): number;

    /**
     * Discards the given number of items from this stream.
     *
     * ```javascript
     * stream([1,2,3,4,5,6]).skip(3) // => Stream[4,5,6]
     * ```
     *
     * @param toSkip How many items to skip. Default to `Infinity`.
     * @return A stream with the given number of items skipped.
     * @see {@link limit}
     */
    skip(toSkip?: number): this;

    /**
     * Determines whether at least one items matches the given predicate.
     *
     * ```javascript
     * stream("fooz").some(x => x < "j") // => true
     * ```
     *
     * @param predicate Test to be performed on the items.
     * @return Whether some (at least one) item matches the given predicate.
     */
    some(predicate: Predicate<T>): boolean;

    /**
     * Sorts the items. Consider converting the stream to an array and sorting
     * this array if you do not need a stream for further operations.
     *
     * This method might create a new array, but if it does, calling `toArray` on
     * the returned stream will return that array instead of allocating a new array.
     *
     * ```javascript
     * stream(["foobar", "a", "bar").sor(Comparators.byField("length")]
     * // => Stream["a", "bar", "foobar"]
     * ```
     *
     * @param comparator How to sort the items. Default to the natural order, ie. by using `&lt;` and `&gt;`.
     * @return A stream with the items in sorted order.
     */
    sort(comparator?: Comparator<T>): this;

    /**
     * Similar to {@link IStream}#sort, but sorts items by comparing them according
     * to the given key extractor and comparator. For each item, a key is extracted,
     * two items are then compared by comparing theirs keys with the given comparator.
     *
     * This method might create a new array, but if it does, calling `toArray` on
     * the returned stream will return that array instead of allocating a new array.
     *
     * ```javascript
     * stream(["foo", "foobar", "bar"]).sortBy(x => x.length)
     * // => Stream["foo", "bar", "foobar"]
     *
     * const user1 = {name: "Dave", birth: {day: 5, month: 4, year: 1990}}
     * const user2 = {name: "Maria", birth: {day: 9, month: 11, year: 2005}}
     * const user3 = {name: "Odo", birth: {day: 22, month: 7, year: 2004}}
     *
     * stream([user1, user2, user3]).filterBy(user => user.birth, (lhs,rhs) => lhs.year - rhs.year)
     * // => Stream[user1, user3, user1]
     * ```
     *
     * @param keyExtractor Extracts the key by which the sort order is determined. Default to identity `x => x`.
     * @param comparator Comparator for comparing two keys. Defaults to the natural comparator using `<` and `>`.
     */
    sortBy<K>(keyExtractor: TypedFunction<T, K>, comparator?: Comparator<K>): this;

    /**
     * Sums all items arithmetically. If there are no items
     * in the stream, returns `NaN`.
     *
     * ```javascript
     * stream([]).sum() // => NaN
     * stream([1,2,3]).sum() // => 6
     * stream(["I", "of", "Borg"]).sum(x => x.length) // => 7
     * ```
     *
     * @param converted Converts an item into a number. Defaults to `Number(...)`.
     * @return The sum of the items.
     */
    sum(converter?: TypedFunction<T, number>): number;

    /**
     * Hook for JSON.stringify. Returns the items of this stream
     * as an array. Note that this terminates the stream, any
     * subsequent operations on the stream will fail.
     *
     * ```javascript
     * stream("foo").toJSON()
     * // => ["f", "o", "o"]
     *
     * JSON.stringify(stream("foo"))
     * // => '["f","o","o"]'
     * ```
     */
    toJSON(): T[] ;

    /**
     * Maps each item to the result of the given operation,
     * wrapped in a {@link ITry} for error handling.
     *
     * ```javascript
     * stream(["1","7","7a"])
     *   .try(SON.parse)
     *   .discardError(console.error)
     *   .toArray();
     * // => ["success", "success", "error"]
     * ```
     *
     * @typeparam S Type of the result of the operation.
     * @param operation Takes each item and returns a mapped value, or throws an `Error`.
     * @return A stream with the mapped values and additional methods for handling errors.
     */
    try<S>(operation: TypedFunction<T, S>): ITryStream<S>;

    /**
     * Passes this stream to the the operation and returns its result,
     * wrapped in a {@link ITry} in case the operation throws an error.
     * Usually used for performing a terminal operation with error handling
     * on the stream.
     *
     * ```javascript
     * stream([1,2,3]).tryCompute(s => s.sum(item => {throw new Error()}))
     * // => Try[success=false]
     * ```
     *
     * @typeparam S Type of the value produced by the operation.
     * @param operation Takes this stream and returns value. If it throws an error, the resulting {@link ITry} is not successful.
     * @return The result of the operation, wrapped in a {@link ITry} for encapsulating thrown errors.
     */
    tryCompute<S>(operation: TypedFunction<IStream<T>, S>): ITry<S>;

    /**
     * Same as {@link #end}, but encapsulates any errors thrown. Applies
     * all pending operation to the pipeline.
     *
     * ```javascript
     * // prints 1,2,3
     * stream([1,2,3]).visit(console.log).tryEnd()
     * ```
     *
     * @return The encapsulated error, if any was thrown.
     */
    tryEnd(): ITry<void>;

    /**
     * Creates an array with the items of this stream.
     * If the underlying iterable is an array, returns that
     * array instead of creating a new array.
     *
     * ```javascript
     * stream("foobar").toArray()
     * // => ["f", "o", "o", "b", "a", "r"]
     * ```
     *
     * @param fresh Iff true, always creates a new array. Otherise, reuses existing array when possible.
     * @return An array with the items.
     */
    toArray(fresh?: boolean): T[];

    /**
     * Creates a set with the items of this stream.
     * If the underlying iterable is a set, returns that
     * set instead of creating a new set.
     *
     * ```javascript
     * stream("foobar").toSet()
     * // => Set["f", "o", "b", "a", "r"]
     * ```
     *
     * @param fresh Iff true, always creates a new set. Otherwise, reuses existing set when possible.
     * @return A set with the items.
     */
    toSet(fresh?: boolean): Set<T>;

    /**
     * Creates a map from the items of this stream. When two items have
     * the same key, the optional merge function is called with the two
     * items and the result of the merge function is used as the value
     * for that key. If no merge function is given, the value of the item
     * encountered first is taken.
     *
     * ```javascript
     * stream(["foo", "bar"]).toMap(x => x, x => x.length)
     * // => Map[ "foo" => 3, "bar" => 3 ]
     *
     * const data = [{id: 0, name: "foo"}, {id: 0, name: "bar"}];
     *
     * stream(data).toMap(x => x.id, x => x.name)
     * // => Map[ 0 => "bar" ]
     *
     * stream(data).toMap(x => x.id, x => x.name, (name1, name2) => name1 + "," + name2)
     * // => Map[ 0 => "foo,bar" ]
     * ```
     *
     * @typeparam K Type of the map's keys.
     * @typeparam V Type of the map's values.
     * @param keyMapper Transforms an item into the map key to be used.
     * @param valueMapper Transforms an item into the value used for the corresponding key.
     * @param merger A merge function called when two items map to the same key and returns the merged value. Called with two items having the same key, the first argument is the item encountered first in the stream.
     * @return A map with all the mapped key-value-pairs of the items.
     */
    toMap<K, V>(keyMapper: TypedFunction<T, K>, valueMapper: TypedFunction<T, V>, merger?: BinaryOperator<V>): Map<K, V>;

    /**
     * Filters all elements that are considered equal according to
     * the given comparator. If two items are equal, the first one
     * is included in the resulting stream. Consider using
     * {@link #uniqueBy} if possible for better performance.
     *
     * ```javascript
     * stream([4,1,3,4,1,3,1,9]).unique()
     * // => Stream[4,1,3,9]
     *
     * stream({id:4},{id:2},{id:4]}).unique((x,y) => x.id - y.id)
     * // => Stream[ {id:4}, {id:2} ]
     * ```
     *
     * @param comparator Takes two items and returns 0 if they are equal. Defaults to taking determining equality by `===`.
     * @return A stream with all duplicates removed.
     */
    unique(comparator?: Comparator<T>): this;

    /**
     * Similar to {@link #unique}, but allows for a custom key to
     * be specified, according to which uniqueness is determined.
     * If two items compare equal, the item encountered first in the
     * stream is taken. If items with the same key need to be merged,
     * consider using `stream.collect(Collectors.toSet(merger))`.
     *
     * ```javascript
     * stream([4,1,3,4,1,3,1,9]).distinct()
     * // => Stream[4,1,3,9]
     *
     * stream({id:4},{id:2},{id:4]}, customer => customer.id).distinct()
     * // => Stream[ {id:4}, {id:2} ]
     * ```
     *
     * @param keyExtractor Returns a key for each item. Items with duplicate keys are removed. Defaults to taking the item itself as the key.
     * @return A stream with all duplicates removed.
     */
    uniqueBy<K = any>(keyExtractor: TypedFunction<T, K>): this;

    /**
     * Calls the given consumer once for each item. Note that the consumer is
     * not called before the stream is consumed by some terminal operation.
     *
     * ```javascript
     * stream([1,2,3]).visit(console.log)
     * // => Stream[1,2,3]
     * // prints `1,2,3` once the stream is consumed.
     * ```
     *
     * @param consumer Callback taking each item.
     * @return A stream with the same items as this stream.
     */
    visit(consumer: Consumer<T>): this;

    /**
     * Produces a stream over tuples of consisting of an item of the given iterable;
     * and the corresponding item of the other iterable.
     * If one of the iterables is longer, the shorter one is
     * appended with `undefined`.
     *
     * ```javascript
     * stream(["foo", "bar"].zip([3, 4])
     * // => Stream[ ["foo",3], ["bar", 4] ]
     *
     * stream(["foo", "bar"]).zip([3, 4]).toMap(x=>x[0], x=>x[1])
     * // => Map[ "foo" => 3, "bar" => 4] ]
     * ```
     *
     * @param other Other iterable to be zipped to this stream.
     * @return A stream over all the produced tuples.
     */
    zip<S>(other: Iterable<S>): IStream<[Maybe<T>, Maybe<S>]>;

    /**
     * Produces a stream over tuples of consisting of an item of this stream and
     * the corresponding items of the other iterables.
     * If any of the iterables has a different length than the others,
     * the shorter ones appended with `undefined` to the length of the longest.
     *
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
     *
     * @param others Other iterable to be zipped to the given iterable.
     * @return A stream over al the produced tuples.
     */
    zipSame(...others: Iterable<T>[]): IStream<Maybe<T>[]>;
}

/**
 * Contains several convenience methods for easier error handling
 * with {@link ITry}. A try-stream is created by using the {@link Stream.try}
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
export interface ITryStream<T> extends IStream<ITry<T>> {
    /**
     * Passes all errors to the given handler and removes
     * them from the stream.
     *
     * ```javascript
     * stream(...).try(JSON.parse).discardError().toArray()
     * // => [json1, json2, ...]
     * // prints all errors encountered during parsing
     * ```
     *
     * @param handler For handling the errors. Defaults to `console.error`.
     * @return A stream with all the errors removed.
     */
    discardError(handler?: Consumer<Error>): IStream<T>;

    /**
     * Passes each successful value or error to the given handler.
     *
     * ```javascript
     * stream(...).try(JSON.parse).forEachResult(
     *   json => { process(...) },
     *   error => console.error(error)
     * )
     * ```
     *
     * @param success Handler that is passed all successful values.
     * @param error Optional handler that is passed all errors. Defaults to `console.error`.
     */
    forEachResult(success: Consumer<T>, error?: Consumer<Error>): void;

    /**
     * Applies the given test to the successful values and
     * produces an error for those that do not match.
     *
     * ```javascript
     * stream("12a").try(JSON.parse).include(x => x < 2)
     * // => Stream[ Try[value=1], Try[error="does not match"], Try[error="invalid JSON"] ]
     * ```
     *
     * @param predicate Test successful values need to pass for includsion.
     * @return A try-stream with all successful values passing the test.
     */
    include(predicate: Predicate<T>): this;

    /**
     * Computes a new value from each successful value or error.
     * If the operation or backup function throws an error, or if
     * no backup is provided, the {@link ITry} is not successful.
     * Similar to {@link #flatConvert}, but the operation and
     * backup handlers return a {@link ITry} directly.
     *
     * ```javascript
     * stream(["\"1\"", "\"1.5\""]).try(JSON.parse).convert(x => Try.of(() => parseIntSafe(x)))
     * // Stream[ Try[value=1], Try[error="not an int" ]
     * ```
     *
     * @typeparam S Type of the new value.
     * @param operation Mapper that converts each succesful values into a {@link ITry} of the new value.
     * @param backup Optional mapper that converts each error into a {@link ITry} of the new value.
     * @return A try-stream with the converted values, or any thrown errors.
     */
    flatConvert<S>(operation: TypedFunction<T, ITry<S>>, backup?: TypedFunction<Error, ITry<S>>): ITryStream<S>;

    /**
     * Computes a new value from each successful value or error.
     * If the operation or backup function throws an error, or if
     * no backup is provided, the Try is not successful.
     *
     * ```javascript
     * stream("12a").try(JSON.parse).convert(x => 2*x)
     * // Stream[ Try[value=1], Try[value=2], Try[error="invalidJSON"] ]
     * ```
     *
     * @typeparam S Type of the new value.
     * @param operation Mapper that converts each succesful values into the new one.
     * @param backup Optional mapper that converts each error into the new value.
     * @return A try-stream with the converted values, or any thrown errors.
     */
    convert<S>(operation: TypedFunction<T, S>, backup?: TypedFunction<Error, S>): ITryStream<S>;

    /**
     * Returns a stream with each items being either the successful value
     * of the {@link ITry} or the given backup value.
     *
     * ```javascript
     * stream("12a").try(JSON.parse).orElse(undefined)
     * // Stream[1,2,undefined]
     * ```
     *
     * @param backup A default value for errors.
     * @return A stream with either the successful value or the backup value.
     */
    orElse(backup: T): IStream<T>;

    /**
     * Calls the given error handler for all errors.
     *
     * ```javascript
     * stream("12a").try(JSON.parse).onError(console.warn).end()
     * // => Stream[ Try[value=1], Try[value=2], Try[error="invalid JSON"] ]
     * // Warns about errors once the stream is consumed.
     * ```
     *
     * @param success Handler called with successful values.
     * @param error Handler called with errors. If not present, it is not called.
     * @return This try-stream.
     */
    onError(handler: Consumer<Error>): this;

    /**
     * Calls the given success handler for all successful
     * values and the given error handler, if present, for all errors.
     *
     * ```javascript
     * stream("12a").try(JSON.parse).onSuccess(console.info, console.warn)
     * // => Stream[ Try[value=1], Try[value=2], Try[error="invalid JSON"] ]
     * // Informs about success and warns about errors once the stream is consumed.
     * ```
     *
     * @param success Handler called with successful values.
     * @param error Handler called with errors. If not present, it is not called.
     * @return This try-stream.
     */
    onSuccess(success: Consumer<T>, error?: Consumer<Error>): this;

    /**
     * Throws iff any {@link ITry} is not successful. Otherwise
     * unwraps all tries and returns a stream with the contained
     * successful values.
     *
     * ```javascript
     * stream("12a").try(JSON.parse).orThrow().toArray()
     * // throws Error("invalid JSON")
     * ```
     *
     * @return A stream with the successful values.
     */
    orThrow(): IStream<T>;

    /**
     * Applies the backup handler to each error, producing
     * a value of the same type as the succesful value of this
     * try-stream. If the handler throws, the resulting {@link ITry}
     * is not successful.
     *
     * ```javascript
     * stream(["https://...", "https://..."]).try(GetSync).orTry(e => e.status)
     * // Stream[ Try[value="response"], Try[value="Not found"] ]
     * ```
     *
     * @param backup Handler that takes each error and produces a backup value.
     * @return A try-stream with all erronous values replaced with the backup values.
     */
    orTry(backup: TypedFunction<Error, T>): this;
}

export interface ICollectors {
    /**
     * Collects all items into an array, in the order in
     * which the items are provided.
     *
     * ```javscript
     * factory.stream().toArray()
     * // => []
     *
     * factory.stream("foo").toArray()
     * // => ["f", "o", "o"]
     * ```
     *
     * @typeparam T Type of the items to be collected.
     * @return A collector that adds all items into an array.
     */
    toArray<T>(): Collector<T, any, T[]>;

    /**
     * Counts the number of items.
     *
     * ```javascript
     * factory.stream([4,1,0,4]).collect(Collectors.count())
     * // => 4
     * ```
     *
     * @typeparam T Type of the items to be collected.
     * @return A collector that counts the number of items.
     */
    count(): Collector<any, any, number>;

    /**
     * Collects all items into a set. Duplicate items are ignored.
     *
     * ```javscript
     * factory.stream().toSet()
     * // => Set()
     *
     * factory.stream("foo").toSet()
     * // => Set("f", "o")
     * ```
     *
     * @typeparam T Type of the items to be collected.
     * @return A collector that adds all items to a Set.
     */
    toSet<T>(): Collector<T, any, Set<T>>;

    /**
     * Collects all items into a map. An item is added to the
     * map with the key as returned by the key mapper and the
     * value as returned by the value mapper.
     *
     * When two items have the same key, the optional merge
     * function is called with the two items and the result
     * of the merge function is used as the value for that key.
     * If no merge function is given, the value of the item
     * encountered first is taken.
     *
     * ```javscript
     * factory.stream().toMap(x=>x, x=>x)
     * // => Map()
     *
     * const data = [{id: 0, name: "foo"}, {id: 0, name: "bar"}];
     *
     * factory.stream(data).toMap(x => x.id, x => x.name)
     * // => Map[ 0 => "bar" ]
     *
     * factory.stream(data).toMap(x => x.id, x => x.name, (name1, name2) => name1 + "," + name2)
     * // => Map[ 0 => "foo,bar" ]
     * ```
     *
     * @typeparam T Type of the items to be collected.
     * @typeparam K Type of the key of the map.
     * @typeparam V Type of the value of the map.
     * @param keyMapper Takes an item and returns the key for that item.
     * @param valueMapper Takes an items and returns the value for that item.
     * @param merger A merge function called when two items map to the same key and returns the merged value.  Called with two items having the same key, the first argument is the item encountered first in the stream.
     * @return A collector that adds all items to a Map with the key and value as computed by the key and value mapper.
     */
    toMap<T, K, V>(keyMapper: TypedFunction<T, K>, valueMapper: TypedFunction<T, V>, merger?: BinaryOperator<V>): Collector<T, any, Map<K, V>>;

    /**
     * Splits the items into several groups, according to the given
     * classifier.
     *
     * ```javascript
     * factory.stream(["a", "foo", "is", "some", "buzz"]).collect(Collectors.group(x => x.length))
     * // => Map [ 1 => ["a"], 2 => ["is"], 3 => "is", 4 => ["some", "buzz"] ]
     * ```
     *
     * @typeparam T Type of the items to be collected.
     * @typearam K Type of the group key.
     * @param classifier Returns the group for each item.
     * @return A map with the groups as keys and arrays as values, containing all the items for that group.
     */
    group<T, K>(classifier: TypedFunction<T, K>): Collector<T, any, Map<K, T[]>>;

    /**
     * Applies the classifier on items and groups those items into
     * a group for which the classifier returned the same value.
     * Equality is determined by `===`. The downstream collector is
     * then applied to the items of each group. The result is a map
     * between the key returned by the classifier and the value
     * returned by the downstream collector.
     *
     * ```javascript
     * factory.stream(factory.times(11)).collect(Collectors.groupDown(x => x % 3, Collectors.sum()))
     * // => Map{0: 0+3+6+9, 1: 1+4+7+10, 2: 2+5+8}
     *
     * // Returns a map between the city and the people living in that city.
     * factory.stream(people).groupDown(person => person.city, Collectors.toSet())
     * // => Map<City, Set<Person>>
     * ```
     *
     * @typeparam T Type of the items to be collected.
     * @typeparam K Type of the group key.
     * @typeparam A Type of the intermediate value use by the downstream.
     * @typeparam D Type of the group value.
     * @param classifier Determines the group key of each item. Items with the same group key are grouped together.
     * @param downstream Collector that is applied to the items of each group.
     * @return A collector that groups the items and then collects the items of each group.
     */
    groupDown<T, K, A, D>(classifier: TypedFunction<T, K>, downstream: Collector<T, A, D>): Collector<T, any, Map<K, D>>;

    /**
     * Maps the items with the given mapper and passed them on to the
     * given downstream collector.
     *
     * ```javascript
     * const countLetters = Collectors.map(x => x.length), Collectors.sum();
     * factory.stream(["foo", "foobar"]).collect(countLetters)
     * // => 9
     * ```
     *
     * @typeparam T Type of the items to be collected.
     * @typeparam U Type of the mapped items.
     * @typeparam A Type of the intermediate value used by the downstream.
     * @typeparam R Type of the downstream result.
     * @param mapper Mapping function applied to each item.
     * @param downstream Collector that takes the mapped items.
     * @return The result of the given downstream collector.
     */
    map<T, U, A, R>(mapper: TypedFunction<T, U>, downstream: Collector<U, A, R>): Collector<T, any, R>;

    /**
     * Turns the items into strings and joins these strings together
     * with the given delimiter. Optionally, if prefix or suffix is
     * given, prepends or appends it to the result.
     *
     * ```javascript
     * factory.stream(["foo", "bar"]).collect(Collectors.join())
     * // => "foobar"
     *
     * factory.stream(["foo", "bar"]).collect(Collectors.join(","))
     * // => "foo,bar"
     *
     * factory.stream(["foo", "bar"]).collect(Collectors.join(",", "[", "]"))
     * // => "[foo,bar]"
     *
     * factory.stream([]).collect(Collectors.join(","))
     * // => ""
     * ```
     *
     * @typeparam T Type of the items to be collected.
     * @param delimiter A separator inserted between two items. Default to the empty string.
     * @param prefix If given, it is prepended to the joined result.
     * @param suffix If given, it is appended to the joined result.
     * @return A collector that joins the items into one string with the given delimiter, prefix and suffix.
     */
    join<T>(delimiter?: string, prefix?: string, suffix?: string): Collector<T, any, string>;

    /**
     * Computes the sum of all the collected items, ie.
     * `(x_1 + x_2 + ... + x_n)`, where `n` is the number of items and
     * the `x_i` are the individual items. Returns `NaN` when there are
     * no items.
     *
     * ```javascript
     * factory.stream([]).collect(Collectors.sum());
     * // => NaN
     *
     * factory.stream([1, 2, 3]).collect(Collectors.sum());
     * // => 6
     *
     * const letterCount = Collectors.sum(x => x.length);
     * factory.stream(["fish", "and", "chips"]).collect(letterCount);
     * // => 12
     * ```
     *
     * @typeparam T Type of the items to be collected.
     * @param converter An optional converter for turning items into numbers. Default to `item => Number(item)`.
     * @return A collector that converts each item into a number and computes their sum.
     */
    sum<T>(converter?: TypedFunction<T, number>): Collector<T, any, number>;

    /**
     * Computes the (arithmetic) average of all the collected items, ie.
     * `(x_1 + x_2 + ... + x_n)/n`, where `n` is the number of items and
     * the `x_i` are the individual items. Returns `NaN` when there are
     * no items.
     *
     * ```javascript
     * factory.stream([]).collect(Collectors.average());
     * // => NaN
     *
     * factory.stream([1, 2, 3]).collect(Collectors.average());
     * // => 2
     *
     * const letterAverage = Collectors.sum(x => x.length);
     * factory.stream(["fish", "and", "chips"]).collect(letterAverage);
     * // => 4
     * ```
     *
     * @typeparam T Type of the items to be collected.
     * @param converter An optional converter for turning items into numbers. Default to `item => Number(item)`.
     * @return A collector that converts each item into a number and computes their (arithmetic) mean.
     */
    average<T>(converter?: TypedFunction<T, number>): Collector<T, any, number>;

    /**
     * Computes the geometric average of all the collected items, ie.
     * `(x_1 * x_2 * ... * x_n)/n`, where `n` is the number of
     * items and the `x_i` are the individual items. Returns `NaN`
     * when there are no items.
     *
     * ```javascript
     * factory.stream([]).collect(Collectors.averageGeometrically());
     * // => NaN
     *
     * factory.stream([2, 4, 8]).collect(Collectors.averageGeometrically());
     * // => 4
     *
     * const letterAverage = Collectors.averageGeometrically(x => x.length);
     * factory.stream(["fish", "is", "allergic"]).collect(letterAverage);
     * // => 4
     * ```
     *
     * @typeparam T Type of the items to be collected.
     * @param converter An optional converter for turning items into numbers. Default to `item => Number(item)`.
     * @return A collector that converts each item into a number and computes their geometric mean.
     */
    averageGeometrically<T>(converter?: TypedFunction<T, number>): Collector<T, any, number>;

    /**
     * Computes the harmonic average of all the collected items, ie.
     * `n/(1/x_1 + 1/x_2 + ... + 1/x_n)`, where `n` is the number of items and the
     * `x_i` are the individual items. Returns `NaN` when there are no
     * items.
     *
     * ```javascript
     * factory.stream([]).collect(Collectors.averageHarmonically());
     * // => NaN
     *
     * factory.stream([2, 4, 6, 8]).collect(Collectors.averageHarmonically());
     * // => 3.84
     *
     * const letterAverage = Collectors.averageHarmonically(x => x.length);
     * factory.stream(["is", "fish", "likely", "allergic"]).collect(letterAverage);
     * // => 3.84
     * ```
     *
     * @typeparam T Type of the items to be collected.
     * @param converter An optional converter for turning items into numbers. Default to `item => Number(item)`.
     * @return A collector that converts each item into a number and computes their harmonic mean.
     */
    averageHarmonically<T>(converter?: TypedFunction<T, number>): Collector<T, any, number>;

    /**
     * Computes a statistic for the items, such as the variance
     * and the mean. Returns an instance of IStatistics, see
     * {@link IStatistics} for an in-depth description.
     *
     * ```javascript
     * factory.stream([]).collect(Collectors.summarize());
     * // => Statistics(count=3, mean=NaN, min=NaN, ...)
     *
     * factory.stream([1,3,8]).collect(Collectors.summarize());
     * // => Statistics(count=3, mean=4, min=1, ...)
     *
     * const letterAverage = Collectors.summarize(x => x.length);
     * factory.stream(["is", "fish", "likely", "allergic"]).collect(letterAverage);
     * // => Statistics(count=4, mean=5, min=2, ...)
     * ```
     *
     * @typeparam T Type of the items to be collected.
     * @param converter An optional converter for turning items into numbers. Default to `item => Number(item)`.
     * @return A collector that converts each item into a number and computes statistics for these numbers.
     */
    summarize<T>(converter?: TypedFunction<T, number>): Collector<T, any, IStatistics>;

    /**
     * Computes the product of all the collected items, ie.
     * `(x_1 * x_2 * ... * x_n)`, where `n` is the number of items
     * and the `x_i` are the individual items. Returns `NaN` when
     * there are no items.
     *
     * ```javascript
     * factory.stream([]).collect(Collectors.multiply());
     * // => NaN
     *
     * factory.stream([2, 4, 6]).collect(Collectors.multiply());
     * // => 48
     *
     * const multiply = Collectors.multiply(x => x.length);
     * factory.stream(["is", "fish", "likely", "allergic"]).collect(multiply);
     * // => 384
     * ```
     *
     * @typeparam T Type of the items to be collected.
     * @param converter An optional converter for turning items into numbers. Default to `item => Number(item)`.
     * @return A collector that converts each item into a number and multiplies them.
     */
    multiply<T>(converter?: TypedFunction<T, number>): Collector<T, any, number>;

    /**
     * Splits the items into two groups according to the given
     * discriminator.
     *
     * ```javascript
     * factory.stream([-3,2,9,-4]).collect(Collectors.partition(x => x > 0))
     * // => { false: [-3,-4], true: [2,9]}
     *
     * factory.stream([-3,2,9,-4]).collect(Collectors.partition(x => x > 0))
     * // => { false: [], true: []}
     * ```
     *
     * @typeparam T Type of the elements in the given iterable.
     * @param iterable The iterable to be partitioned.
     * @param discriminator Partitions each item into one of two groups by returning `true` of `false`.
     * @return An object containing the partitioned items.
     */
    partition<T>(predicate: Predicate<T>): Collector<T, any, { false: T[], true: T[] }>;

    /**
     * Applies the predicate on the items, grouping them in one of
     * two classes according to the result of the predicate. The
     * downstream collector is then applied to the items of each
     * group. The result is an object with the keys `false` and `true`
     * and the value as returned by the downstream collector.
     *
     * ```javascript
     * factory.stream(factory.times(11)).collect(Collectors.groupDown(x => x % 2 === 1, Collectors.sum()))
     * // => {false: 0+2+4+6+8+10, true: 1+3+5+7+9}
     * ```
     *
     * @typeparam T Type of the items to be collected.
     * @typeparam A Type of the intermediate value used by the downstream.
     * @typeparam D Type of the group result.
     * @param classifier Determines the group key of each item. Items are partitioned into either the `true` or `false` group..
     * @param downstream Collector that is applied to the items of each group.
     * @return A collector that partitions the items and then collects the items of the `true` and `false` group.
     */
    partitionDown<T, A, D>(predicate: Predicate<T>, downstream: Collector<T, A, D>): Collector<T, any, { false: D, true: D }>;
}
