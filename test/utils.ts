import { Consumer } from "andross";
import { expect } from "chai";
import { IStream, IStreamFactory } from "../Interfaces";
import { ITry } from "../Interfaces";

export function Expect(stream: IStream<any>): Chai.Assertion {
    return expect(Array.from(stream));
}

export function expectTry<T>(ATry: ITry<T>, success: boolean, handler?: Consumer<Chai.Assertion>): void {
    expect(ATry.success).to.equal(success);
    if (handler !== undefined) {
        ATry.ifPresent(t => handler(expect(t)), e => handler(expect(e)));
    }
}

export function toObj(map: Map<any, any>): {[s: string]: any} {
    const obj: {[s: string]: any} = {};
    for (const entry of map.entries()) {
        obj[entry[0]] = entry[1];
    }
    return obj;
}

export function setOf<T>(...items: T[]): Set<T> {
    return new Set(items);
}

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
