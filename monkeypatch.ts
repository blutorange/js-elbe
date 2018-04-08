import { IStream } from "./Interfaces";
import { fromObject, fromObjectKeys, fromObjectValues } from "./Methods";
import { InplaceStreamFactory, TypesafeStreamFactory } from "./StreamFactory";

/** @internal */
function patch<P, T, S>(force: boolean, type: {prototype: P}, getStream: (object: T) => Iterable<S>, wrapStream: (iterable: Iterable<S>) => IStream<S>, name: string = "stream") {
    if (Object.hasOwnProperty.call(type.prototype, name)) {
        if (!force) {
            return;
        }
        delete (type.prototype as any)[name];
    }
    Object.defineProperty(type.prototype, name, {
        configurable: true,
        enumerable: false,
        value(this: T): IStream<S> {
            return wrapStream(getStream(this));
        },
        writable: false,
    });
}

/**
 * Patches a few stream convenience methods to the prototype of objects:
 * * String.stream() `Stream<string>` Creates a stream over all characters.
 * * Array.stream() `Stream<T>` Creates a stream over all items.
 * * Set.stream() `Stream<T>` Creates a stream over all items.
 * * Map.stream() `Stream<K,V>` Creates a stream over all key-value pairs.
 * * Object.stream() `Stream<{key: string, value: T}>` Creates a stream over all key-value pairs.
 * * Object.keys() `Stream<string>` Creates a stream over all keys.
 * * Object.values() `Stream<T>` Creates a stream over all values.
 *
 * ```javascript
 * require("elbe").monkeyPatch();
 *
 * "foo".stream() // => Stream["f", "o", "o"]
 *
 * [1,2,3].stream() // => Stream[1, 2, 3]
 *
 * {foo: 42, bar: 99}.keys() // => Stream["foo", "bar"]
 * ```
 *
 * @param inplace Iff `true`, uses {@link InplaceStreamFactory} or {@link TypesafeStreamFactory} otherwise.
 * @param force Iff `true`, always add the methods to the prototype. Otherwise, does nothing if the methods exist already.
 */
export function monkeyPatch(inplace: boolean = false, force: boolean = false): void {
    const stream = inplace ? InplaceStreamFactory.stream : TypesafeStreamFactory.stream;
    patch<any[], any[], any[]>(force, Array, array => array, stream);
    patch<Set<any>, Set<any>, Set<any>>(force, Set, set => set.values(), stream);
    patch<Map<any, any>, Map<any, any>, [any, any]>(force, Map, map => map.entries(), stream);
    // tslint:disable-next-line:ban-types
    patch<Object, object, {key: any, value: any}>(force, Object, object => fromObject(object), stream);
    // tslint:disable-next-line:ban-types
    patch<Object, object, any>(force, Object, object => fromObjectKeys(object), stream, "keys");
    // tslint:disable-next-line:ban-types
    patch<Object, object, any>(force, Object, object => fromObjectValues(object), stream, "values");
    // tslint:disable-next-line:ban-types
    patch<String, string, string>(force, String, s => s, stream);
}
