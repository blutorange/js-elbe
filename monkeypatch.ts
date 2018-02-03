import { Stream } from "./Interfaces";
import { TypesafeStreamFactory, InplaceStreamFactory } from "./StreamFactory";
import { fromObject, fromObjectKeys, fromObjectValues } from "./Methods";

function patch<P, T,S>(type: {prototype: P}, getStream: (object: T) => Iterable<S>, wrapStream: (iterable: Iterable<S>) => Stream<S>, name: string = "stream") {
    Object.defineProperty(type.prototype, "stream", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function(this: T) : Stream<S> {
            return wrapStream(getStream(this));
        }
    });
};

export function monkeyPatch(inplace: boolean = false) {
    const stream = inplace ? InplaceStreamFactory.stream : TypesafeStreamFactory.stream;
    patch<Array<any>, Array<any>, Array<any>>(Array, array => array, stream);
    patch<Set<any>, Set<any>, Set<any>>(Set, set => set.values(), stream);
    patch<Map<any,any>, Map<any,any>, [any,any]>(Map, map => map.entries(), stream);
    patch<Object, object, [any,any]>(Object, object => fromObject(object), stream);
    patch<Object, object, any>(Object, object => fromObjectKeys(object), stream, "keys");
    patch<Object, object, any>(Object, object => fromObjectValues(object), stream, "values");
    patch<String, string, string>(String, string => string, stream);
};