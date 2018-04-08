/* tslint:disable */
import { expect } from "chai";
import { suite, test } from "mocha-typescript";

import { Expect, load } from "./utils";

class WithProto {
    constructor(public foo: number = 42) {}
}

(WithProto.prototype as any).bar = 43;

export const hack: any[] = [];
load(({ InplaceStreamFactory, TypesafeStreamFactory }) => {
    [InplaceStreamFactory, TypesafeStreamFactory].forEach((factory, i) => {
        @suite(`IStreamFactory with ${i === 0 ? "InplaceStreamFactory" : "TypesafeStreamFactory"}`)
        class IStreamFactoryTest {
            @test("should convert the iterable into a stream")
            public stream() {
                function * it (): Iterable<number> {
                    yield 1;
                    yield 2;
                    yield 3;
                }
                const set = new Set([1,2,3]);

                const map = new Map();
                map.set("foo", 1);
                map.set("bar", 2);
                map.set("baz", 3);

                Expect(factory.stream(it())).to.deep.equal([1,2,3]);

                Expect(factory.stream([])).to.deep.equal([]);
                Expect(factory.stream([1,2,3])).to.deep.equal([1,2,3]);

                Expect(factory.stream("")).to.deep.equal([]);
                Expect(factory.stream("foo")).to.deep.equal(["f", "o", "o"]);

                Expect(factory.stream(set)).to.deep.equal([1,2,3]);
                Expect(factory.stream(map.entries())).to.deep.equal([["foo", 1], ["bar", 2], ["baz", 3]]);

                expect(() => factory.stream(0 as any)).to.throw();
            }

            @test("should create an empty stream")
            public empty() {
                Expect(factory.empty()).to.deep.equal([]);
                Expect(factory.empty().map(x => 9)).to.deep.equal([]);
            }

            @test("should produce numbers via times")
            public times() {
                Expect(factory.times(0)).to.deep.equal([]);
                Expect(factory.times(3)).to.deep.equal([0,1,2]);
                Expect(factory.times(3,4)).to.deep.equal([4,5,6]);
                Expect(factory.times(3,4,8)).to.deep.equal([4,6,8]);
                Expect(factory.times(1,10,12)).to.deep.equal([10]);
                Expect(factory.times(3,0,-2)).to.deep.equal([0,-1,-2]);
                Expect(factory.times(-3)).to.deep.equal([]);
                Expect(factory.times(Infinity).limit(5)).to.deep.equal([0,0,0,0,0]);
                Expect(factory.times(Infinity, 2).limit(5)).to.deep.equal([2,2,2,2,2]);
                Expect(factory.times(Infinity, 2, 3).limit(5)).to.deep.equal([2,2,2,2,2]);
                Expect(factory.times(Infinity, 2, Infinity).limit(5)).to.deep.equal([2,2,2,2,2]);
                Expect(factory.times(Infinity, Infinity, Infinity).limit(5)).to.deep.equal([Infinity,Infinity,Infinity,Infinity,Infinity]);
                Expect(factory.times(5,0,Infinity)).to.deep.equal([0,NaN,NaN,NaN,Infinity]);
                Expect(factory.times(5,0,-Infinity)).to.deep.equal([0,NaN,NaN,NaN,-Infinity]);
                Expect(factory.times(5,Infinity,0)).to.deep.equal([Infinity,NaN,NaN,NaN,0]);
                Expect(factory.times(5,-Infinity,0)).to.deep.equal([-Infinity,NaN,NaN,NaN,0]);
                Expect(factory.times(NaN)).to.deep.equal([]);
                Expect(factory.times(5,NaN)).to.deep.equal([NaN,NaN,NaN,NaN,NaN]);
                Expect(factory.times(5,2,NaN)).to.deep.equal([2,NaN,NaN,NaN,NaN]);
                Expect(factory.times(5,NaN,7)).to.deep.equal([NaN,NaN,NaN,NaN,7]);
                Expect(factory.times(NaN,0,5)).to.deep.equal([]);
                Expect(factory.times(NaN,NaN,NaN)).to.deep.equal([]);
            }

            @test("should produce numbers via step")
            public step() {
                Expect(factory.step(3)).to.deep.equal([0,1,2]);
                Expect(factory.step(3,4)).to.deep.equal([4,5,6]);
                Expect(factory.step(3,4,8)).to.deep.equal([4,12,20]);
                Expect(factory.step(-3)).to.deep.equal([]);
                Expect(factory.step(3,-4)).to.deep.equal([-4,-3,-2]);
                Expect(factory.step(3,4,-2)).to.deep.equal([4,2,0]);
                Expect(factory.step(3,-4,-2)).to.deep.equal([-4,-6,-8]);
                Expect(factory.step(Infinity).limit(5)).to.deep.equal([0,1,2,3,4]);
                Expect(factory.step(-Infinity)).to.deep.equal([]);
                Expect(factory.step(Infinity,5).limit(5)).to.deep.equal([5,6,7,8,9]);
                Expect(factory.step(Infinity,5,2).limit(5)).to.deep.equal([5,7,9,11,13]);
                Expect(factory.step(3, Infinity)).to.deep.equal([Infinity, Infinity, Infinity]);
                Expect(factory.step(4, 0, Infinity)).to.deep.equal([0, Infinity, Infinity, Infinity]);
                Expect(factory.step(4, Infinity, Infinity)).to.deep.equal([Infinity, Infinity, Infinity, Infinity]);
                Expect(factory.step(4, -Infinity, Infinity)).to.deep.equal([-Infinity, NaN, NaN, NaN]);
                Expect(factory.step(Infinity, 2, Infinity).limit(4)).to.deep.equal([2, Infinity, Infinity, Infinity]);
                Expect(factory.step(Infinity, Infinity, 2).limit(3)).to.deep.equal([Infinity, Infinity, Infinity]);
                Expect(factory.step(Infinity, -Infinity, 2).limit(3)).to.deep.equal([-Infinity, -Infinity, -Infinity]);
                Expect(factory.step(Infinity, Infinity, Infinity).limit(3)).to.deep.equal([Infinity, Infinity, Infinity]);
                Expect(factory.step(NaN)).to.deep.equal([]);
                Expect(factory.step(5, NaN)).to.deep.equal([NaN,NaN,NaN,NaN,NaN]);
                Expect(factory.step(5, 1, NaN)).to.deep.equal([1,NaN,NaN,NaN,NaN]);
                Expect(factory.step(5, Infinity, NaN)).to.deep.equal([Infinity,NaN,NaN,NaN,NaN]);
                Expect(factory.step(5, -Infinity, NaN)).to.deep.equal([-Infinity,NaN,NaN,NaN,NaN]);
                Expect(factory.step(5, NaN, 2)).to.deep.equal([NaN,NaN,NaN,NaN,NaN]);
                Expect(factory.step(5, NaN, NaN)).to.deep.equal([NaN,NaN,NaN,NaN,NaN]);
                Expect(factory.step(NaN, NaN, NaN)).to.deep.equal([]);
            }

            @test("should repeat the given element")
            public repeat() {
                const obj = {id: 9};
                Expect(factory.repeat(0, NaN).limit(9)).to.deep.equal([]);
                Expect(factory.repeat(0).limit(9)).to.deep.equal([0,0,0,0,0,0,0,0,0]);
                Expect(factory.repeat(0, Infinity).limit(9)).to.deep.equal([0,0,0,0,0,0,0,0,0]);
                Expect(factory.repeat(1, -Infinity).limit(9)).to.deep.equal([]);
                Expect(factory.repeat(1, -1).limit(9)).to.deep.equal([]);
                Expect(factory.repeat(1, 0).limit(9)).to.deep.equal([]);
                Expect(factory.repeat(1, 0.8).limit(9)).to.deep.equal([]);
                Expect(factory.repeat(1, 1).limit(9)).to.deep.equal([1]);
                Expect(factory.repeat(1, 2).limit(9)).to.deep.equal([1,1]);
                Expect(factory.repeat(1, 2.8).limit(9)).to.deep.equal([1,1]);
                Expect(factory.repeat(1, 5).limit(9)).to.deep.equal([1,1,1,1,1]);
                Expect(factory.repeat(obj, 4).limit(9)).to.deep.equal([obj,obj,obj,obj]);
            }

            @test("should produce items with the given iterator")
            public iterate() {
                Expect(factory.iterate(NaN, i => i + 2, 0)).to.deep.equal([]);
                Expect(factory.iterate(0, i => i + 2, NaN)).to.deep.equal([]);
                Expect(factory.iterate(0, i => i + 2, 0)).to.deep.equal([]);
                Expect(factory.iterate(0, i => i + 2, 0.5)).to.deep.equal([]);
                Expect(factory.iterate(0, i => i + 2, 3)).to.deep.equal([0, 2, 4]);
                Expect(factory.iterate(0, i => i + 2, 3.5)).to.deep.equal([0, 2, 4]);
                Expect(factory.iterate(2, i => i + 2, 4)).to.deep.equal([2, 4, 6, 8]);
                Expect(factory.iterate(0, i => i + 2).limit(6)).to.deep.equal([0, 2, 4, 6, 8, 10]);
                Expect(factory.iterate(0, i => i + 2, Infinity).limit(6)).to.deep.equal([0, 2, 4, 6, 8, 10]);
            }

            @test("should produce items with the given generator")
            public generate() {
                const generator = (index: number) => index*index;
                Expect(factory.generate(generator, NaN)).to.deep.equal([]);
                Expect(factory.generate(generator, -Infinity)).to.deep.equal([]);
                Expect(factory.generate(generator, 0)).to.deep.equal([]);
                Expect(factory.generate(generator, 0.9)).to.deep.equal([]);
                Expect(factory.generate(generator, -99999999999)).to.deep.equal([]);
                Expect(factory.generate(generator, 5)).to.deep.equal([0,1,4,9,16]);
                Expect(factory.generate(generator, 5.4)).to.deep.equal([0,1,4,9,16]);
                Expect(factory.generate(generator).limit(6)).to.deep.equal([0,1,4,9,16,25]);
                Expect(factory.generate(generator, Infinity).limit(7)).to.deep.equal([0,1,4,9,16,25,36]);
            }

            @test("should produce random numbers")
            public random() {
                Expect(factory.random(NaN)).to.be.empty;
                Expect(factory.random(-99999999999)).to.be.empty;
                Expect(factory.random(0)).to.be.empty;
                Expect(factory.random(5)).to.have.length(5);
                Expect(factory.random(Infinity).limit(99)).to.have.length(99);
            }

            @test("should stream object key-value pairs")
            public fromObject() {
                Expect(factory.fromObject({})).to.deep.equal([]);
                Expect(factory.fromObject({foo: 42})).to.deep.equal([
                    {key: "foo", value: 42},
                ]);
                Expect(factory.fromObject({foo: 42, bar: 4})).to.deep.equal([
                    {key: "foo", value: 42},
                    {key: "bar", value: 4},
                ]);
                Expect(factory.fromObject(new WithProto() as any)).to.deep.equal([
                    {key: "foo", value: 42},
                ]);
            }

            @test("should stream object keys")
            public fromObjectKeys() {
                Expect(factory.fromObjectKeys({})).to.deep.equal([]);
                Expect(factory.fromObjectKeys({foo: 42})).to.deep.equal(["foo"]);
                Expect(factory.fromObjectKeys({foo: 42, bar: 4})).to.deep.equal(["foo", "bar"]);
                Expect(factory.fromObjectKeys(new WithProto())).to.deep.equal(["foo"]);
            }

            @test("should stream object values")
            public fromObjectValues() {
                Expect(factory.fromObjectValues({})).to.deep.equal([]);
                Expect(factory.fromObjectValues({foo: 42})).to.deep.equal([42]);
                Expect(factory.fromObjectValues({foo: 42, bar: 4})).to.deep.equal([42, 4]);
                Expect(factory.fromObjectValues(new WithProto())).to.deep.equal([42]);
            }
        }
        hack.push(IStreamFactoryTest);
    });
});