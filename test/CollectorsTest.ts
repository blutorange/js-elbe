/* tslint:disable */

import { expect } from "chai";
import { suite, test } from "mocha-typescript";

import { InplaceStreamFactory, TypesafeStreamFactory } from "../StreamFactory";
import { Collectors } from "../Collectors";
import { StreamTest, toObj } from "./utils";

function  strLen(str: string): number {
    return str.length;
}

export const hack: any[] = [];
[InplaceStreamFactory, TypesafeStreamFactory].forEach((factory, i) => {
    @suite(`ICollectors with ${i === 0 ? "InplaceStreamFactory" : "TypesafeStreamFactory"}`)
    class ICollectorsTest extends StreamTest {
        constructor() {
            super(factory);
        }

        @test("should collect items into an array")
        public toArray() {
            this.terminal([], s => s.collect(Collectors.toArray())).to.deep.equal([]);
            this.terminal([0,4,0], s => s.collect(Collectors.toArray())).to.deep.equal([0,4,0]);
        }

        @test("should collect items into a set")
        public toSet() {
            this.terminal([], s => s.collect(Collectors.toSet())).to.be.empty;
            this.terminal([0,1], s => s.collect(Collectors.toSet())).to.contain(0).and.to.contain(1);
            this.terminal([0,1,0], s => s.collect(Collectors.toSet())).to.contain(0).and.to.contain(1);            
        }

        @test("should collect items into a count")
        public count() {
            this.terminal([], s => s.collect(Collectors.count())).to.equal(0);
            this.terminal([0], s => s.collect(Collectors.count())).to.equal(1);
            this.terminal([1,1], s => s.collect(Collectors.count())).to.equal(2);
        }

        @test("should collect items into their sum")
        public sum() {
            this.terminal([], s => s.collect(Collectors.sum())).to.be.NaN;
            this.terminal([1], s => s.collect(Collectors.sum())).to.equal(1);
            this.terminal([1,2,3], s => s.collect(Collectors.sum())).to.equal(6);
            this.terminal([1,3,1], s => s.collect(Collectors.sum())).to.equal(5);
            this.terminal([1,Infinity,1], s => s.collect(Collectors.sum())).to.equal(Infinity);
            this.terminal([1,NaN,1], s => s.collect(Collectors.sum())).to.be.NaN;
            this.terminal(["f"], s => s.collect(Collectors.sum(strLen))).to.equal(1);
            this.terminal(["f","fo","foo"], s => s.collect(Collectors.sum(strLen))).to.equal(6);
            this.terminal(["f","foo","f"], s => s.collect(Collectors.sum(strLen))).to.equal(5);
        }

        @test("should collect items into their product")
        public multiply() {
            this.terminal([], s => s.collect(Collectors.multiply())).to.be.NaN;
            this.terminal([1], s => s.collect(Collectors.multiply())).to.equal(1);
            this.terminal([1,2,4], s => s.collect(Collectors.multiply())).to.equal(8);
            this.terminal([1,3,1], s => s.collect(Collectors.multiply())).to.equal(3);
            this.terminal(["f"], s => s.collect(Collectors.multiply(strLen))).to.equal(1);
            this.terminal(["f","fo","foos"], s => s.collect(Collectors.multiply(strLen))).to.equal(8);
            this.terminal(["foobar","foo","bar"], s => s.collect(Collectors.multiply(strLen))).to.equal(54);
        }

        @test("should collect items into their average")
        public average() {
            this.terminal([], s => s.collect(Collectors.average())).to.be.NaN;
            this.terminal([1], s => s.collect(Collectors.average())).to.equal(1);
            this.terminal([1,2,3], s => s.collect(Collectors.average())).to.equal(2);
            this.terminal([1,3,1], s => s.collect(Collectors.average())).to.equal(5/3);
 
            this.terminal(["f"], s => s.collect(Collectors.average(strLen))).to.equal(1);
            this.terminal(["f","fo","foo"], s => s.collect(Collectors.average(strLen))).to.equal(2);
            this.terminal(["f","foo","f"], s => s.collect(Collectors.average(strLen))).to.equal(5/3);
        }

        @test("should collect items into their geometric average")
        public averageGeometrically() {
            this.terminal([], s => s.collect(Collectors.averageGeometrically())).to.be.NaN;
            this.terminal([1], s => s.collect(Collectors.averageGeometrically())).to.equal(1);
            this.terminal([1,2,3], s => s.collect(Collectors.averageGeometrically())).to.equal(Math.pow(1*2*3,1/3));
            this.terminal([1,3,7], s => s.collect(Collectors.averageGeometrically())).to.equal(Math.pow(1*3*7,1/3));

            this.terminal(["f"], s => s.collect(Collectors.averageGeometrically(strLen))).to.equal(1);
            this.terminal(["f","fo","foo"], s => s.collect(Collectors.averageGeometrically(strLen))).to.equal(Math.pow(1*2*3,1/3));
            this.terminal(["bar","foo","foobar"], s => s.collect(Collectors.averageGeometrically(strLen))).to.equal(Math.pow(3*3*6,1/3));
        }

        @test("should collect items into their harmonic average")
        public averageHarmonically() {
            this.terminal([], s => s.collect(Collectors.averageHarmonically())).to.be.NaN;
            this.terminal([1], s => s.collect(Collectors.averageHarmonically())).to.equal(1);
            this.terminal([1,2,3], s => s.collect(Collectors.averageHarmonically())).to.equal(3/(1+1/2+1/3));
            this.terminal([1,3,1], s => s.collect(Collectors.averageHarmonically())).to.equal(3/(1+1/3+1));

            this.terminal(["f"], s => s.collect(Collectors.averageHarmonically(strLen))).to.equal(1);
            this.terminal(["f","fo","foo"], s => s.collect(Collectors.averageHarmonically(strLen))).to.equal(3/(1+1/2+1/3));
            this.terminal(["f","foo","f"], s => s.collect(Collectors.averageHarmonically(strLen))).to.equal(3/(1+1/3+1));
        }

        @test("should collect number into a statistical summary")
        public summarize() {
            const stats1 = factory.stream([0,4,0,5,1,2,3,4]).collect(Collectors.summarize());
            expect(stats1.toJSON()).to.deep.equal({
                average: 19/8,
                count: 8,
                max: 5,
                min: 0,
                sum: 19,
                variance: 71/8-19*19/(8*8)
            });

            const stats2 = factory.stream([]).collect(Collectors.summarize());
            expect(stats2.toJSON()).to.deep.equal({
                average: NaN,
                count: 0,
                max: NaN,
                min: NaN,
                sum: NaN,
                variance: NaN,
            });
        }

        @test("should collect the items into a map")
        public toMap() {
            const data = [[0, "foo"], [1, "bar"], [0, "foobar"]]
            this.terminal(data, s => s.collect(Collectors.toMap(x=>x,x=>x))).to.be.instanceof(Map);
            this.terminal(data, s => toObj(s.collect(Collectors.toMap(x => x[0], x => x[1])))).to.deep.equal({
                0: "foo",
                1: "bar",
            });
            this.terminal(data, s => toObj(s.collect(Collectors.toMap(x => x[0], x => x[1], (s1, s2) => s1 + "," + s2)))).to.deep.equal({
                0: "foo,foobar",
                1: "bar",
            });
        }

        @test("should group and collect the items")
        public groupDown() {
            const c = Collectors.groupDown<number, number, any, number>(x => x % 3, Collectors.sum());
            this.terminal([], s => s.collect(c)).to.be.instanceof(Map);
            this.terminal([], s => toObj(s.collect(c))).to.deep.equal({});
            this.terminal([1,2,3,4,5,6,7,8,9,10], s => toObj(s.collect(c))).to.deep.equal({
                0: 3+6+9,
                1: 1+4+7+10,
                2: 2+5+8
            });
            this.terminal([1,2], s => toObj(s.collect(c))).to.deep.equal({
                1: 1,
                2: 2,
            });
        }

        @test("should map the items before passing them on to the downstream")
        public map() {
            const c = Collectors.map<number, number, any, number>(i => i*i, Collectors.sum());
            this.terminal([], s => s.collect(c)).to.deep.equal(NaN);
            this.terminal([1,2,3], s => s.collect(c)).to.deep.equal(14);
        }

        @test("should partition and collect the items")
        public partitionDown() {
            const c = Collectors.partitionDown<number, any, number>(x => x % 2 === 1, Collectors.sum());
            this.terminal([], s => s.collect(c)).to.deep.equal({false: NaN, true: NaN});
            this.terminal([1,2,3,4,5,6,7,8,9,10], s => s.collect(c)).to.deep.equal({
                false: 2+4+6+8+10,
                true: 1+3+5+7+9,
            });
        }
    }
    hack.push(ICollectorsTest);
});