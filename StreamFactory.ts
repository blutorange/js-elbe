import { StreamFactory, Stream, Function } from "./Interfaces";
import { fromObject, fromObjectKeys, fromObjectValues, times, generate, repeat, iterate } from "./Methods";
import { InplaceStream } from "./InplaceStream";
import { TypesafeStream } from "./TypesafeStream";

function createFactory(inplace: boolean = true) : StreamFactory {
    const clazz = inplace ? InplaceStream : TypesafeStream;
    return {
        stream<T>(iterable: Iterable<T>) : Stream<T> {
            if (typeof iterable[Symbol.iterator] !== "function") {
                throw new Error("Passed value is not iterable: " + typeof iterable);
            }
            return new clazz(iterable);
        },

        times<T>(amount: number, start?: number, end?: number) : Stream<T> {
            return new clazz(times(amount, start, end));
        },

        generate<T>(generator: Function<number, T>, amount: number = -1) : Stream<T> {
            return new clazz(generate(generator, amount));
        },

        iterate<T>(seed: T, next: Function<T, T>, amount: number = -1) : Stream<T> {
            return new clazz(iterate(seed, next, amount));
        },

        repeat<T>(item: T, amount: number = -1) : Stream<T> {
            return new clazz(repeat(item, amount));
        },

        fromObject<T>(object: {[s: string] : T}) : Stream<[string,T]> {
            return new clazz(fromObject(object));
        },

        fromObjectKeys(object: {[s: string] : any}) : Stream<string> {
            return new clazz(fromObjectKeys(object));
        },

        fromObjectValues<T>(object: {[s: string] : T}) : Stream<T> {
            return new clazz(fromObjectValues(object));
        },
    };
};

export const TypesafeStreamFactory : StreamFactory = createFactory(false);
export const InplaceStreamFactory : StreamFactory = createFactory(true);

export const stream = InplaceStreamFactory.stream;