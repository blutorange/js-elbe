import { TypedFunction } from "andross";
import { InplaceStream } from "./InplaceStream";
import { IStream, IStreamFactory } from "./Interfaces";
import { fromObject, fromObjectKeys, fromObjectValues, generate, iterate, random, repeat, step, times } from "./Methods";
import { TypesafeStream } from "./TypesafeStream";
import { EMPTY_ITERABLE } from "./util";

function make<T>(inplace: boolean, iterable: Iterable<T>): IStream<T> {
    return inplace ? new InplaceStream(iterable) : new TypesafeStream(iterable);
}

function createFactory(inplace: boolean): IStreamFactory {
    return {
        stream<T>(iterable: Iterable<T>): IStream<T> {
            if (typeof iterable[Symbol.iterator] !== "function") {
                throw new Error("Passed value is not iterable: " + typeof iterable);
            }
            return make(inplace, iterable);
        },

        empty<T>(): IStream<T> {
            return make(inplace, EMPTY_ITERABLE);
        },

        times(amount: number, start?: number, end?: number): IStream<number> {
            return make(inplace, times(amount, start, end));
        },

        random(amount?: number): IStream<number> {
            return make(inplace, random(amount));
        },

        generate<T>(generator: TypedFunction<number, T>, amount?: number): IStream<T> {
            return make(inplace, generate(generator, amount));
        },

        iterate<T>(seed: T, next: TypedFunction<T, T>, amount?: number): IStream<T> {
            return make(inplace, iterate(seed, next, amount));
        },

        repeat<T>(item: T, amount?: number): IStream<T> {
            return make(inplace, repeat(item, amount));
        },

        step(amount: number, start?: number, s?: number): IStream<number> {
            return make(inplace, step(amount, start, s));
        },

        fromObject<T>(object: { [s: string]: T }): IStream<{key: string, value: T}> {
            return make(inplace, fromObject(object));
        },

        fromObjectKeys(object: { [s: string]: any }): IStream<string> {
            return make(inplace, fromObjectKeys(object));
        },

        fromObjectValues<T>(object: { [s: string]: T }): IStream<T> {
            return make(inplace, fromObjectValues(object));
        },
    };
}

/**
 * This implements the factory methods as defined by {@link IStreamFactory}.
 *
 * Creates instances of TypesafeStream. A typesafe stream creates new
 * instances when chaining methods on the stream. This makes it safe  to use
 * with typescript. When an old stream instance is accessed again after chaining,
 * an error can be thrown to indicate this fact.
 *
 * ```javascript
 * const stream1 = require("elbe").TypesafeStreamFactory.stream("foo");
 * // Returns an instance of IStream<string>
 *
 * const stream2 = stream1.map(x => x.charCodeAt(0));
 * // Returns an instance of IStream<number>
 *
 * // Now stream1 and stream2 are of different type and do not
 * // refer to the same object. The call to #map created a new
 * // stream instance.
 * stream1 === stream2 // => false
 *
 * // Throws an error because stream1 because the mapping operation
 * // already consumed the stream.
 * stream1.toArray();
 * ```
 *
 * @see {@link IStreamFactory}
 */
export const TypesafeStreamFactory: IStreamFactory = createFactory(false);

/**
 * This implements the factory methods as defined by {@link IStreamFactory}.
 *
 * Creates instances of InplaceStream. An inplace stream does not create
 * instances when chaining methods on the stream, but switches out the underlying
 * iterable is is thus not immutable. This requires casting and it makes it unsafe
 * with typescript. When a stream object is accessed again after chaining, no error
 * can be thrown. The InplaceStream is slightly faster as it does not need
 * to create new instances.
 *
 * ```javascript
 * const stream1 = require("elbe").InplaceStreamFactory.stream("foo");
 * // Returns an instance of IStream<string>
 *
 * const stream2 = stream1.map(x => x.charCodeAt(0));
 * // Returns an instance of IStream<number>
 *
 * // Now stream1 and stream2 refer to the same object, but are deemed
 * // to be of differing types by the typescript compiler.
 * stream1 === stream2 // => true
 *
 * stream2.toArray();
 * // => [102, 11, 111]
 *
 * // This should throw an error because stream1 was consumed
 * // when it got mapped, but this is not possible with InplaceStream.
 * stream1.toArray();
 * ```
 *
 * @see {@link IStreamFactory}
 */
export const InplaceStreamFactory: IStreamFactory = createFactory(true);

/**
 *
 * A shortcut for {@link InplaceStreamFactory}#stream. Use this
 * to create streams quickly.
 *
 * ```javascript
 * const stream = require("elbe").stream("foobar")
 * stream.size() // => 6
 * ```
 */
export const stream = InplaceStreamFactory.stream;

/**
 *
 * A shortcut for {@link InplaceStreamFactory}.
 *
 * ```javascript
 * const { factory } = require("elbe")
 *
 * factory.stream([1,2,3]) // => Stream[1, 2, 3]
 *
 * factory.times(5) // => Stream[0, 1, 2, 3, 4]
 * ```
 */
export const factory = InplaceStreamFactory;
