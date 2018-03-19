/* tslint:disable */

import { expect } from "chai";
import { suite, test } from "mocha-typescript";

import { InplaceStreamFactory, TypesafeStreamFactory } from "../StreamFactory";
import { Expect, setOf, toObj, StreamTest} from "./utils";

export const hack: any[] = [];
[InplaceStreamFactory, TypesafeStreamFactory].forEach((factory, i) => {
    @suite(`IStream with ${i === 0 ? "InplaceStreamFactory" : "TypesafeStreamFactory"}`)
    class IStreamTest extends StreamTest {
        constructor() {
            super(factory);
        }

        @test("should chunk items according to the classifier")
        public chunk() {
            this.stream([], s => s.chunk(i => i))
                .to.deep.equal([]);
            this.stream([0, 1, 2, 3, 4], s => s.chunk(i => i & 10))
                .to.deep.equal([[0, 1], [2, 3], [4]]);
            this.stream([0, 1, 2, 3], s => s.chunk(i => i & 10))
                .to.deep.equal([[0, 1], [2, 3]]);
        }

        @test("should add an index to the items")
        public index() {
            this.stream([], s => s.index()).to.deep.equal([]);
            this.stream([4,5,6], s => s.index()).to.deep.equal([
                {index: 0, value: 4},
                {index: 1, value: 5},
                {index: 2, value: 6},
            ]);
        }

        @test("should filter items with the given filter")
        public filter() {
            this.stream([], s => s.filter(i => true))
                .to.deep.equal([]);
            this.stream([0, 1, 2, 3, 4, 5, 6], s => s.filter(i => i < 3))
                .to.deep.equal([0, 1, 2]);
        }

        @test("should cycle the given amount of times")
        public cycle() {
            this.stream([], s => s.cycle(3))
                .to.deep.equal([]);
            this.stream([0, 1, 2], s => s.cycle().limit(10))
                .to.deep.equal([0, 1, 2, 0, 1, 2, 0, 1, 2, 0]);
            this.stream([0, 1, 2], s => s.cycle(3))
                .to.deep.equal([0, 1, 2, 0, 1, 2, 0, 1, 2]);
            this.stream([0, 1, 2], s => s.cycle(-2))
                .to.deep.equal([]);
        }

        @test("should skip the given amount of items")
        public skip() {
            this.stream([], s => s.skip(0)).to.deep.equal([]);
            this.stream([1,2,3], s => s.skip(0)).to.deep.equal([1,2,3]);
            this.stream([1,2,3], s => s.skip(2)).to.deep.equal([3]);
            this.stream([1,2,3], s => s.skip(3)).to.deep.equal([]);
            this.stream([1,2,3], s => s.skip(10)).to.deep.equal([]);
            this.stream([1,2,3], s => s.skip(-3)).to.deep.equal([1,2,3]);
            this.stream(this.inf(), s => s.skip(2).limit(3)).to.deep.equal([2,3,4]);
        }

        @test("should concat the items to the stream")
        public concat() {
            this.stream([], s => s.concat([])).to.deep.equal([]);
            this.stream([], s => s.concat([1,2])).to.deep.equal([1,2]);
            this.stream([1,2], s => s.concat([])).to.deep.equal([1,2]);
            this.stream([1,2], s => s.concat([3,4])).to.deep.equal([1,2,3,4]);
            this.stream([1,2], s => s.concat([3,4],[5], [6,7,8,9,10])).to.deep.equal([1,2,3,4,5,6,7,8,9,10]);
        }

        @test("should reverse the items")
        public reverse() {
            this.stream([], s => s.reverse()).to.deep.equal([]);
            this.stream([1], s => s.reverse()).to.deep.equal([1]);
            this.stream([1,2,3], s => s.reverse()).to.deep.equal([3,2,1]);
            this.stream([50,48,49], s => s.reverse()).to.deep.equal([49,48,50]);
        }

        @test("should allow forking the stream and use it multiple times")
        public fork() {
            const stream = factory.generate(Math.random, Infinity);
            const first5 = stream.fork().limit(5).toArray();
            Expect(stream.fork().limit(5)).to.deep.equal(first5);
            Expect(stream.fork().limit(1)).to.deep.equal(first5.slice(0,1));
            Expect(stream.fork().limit(2)).to.deep.equal(first5.slice(0,2));
            Expect(stream.fork().limit(3)).to.deep.equal(first5.slice(0,3));
            Expect(stream.limit(5)).to.deep.equal(first5);
            expect(() => stream.toArray()).to.throw();

            const s2 = factory.stream([1,2]).map(i => i + i);
            const it = s2.fork()[Symbol.iterator]();
            expect(it.next().value).to.equal(2);
            expect(it.next().value).to.equal(4);
            expect(it.next().value).to.be.undefined;
            expect(it.next().value).to.be.undefined;
        }

        @test("should filter out duplicates")
        public unique() {
            const u1 = {id: 1};
            const u2 = {id: 2};
            const u22 = {id: 2};
            const u222 = {id: 2};
            const u3 = {id: 3};
            const u33 = {id: 3};
            this.stream([], s => s.unique()).to.deep.equal([]);
            this.stream([1,2,2], s => s.unique()).to.deep.equal([1,2]);
            this.stream([1,2,2,3,2,3], s => s.unique()).to.deep.equal([1,2,3]);
            this.stream([u1,u2,u22,u3,u222,u33], s => s.unique((lhs, rhs) => lhs.id - rhs.id)).to.include(u1).and.include(u2).and.include(u3).and.not.include(u22).and.not.include(u222).and.not.include(u33);
            this.stream([u33,u222,u3,u22,u2,u1], s => s.unique((lhs, rhs) => lhs.id - rhs.id)).to.include(u1).and.include(u222).and.include(u33).and.not.include(u22).and.not.include(u2).and.not.include(u3);
        }

        @test("should filter out duplicates by a given key")
        public uniqueBy() {
            const u1 = {id: 1};
            const u2 = {id: 2};
            const u22 = {id: 2};
            const u222 = {id: 2};
            const u3 = {id: 3};
            const u33 = {id: 3};
            this.stream([], s => s.uniqueBy()).to.deep.equal([]);
            this.stream([1,2,2], s => s.uniqueBy()).to.deep.equal([1,2]);
            this.stream([1,2,2,3,2,3], s => s.uniqueBy()).to.deep.equal([1,2,3]);
            this.stream([3,2,3,2,2,1], s => s.uniqueBy()).to.deep.equal([3,2,1]);
            this.stream([u1,u2,u22,u3,u222,u33], s => s.uniqueBy(user => user.id)).to.include(u1).and.include(u2).and.include(u3).and.not.include(u22).and.not.include(u222).and.not.include(u33);
            this.stream([1,2,3], s => s.cycle(Infinity).uniqueBy().limit(3)).to.deep.equal([1,2,3]);
        }

        @test("should sort the items")
        public sort() {
            this.stream([], s => s.sort()).to.deep.equal([]);
            this.stream([1], s => s.sort()).to.deep.equal([1]);
            this.stream([3,1,2], s => s.sort()).to.deep.equal([1,2,3]);
            this.stream([1,2,3], s => s.sort()).to.deep.equal([1,2,3]);
            this.stream([3,1,2], s => s.sort((lhs, rhs) => rhs -lhs)).to.deep.equal([3,2,1]);
            this.stream([1,2,3], s => s.sort((lhs, rhs) => rhs -lhs)).to.deep.equal([3,2,1]);
            this.stream([50,48,49], s => s.sort()).to.deep.equal([48,49,50]);
        }

        @test("should slice the items into slices of a given length")
        public slice() {
            this.stream([], s => s.slice(2)).to.deep.equal([]);
            this.stream([1,2,3,4,5,6], s => s.slice(-1)).to.deep.equal([[1],[2],[3],[4],[5],[6]]);
            this.stream([1,2,3,4,5,6], s => s.slice(0)).to.deep.equal([[1],[2],[3],[4],[5],[6]]);
            this.stream([1,2,3,4,5,6], s => s.slice(1)).to.deep.equal([[1],[2],[3],[4],[5],[6]]);
            this.stream([1,2,3,4,5,6], s => s.slice(2)).to.deep.equal([[1,2],[3,4],[5,6]]);
            this.stream([1,2,3,4,5,6], s => s.slice(3)).to.deep.equal([[1,2,3],[4, 5,6]]);
            this.stream([1,2,3,4,5,6], s => s.slice(4)).to.deep.equal([[1,2,3,4],[5,6]]);
            this.stream([1,2,3,4,5,6], s => s.slice(5)).to.deep.equal([[1,2,3,4,5],[6]]);
            this.stream([1,2,3,4,5,6], s => s.slice(6)).to.deep.equal([[1,2,3,4,5,6]]);
            this.stream([1,2,3,4,5,6], s => s.slice(7)).to.deep.equal([[1,2,3,4,5,6]]);
        }

        @test("should zip the items with another iterable")
        public zip() {
            this.stream([], s => s.zip([])).to.deep.equal([]);
            this.stream([1,2], s => s.zip([3,4])).to.deep.equal([[1,3], [2,4]]);
            this.stream([1,2], s => s.zip("xy")).to.deep.equal([[1,"x"], [2,"y"]]);
            this.stream([1,2], s => s.zip([3])).to.deep.equal([[1,3], [2,undefined]]);
            this.stream([1], s => s.zip([3,4])).to.deep.equal([[1,3], [undefined,4]]);
            this.stream([1], s => s.zip([2,3,4])).to.deep.equal([[1,2], [undefined, 3], [undefined, 4]]);
        }

        @test("should zip the items with all iterables")
        public zipSame() {
            this.stream([], s => s.zipSame([])).to.deep.equal([]);
            this.stream([1,2], s => s.zipSame([3,4])).to.deep.equal([[1,3], [2,4]]);
            this.stream([1,2], s => s.zipSame([3])).to.deep.equal([[1,3], [2,undefined]]);
            this.stream([1], s => s.zipSame([3,4])).to.deep.equal([[1,3], [undefined,4]]);
            this.stream([1], s => s.zipSame([2,3,4])).to.deep.equal([[1,2], [undefined, 3], [undefined, 4]]);

            this.stream([], s => s.zipSame([], [], [])).to.deep.equal([]);
            this.stream([1,2], s => s.zipSame([3,4], [5,6], [7,8])).to.deep.equal([[1,3,5,7], [2,4,6,8]]);
            this.stream([1,2], s => s.zipSame([], [5], [7])).to.deep.equal([[1,undefined,5,7], [2,undefined, undefined, undefined]]);
        }

        @test("should map the items")
        public map() {
            this.stream([], s => s.map(x => x)).to.deep.equal([]);
            this.stream([1,2,3], s => s.map(x => x)).to.deep.equal([1,2,3]);
            this.stream([1,2,3], s => s.map(x => x*x)).to.deep.equal([1,4,9]);
            this.stream(this.inf(), s => s.map(x => x*x).limit(4)).to.deep.equal([0,1,4,9]);
        }

        @test("should flat map the items")
        public flatMap() {
            this.stream([], s => s.flatMap(x => x)).to.deep.equal([]);
            this.stream(["foo", "bar"], s => s.flatMap(x => x)).to.deep.equal(["f", "o", "o", "b", "a", "r"]);
            this.stream([[1,2], [3,4]], s => s.flatMap(x => x)).to.deep.equal([1,2,3,4]);
        }

        @test("should reduce the items to one value")
        public reduce() {
            this.terminal([], s => s.reduce((s,x) => s, 2)).to.equal(2);
            this.terminal([0,1,2,3], s => s.reduce((s,x) => s + x, 0)).to.equal(6);
            this.terminal(factory.times(100, 1), s => s.reduce((s,x) => s + x, 0)).to.equal(5050);
        }

        @test("should reduce the items starting with the first item")
        public reduceSame() {
            this.terminal([], s => s.reduceSame((s,x) => s + x)).to.be.undefined;
            this.terminal([1,2,3], s => s.reduceSame((s,x) => s + x)).to.equal(6);
            this.terminal(factory.times(100, 1), s => s.reduceSame((s,x) => s + x)).to.equal(5050);
        }

        @test("should create a set of the items")
        public toSet() {
            const set = setOf(1,2,3);
            this.terminal([], s => s.toSet()).to.be.instanceof(Set).and.to.be.empty;
            this.terminal(set, s => s.toSet()).to.equal(set).and.contain(1).and.contain(2).and.contain(3);
            this.terminal(set, s => s.toSet(true)).to.contain(1).and.contain(2).and.contain(3).and.not.equal(set);
            this.terminal([1,2,3], s => s.toSet()).to.contain(1).and.contain(2).and.contain(3);
        }

        @test("should create a map of the items")
        public toMap() {
            this.terminal([], s => s.toMap(i => i, i => i)).to.be.instanceof(Map).and.to.be.empty;
            this.terminal([1,2,3], s => toObj(s.toMap(i => i, i => i))).to.deep.equal({1: 1, 2: 2, 3: 3});
            this.terminal([1,2,3], s => toObj(s.toMap(i => i*i, i => i))).to.deep.equal({1: 1, 4: 2, 9: 3});
            this.terminal([1,2,3], s => toObj(s.toMap(i => i, i => i*i))).to.deep.equal({1: 1, 2: 4, 3: 9});
        }

        @test("should finish the stream and apply all pending operations")
        public end() {
            this.action([], s => s.end()).to.not.throw();
            this.action([], s => {s.end(); s.nth(0)}).to.throw();
            {
                const buffer1: number[] = [];
                factory.stream([1,2,3]).map(i => i + i).visit(i => buffer1.push(i));
                expect(buffer1).to.deep.equal([]);
            }
            {
                const buffer2: number[] = [];
                factory.stream([1,2,3]).map(i => i + i).visit(i => buffer2.push(i)).end();
                expect(buffer2).to.deep.equal([2,4,6]);
            }
        }

        @test("should create an array of the items")
        public toArray() {
            const arr = [1,2,3];
            this.terminal([], s => s.toArray()).to.deep.equal([]);
            this.terminal("foo", s => s.toArray()).to.deep.equal(["f", "o", "o"]);
            this.terminal([1,2,3], s => s.toArray()).to.deep.equal([1,2,3]);
            this.terminal(this.inf(), s => s.limit(5).toArray()).to.deep.equal([0,1,2,3,4]);
            this.terminal(arr, s => s.toArray(false)).to.deep.equal([1,2,3]).and.to.equal(arr);
            this.terminal(arr, s => s.toArray(true)).to.not.equal(arr);
            this.terminal(arr, s => s.toArray(true)).to.deep.equal([1,2,3]);
        }

        @test("should report whether all items match the given predicate")
        public every() {
            this.terminal([], s => s.every(i => i < 3)).to.be.true;
            this.terminal([0, 1, 2], s => s.every(i => i < 3)).to.be.true;
            this.terminal([3, 4], s => s.every(i => i >2)).to.be.true;
            this.terminal([0, 1, 2, 3, 4], s => s.every(i => i < 3)).to.be.false;
        }

        @test("should report whether any item matches the given predicate")
        public some() {
            this.terminal([], s => s.some(i => i < 3)).to.be.false;
            this.terminal([0, 1, 2], s => s.some(i => i > 3)).to.be.false;
            this.terminal([3, 4], s => s.some(i => i < 3)).to.be.false;
            this.terminal([0, 1, 2, 3, 4], s => s.some(i => i < 3)).to.be.true;
            this.terminal([0, 1, 2, 3, 4], s => s.some(i => i > 3)).to.be.true;
        }

        @test("should report whether the stream contains the given item")
        public has() {
            this.terminal([], s => s.has(0)).to.be.false;
            this.terminal([0,1,2,3], s => s.has(-1)).to.be.false;
            this.terminal([0,1,2,3], s => s.has(0)).to.be.true;
            this.terminal([0,1,2,3], s => s.has(1)).to.be.true;
            this.terminal([0,1,2,3], s => s.has(2)).to.be.true;
            this.terminal([0,1,2,3], s => s.has(3)).to.be.true;
            this.terminal([0,1,2,3], s => s.has(4)).to.be.false;
        }

        @test("should find the index of the given element")
        public findIndex() {
            this.terminal([], s => s.findIndex(i => i === 0)).to.equal(-1);
            this.terminal([0,1,2,3], s => s.findIndex(i => i < 0)).to.equal(-1);
            this.terminal([0,1,2,3], s => s.findIndex(i => i === 0)).to.equal(0);
            this.terminal([0,1,2,3], s => s.findIndex(i => i === 1)).to.equal(1);
            this.terminal([0,1,2,3], s => s.findIndex(i => i === 2)).to.equal(2);
            this.terminal([0,1,2,3], s => s.findIndex(i => i === 3)).to.equal(3);
            this.terminal([0,1,2,3], s => s.findIndex(i => i > 3)).to.equal(-1);
        }

        @test("should find the element matching the predicate of the given element")
        public find() {
            this.terminal([], s => s.find(i => i === 0)).to.be.undefined;
            this.terminal([2,3,4], s => s.find(i => i < 2)).to.be.undefined;
            this.terminal([2,3,4], s => s.find(i => i === 2)).to.equal(2);
            this.terminal([2,3,4], s => s.find(i => i === 3)).to.equal(3);
            this.terminal([2,3,4], s => s.find(i => i > 3)).to.equal(4);
            this.terminal([2,3,4], s => s.find((_, idx) => idx === -1)).to.be.undefined;
            this.terminal([2,3,4], s => s.find((_, idx) => idx === 0)).to.equal(2);
            this.terminal([2,3,4], s => s.find((_, idx) => idx === 1)).to.equal(3);
            this.terminal([2,3,4], s => s.find((_, idx) => idx === 2)).to.equal(4);
        }

        @test("should find the minimum item")
        public min() {
            this.terminal([], s => s.min()).to.be.undefined;
            this.terminal([0], s => s.min()).to.be.equal(0);
            this.terminal([0,1,2], s => s.min()).to.be.equal(0);
            this.terminal([2,1,0], s => s.min()).to.be.equal(0);
            this.terminal([0,1,2], s => s.min((lhs, rhs) => rhs - lhs)).to.be.equal(2);
            this.terminal([2,1,0], s => s.min((lhs, rhs) => rhs - lhs)).to.be.equal(2);
        }

        @test("should find the maximum item")
        public max() {
            this.terminal([], s => s.max()).to.be.undefined;
            this.terminal([0], s => s.max()).to.be.equal(0);
            this.terminal([0,1,2], s => s.max()).to.be.equal(2);
            this.terminal([2,1,0], s => s.max()).to.be.equal(2);
            this.terminal([0,1,2], s => s.max((lhs, rhs) => rhs - lhs)).to.be.equal(0);
            this.terminal([2,1,0], s => s.max((lhs, rhs) => rhs - lhs)).to.be.equal(0);
        }

        @test("should find the minimum item by a comparison key")
        public minBy() {
            this.terminal([], s => s.minBy(i => i)).to.be.undefined;
            this.terminal([0], s => s.minBy(i => i)).to.equal(0);
            this.terminal([0,1,2,3,4,5], s => s.minBy(i => -i)).to.equal(5);
            this.terminal([5,4,3,2,1,0], s => s.minBy(i => -i)).to.equal(5);
        }

        @test("should find the maximum item by a comparison key")
        public maxBy() {
            this.terminal([], s => s.maxBy(i => i)).to.be.undefined;
            this.terminal([0], s => s.maxBy(i => i)).to.equal(0);
            this.terminal([0,1,2,3,4,5], s => s.maxBy(i => -i)).to.equal(0);
            this.terminal([5,4,3,2,1,0], s => s.maxBy(i => -i)).to.equal(0);
        }

        @test("should report whether no item matches the given predicate")
        public none() {
            this.terminal([], s => s.none(i => i < 3)).to.be.true;
            this.terminal([0, 1, 2], s => s.none(i => i > 3)).to.be.true;
            this.terminal([3, 4], s => s.none(i => i < 3)).to.be.true;
            this.terminal([0, 1, 2, 3, 4], s => s.none(i => i < 3)).to.be.false;
            this.terminal([0, 1, 2, 3, 4], s => s.none(i => i > 3)).to.be.false;
        }

        @test("should report the number of items")
        public size() {
            this.terminal([], s => s.size()).to.equal(0);
            this.terminal("f", s => s.size()).to.equal(1);
            this.terminal("foo", s => s.size()).to.equal(3);
        }

        @test("should return the nth item, if it exists")
        public nth() {
            this.terminal([], s => s.nth(0)).to.be.undefined;
            this.terminal([], s => s.nth(1)).to.be.undefined;
            this.terminal([], s => s.nth(Infinity)).to.be.undefined;
            this.terminal(this.inf(), s => s.nth(-1)).to.be.undefined;
            this.terminal(this.inf(), s => s.nth(1)).to.be.equal(1);
            this.terminal([1,2,3,4], s => s.nth(-1)).to.be.undefined;
            this.terminal([1,2,3,4], s => s.nth(1.5)).to.equal(2);
            this.terminal([1,2,3,4], s => s.nth(1)).to.equal(2);
            this.terminal([1,2,3,4], s => s.nth(3)).to.equal(4);
            this.terminal([1,2,3,4], s => s.nth(10)).to.be.undefined;
        }

        @test("should return the first item, if it exists")
        public first() {
            this.terminal([], s => s.first()).to.be.undefined;
            this.terminal([1,2,3,4], s => s.first()).to.equal(1);
            this.terminal(this.inf(), s => s.first()).to.equal(0);
            this.terminal([2,3,4], s => s.first()).to.equal(2);
        }

        @test("should return the last item, if it exists")
        public last() {
            this.terminal([], s => s.last()).to.be.undefined;
            this.terminal([1,2,3,4], s => s.last()).to.equal(4);
            this.terminal([2,3,4], s => s.last()).to.equal(4);
        }

        @test("should join the items")
        public join() {
            this.terminal([], s => s.join()).to.equal("");
            this.terminal([1,2,3], s => s.join()).to.equal("123");
            this.terminal([1,2,3], s => s.join(",")).to.equal("1,2,3");
            this.terminal([1,2,3], s => s.join(",", "[", undefined)).to.equal("[1,2,3");
            this.terminal([1,2,3], s => s.join(",", undefined, "]")).to.equal("1,2,3]");
            this.terminal([1,2,3], s => s.join(",", "[", "]")).to.equal("[1,2,3]");
            this.terminal([1,2,3], s => s.map(i => `<li>${i}</li>`).join("\n","<ul>", "</ul>")).to.equal("<ul><li>1</li>\n<li>2</li>\n<li>3</li></ul>");
        }


        @test("should partition the items into two groups")
        public partition() {
            const u1 = {id: 1, name: "foo"};
            const u2 = {id: 2, name: "foobar"};
            const u3 = {id: 3, name: "baz"};
            const u4 = {id: 4, name: "bar"};
            this.terminal([], s => s.partition(i => true)).to.deep.equal({
                false: [],
                true: []
            });
            this.terminal([0,1,2,3,4,5,6,7,8,9,10], s => s.partition(i => i % 2 === 1)).to.deep.equal({
                false: [0,2,4,6,8,10],
                true: [1,3,5,7,9]
            });
            this.terminal([u3,u1,u4,u2], s => s.partition(user => user.name.startsWith("f"))).to.deep.equal({
                false: [u3, u4],
                true: [u1, u2]
            });
        }

        @test("should group the items")
        public group() {
            const u1 = {id: 1, name: "foo"};
            const u2 = {id: 2, name: "bar"};
            const u3 = {id: 3, name: "foo"};
            const u4 = {id: 4, name: "bar"};
            this.terminal([], s => toObj(s.group(i => i))).to.deep.equal({});
            this.terminal([0,1,2,3,4,5,6,7,8,9,10], s => toObj(s.group(i => i%3))).to.deep.equal({
                0: [0,3,6,9],
                1: [1,4,7,10],
                2: [2,5,8],
            });
            this.terminal([u1,u2,u3,u4], s => toObj(s.group(user => user.name))).to.deep.equal({
                foo: [u1, u3],
                bar: [u2, u4]
            });
        }

        @test("should create a promise for all items")
        public async promise() {
            Expect(await this.promiseMe([], s => s.promise(i => Promise.resolve(i)))).to.deep.equal([]);
            Expect(await this.promiseMe([1,2,3], s => s.promise(i => Promise.resolve(i*i)))).to.deep.equal([1,4,9]);
        }
    }
    hack.push(IStreamTest);
});
