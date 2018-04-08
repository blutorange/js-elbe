import { Consumer } from "andross";
import { expect } from "chai";

import { ICollectors, IStream, IStreamFactory, ITry, ITryFactory } from "../main";

/** @internal */
export function Expect(stream: IStream<any>): Chai.Assertion {
    return expect(Array.from(stream));
}

/** @internal */
export function expectTry<T>(ATry: ITry<T>, success: boolean, handler?: Consumer<Chai.Assertion>): void {
    expect(ATry.success).to.equal(success);
    if (handler !== undefined) {
        ATry.ifPresent(t => handler(expect(t)), e => handler(expect(e)));
    }
}

/** @internal */
export function toObj(map: Map<any, any>): {[s: string]: any} {
    const obj: {[s: string]: any} = {};
    for (const entry of map.entries()) {
        obj[entry[0]] = entry[1];
    }
    return obj;
}

/** @internal */
export function setOf<T>(...items: T[]): Set<T> {
    return new Set(items);
}

/** @internal */
export class StreamTest {
    protected factory: IStreamFactory;

    constructor(factory: IStreamFactory) {
        this.factory = factory;
    }

    protected stream<T, S>(iterable: Iterable<T>, preparer: (stream: IStream<T>) => IStream<S>): Chai.Assertion {
        const stream = this.factory.stream(iterable);
        return Expect(preparer(stream));
    }

    protected terminal<T, S>(iterable: Iterable<T>, preparer: (stream: IStream<T>) => S): Chai.Assertion {
        const stream = this.factory.stream(iterable);
        return expect(preparer(stream));
    }

    protected async promiseMe<T, S>(iterable: Iterable<T>, preparer: (stream: IStream<T>) => Promise<S>): Promise<S> {
        const stream = this.factory.stream(iterable);
        const result = await preparer(stream);
        return result;
    }

    protected action<T, S>(iterable: Iterable<T>, preparer: (stream: IStream<T>) => void): Chai.Assertion {
        const stream = this.factory.stream(iterable);
        return expect(() => preparer(stream));
    }
    protected inf(): IStream<number> {
        return this.factory.step(Infinity);
    }
}

/** @internal */
export interface IMain {
    Collectors: ICollectors;
    InplaceStreamFactory: IStreamFactory;
    TryFactory: ITryFactory;
    TypesafeStreamFactory: IStreamFactory;
    consumeFirst: <T>(iterable: Iterable<T>, sink: T[] | Consumer<T>) => Iterable<T>;
    monkeyPatch: (inplace?: boolean, force?: boolean) => void;
}

export function load(action: Consumer<IMain>): void {
    const files = ["../main", "../../web/main", "../../elbe", "../../elbe.min"];
    for (const file of files) {
        const lib = require(file);
        const main = {
            Collectors: lib.Collectors,
            InplaceStreamFactory: lib.InplaceStreamFactory,
            TryFactory: lib.TryFactory,
            TypesafeStreamFactory: lib.TypesafeStreamFactory,
            consumeFirst: lib.Methods.consumeFirst,
            monkeyPatch: lib.monkeyPatch,
        };
        for (const key in main) {
            if (!Object.hasOwnProperty.call(main, key)) {
                continue;
            }
            const prop = Object.getOwnPropertyDescriptor(main, key);
            if (prop === undefined || prop.value === undefined) {
                throw new Error("Lib was not loaded correctly: " + key);
            }
        }
        (global as any).describe(`With compiled library at ${file}`, () => action(main));
    }
}
