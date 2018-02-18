import { StreamFactory, Stream, Function } from "./Interfaces";
import { fromObject, fromObjectKeys, fromObjectValues, times, generate, repeat, iterate } from "./Methods";
import { InplaceStream } from "./InplaceStream";
import { TypesafeStream } from "./TypesafeStream";

function make<T>(inplace: boolean, iterable: Iterable<T>) : Stream<T> {
    return inplace ? new InplaceStream(iterable) : new TypesafeStream(iterable);
}

function createFactory(inplace: boolean = true) : StreamFactory {
    return {
        stream<T>(iterable: Iterable<T>) : Stream<T> {
            if (typeof iterable[Symbol.iterator] !== "function") {
                throw new Error("Passed value is not iterable: " + typeof iterable);
            }
            return make(inplace, iterable);
        },

        times(amount: number, start?: number, end?: number) : Stream<number> {
            return make(inplace, times(amount, start, end));
        },

        generate<T>(generator: Function<number, T>, amount: number = -1) : Stream<T> {
            return make(inplace, generate(generator, amount));
        },

        iterate<T>(seed: T, next: Function<T, T>, amount: number = -1) : Stream<T> {
            return make(inplace, iterate(seed, next, amount));
        },

        repeat<T>(item: T, amount: number = -1) : Stream<T> {
            return make(inplace, repeat(item, amount));
        },

        fromObject<T>(object: {[s: string] : T}) : Stream<[string,T]> {
            return make(inplace, fromObject(object));
        },

        fromObjectKeys(object: {[s: string] : any}) : Stream<string> {
            return make(inplace, fromObjectKeys(object));
        },

        fromObjectValues<T>(object: {[s: string] : T}) : Stream<T> {
            return make(inplace, fromObjectValues(object));
        },
    };
};

export const TypesafeStreamFactory : StreamFactory = createFactory(false);
export const InplaceStreamFactory : StreamFactory = createFactory(true);

export const stream = InplaceStreamFactory.stream;