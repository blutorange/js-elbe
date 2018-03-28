import { EMPTY_ITERABLE } from "./helpers";
import { InplaceStream } from "./InplaceStream";
import { Function, IStream, IStreamFactory } from "./Interfaces";
import { fromObject, fromObjectKeys, fromObjectValues, generate, iterate, random, repeat, step, times } from "./Methods";
import { TypesafeStream } from "./TypesafeStream";

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

        generate<T>(generator: Function<number, T>, amount?: number): IStream<T> {
            return make(inplace, generate(generator, amount));
        },

        iterate<T>(seed: T, next: Function<T, T>, amount?: number): IStream<T> {
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

export const TypesafeStreamFactory: IStreamFactory = createFactory(false);
export const InplaceStreamFactory: IStreamFactory = createFactory(true);

/**
 *
 * A shortcut for [[InplaceStreamFactory]]#stream. Use this
 * to create streams quickly.
 *
 * ```javascript
 * stream("foobar").map(x => String.fromCodePoint(x.codePointAt(0) + 1)).join("")
 * ```
 */
export const stream = InplaceStreamFactory.stream;
export const factory = InplaceStreamFactory;
