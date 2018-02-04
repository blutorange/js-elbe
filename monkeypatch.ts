import { Stream } from "./Interfaces";
import { TypesafeStreamFactory, InplaceStreamFactory } from "./StreamFactory";
import { fromObject, fromObjectKeys, fromObjectValues } from "./Methods";

/** @internal */
function patch<P, T,S>(type: {prototype: P}, getStream: (object: T) => Iterable<S>, wrapStream: (iterable: Iterable<S>) => Stream<S>, name: string = "stream") {
    if (Object.hasOwnProperty.call(type.prototype, name)) {
        return;
    }
    Object.defineProperty(type.prototype, name, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function(this: T) : Stream<S> {
            return wrapStream(getStream(this));
        }
    });
};

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
export function monkeyPatch(inplace: boolean = false) : void {
    const stream = inplace ? InplaceStreamFactory.stream : TypesafeStreamFactory.stream;
    patch<Array<any>, Array<any>, Array<any>>(Array, array => array, stream);
    patch<Set<any>, Set<any>, Set<any>>(Set, set => set.values(), stream);
    patch<Map<any,any>, Map<any,any>, [any,any]>(Map, map => map.entries(), stream);
    patch<Object, object, [any,any]>(Object, object => fromObject(object), stream);
    patch<Object, object, any>(Object, object => fromObjectKeys(object), stream, "keys");
    patch<Object, object, any>(Object, object => fromObjectValues(object), stream, "values");
    patch<String, string, string>(String, string => string, stream);
};