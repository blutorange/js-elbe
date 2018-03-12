import { IStream } from "./Interfaces";
import { fromObject, fromObjectKeys, fromObjectValues } from "./Methods";
import { InplaceStreamFactory, TypesafeStreamFactory } from "./StreamFactory";

/** @internal */
function patch<P, T, S>(type: {prototype: P}, getStream: (object: T) => Iterable<S>, wrapStream: (iterable: Iterable<S>) => IStream<S>, name: string = "stream") {
    if (Object.hasOwnProperty.call(type.prototype, name)) {
        return;
    }
    Object.defineProperty(type.prototype, name, {
        configurable: false,
        enumerable: false,
        value(this: T): IStream<S> {
            return wrapStream(getStream(this));
        },
        writable: false,
    });
}

/**
 * Patches a few stream convenience methods to the prototype of objects:
 * * String.stream() Stream<string> Creates a stream over all characters.
 * * Array.stream() Stream<T> Creates a stream over all items.
 * * Set.stream() Stream<T> Creates a stream over all items.
 * * Map.stream() Stream<K,V> Creates a stream over all key-value pairs.
 * * Object.stream() Stream<[string,T]> Creates a stream over all key-value pairs.
 * * Object.keys() Stream<string> Creates a stream over all keys.
 * * Object.values() Stream<T> Creates a stream over all values.
 * @param inplace Iff `true`, uses {@link InplaceStreamFactory} or {@link TypesafeStreamFactory} otherwise.
 */
export function monkeyPatch(inplace: boolean = false): void {
    const stream = inplace ? InplaceStreamFactory.stream : TypesafeStreamFactory.stream;
    patch<any[], any[], any[]>(Array, array => array, stream);
    patch<Set<any>, Set<any>, Set<any>>(Set, set => set.values(), stream);
    patch<Map<any, any>, Map<any, any>, [any, any]>(Map, map => map.entries(), stream);
    // tslint:disable-next-line:ban-types
    patch<Object, object, {key: any, value: any}>(Object, object => fromObject(object), stream);
    // tslint:disable-next-line:ban-types
    patch<Object, object, any>(Object, object => fromObjectKeys(object), stream, "keys");
    // tslint:disable-next-line:ban-types
    patch<Object, object, any>(Object, object => fromObjectValues(object), stream, "values");
    // tslint:disable-next-line:ban-types
    patch<String, string, string>(String, s => s, stream);
}
