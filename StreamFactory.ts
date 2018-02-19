import { InplaceStream } from "./InplaceStream";
import { Function, IStream, IStreamFactory } from "./Interfaces";
import { fromObject, fromObjectKeys, fromObjectValues, generate, iterate, repeat, times } from "./Methods";
import { TypesafeStream } from "./TypesafeStream";

function make<T>(inplace: boolean, iterable: Iterable<T>): IStream<T> {
    return inplace ? new InplaceStream(iterable) : new TypesafeStream(iterable);
}

function createFactory(inplace: boolean = true): IStreamFactory {
    return {
        stream<T>(iterable: Iterable<T>): IStream<T> {
            if (typeof iterable[Symbol.iterator] !== "function") {
                throw new Error("Passed value is not iterable: " + typeof iterable);
            }
            return make(inplace, iterable);
        },

        times(amount: number, start?: number, end?: number): IStream<number> {
            return make(inplace, times(amount, start, end));
        },

        generate<T>(generator: Function<number, T>, amount: number = -1): IStream<T> {
            return make(inplace, generate(generator, amount));
        },

        iterate<T>(seed: T, next: Function<T, T>, amount: number = -1): IStream<T> {
            return make(inplace, iterate(seed, next, amount));
        },

        repeat<T>(item: T, amount: number = -1): IStream<T> {
            return make(inplace, repeat(item, amount));
        },

        fromObject<T>(object: { [s: string]: T }): IStream<[string, T]> {
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
