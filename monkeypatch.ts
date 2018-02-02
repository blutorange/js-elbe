import { Stream } from "./Interfaces";
import { TypesafeStreamFactory } from "./TypesafeStream";
import { InplaceStreamFactory } from "./InplaceStream";
import { fromObject } from "./Methods";

function patch<P, T,S>(type: {prototype: P}, getStream: (object: T) => Iterable<S>, wrapStream: (iterable: Iterable<S>) => Stream<S>) {
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
    const stream = inplace ? InplaceStreamFactory.from : TypesafeStreamFactory.from;
    patch<Array<any>, Array<any>, Array<any>>(Array, array => array, stream);
    patch<Set<any>, Set<any>, Set<any>>(Set, set => set.values(), stream);
    patch<Map<any,any>, Map<any,any>, [any,any]>(Map, map => map.entries(), stream);
    patch<Object, object, [any,any]>(Object, object => fromObject(object), stream);
    patch<String, string, string>(String, string => string, stream);
};