/* tslint:disable */

import { expect } from "chai";
import { suite, test } from "mocha-typescript";

import { ITry } from "../Interfaces";
import { InplaceStreamFactory, TypesafeStreamFactory } from "../StreamFactory";
import { StreamTest } from "./utils";
import { TryFactory } from '../main';

function trial<T>(item: T): T {
    if (item == null || typeof item === "number" && item === -999) {
        throw new Error("no item");
    }
    return item;
}

const NOOP = () => {};

export const hack: any[] = [];
[InplaceStreamFactory, TypesafeStreamFactory].forEach((factory, i) => {
    @suite(`ITryStream with ${i === 0 ? "InplaceStreamFactory" : "TypesafeStreamFactory"}`)
    class ITryStreamTest extends StreamTest {
        constructor() {
            super(factory);
        }

        @test("should map to the item or throw")
        public orThrow() {
            this.stream([], s => s.try(trial).orThrow()).to.deep.equal([]);
            this.stream([1,2,3,4], s => s.try(trial).orThrow()).to.deep.equal([1,2,3,4]);
            this.action([1,2,,4], s => s.try(trial).orThrow().end()).to.throw();
            this.action([1,,3,4], s => s.try(trial).orThrow().end()).to.throw();
        }

        @test("should map to the item or use default")
        public orElse() {
            this.stream<number, number>([], s => s.try(trial).orElse(-1)).to.deep.equal([]);
            this.stream([1,2,3,4], s => s.try(trial).orElse(-1)).to.deep.equal([1,2,3,4]);
            this.stream([1,2,,4], s => s.try(trial).orElse(-1)).to.deep.equal([1,2,-1,4]);
            this.stream([-1,2,,4], s => s.try(trial).orElse(-1)).to.deep.equal([-1,2,-1,4]);
        }

        @test("should map to the item and discard errors")
        public discardError() {
            this.stream([], s => s.try(trial).discardError(NOOP)).to.deep.equal([]);
            this.stream([1,2,3,4], s => s.try(trial).discardError(NOOP)).to.deep.equal([1,2,3,4]);
            this.stream([1,2,,4], s => s.try(trial).discardError(NOOP)).to.deep.equal([1,2,4]);
            this.stream([,2,,4], s => s.try(trial).discardError(NOOP)).to.deep.equal([2,4]);
            let error;
            this.stream([1,2,,4], s => s.try(trial).discardError(e => error = e)).to.deep.equal([1,2,4]);
            expect(error).to.not.be.undefined;

            const oldError = console.error;
            const arr: any[] = [];
            console.error = (e: Error) => arr.push(String(e.name));
            this.terminal([1,2,,4], s => s.try(trial).discardError().end());
            expect(arr).to.deep.equal(["Error"]);
            console.error = oldError;
        }

        @test("should try again to retrieve a value or fail otherwise")
        public orTry() {
            this.stream<number, ITry<number>>([], s => s.try(trial).orTry(e => 9)).to.deep.equal([]);
            this.action([], s => s.try(trial).orTry(e => {throw new Error}).end()).to.not.throw();

            this.stream([1,2,,3], s => s.try(trial).orTry(e => 9).orThrow()).to.deep.equal([1,2,9,3]);
            this.action([1,2,,3], s => s.try(trial).orTry(e => {throw new Error}).orThrow().end()).to.throw();
        }

        @test("should include items that were produced successfully")
        public include() {
            this.stream<number, number>([], s => s.try(trial).include(i => i < 3).orElse(-1)).to.deep.equal([]);
            this.stream([1,2,-999,4], s => s.try(trial).include(i => i < 3).orElse(-1)).to.deep.equal([1,2,-1,-1]);
        }

        @test("should convert items with the given converter and backup handler")
        public convert() {
            this.stream([1,2,,4], s => s.try(trial).convert(i => String(i)).orElse("x")).to.deep.equal(["1","2","x","4"]);
            this.stream([1,2,,4], s => s.try(trial).convert(i => String(i), e => e.name).orThrow()).to.deep.equal(["1","2","Error","4"]);
            this.stream([1,2,,4], s => s.try(trial).convert(i => {throw new Error}, e => e.name).orThrow()).to.deep.equal(["Error","Error","Error","Error"]);
        }

        @test("should flat convert items with the given converter and backup handler")
        public flatConvert() {
            this.stream([1,2,,4], s => s.try(trial).flatConvert(i => TryFactory.of(() => String(i))).orElse("x")).to.deep.equal(["1","2","x","4"]);
            this.stream([1,2,,4], s => s.try(trial).flatConvert(i => TryFactory.of(() => String(i)), e => TryFactory.success(e.name)).orThrow()).to.deep.equal(["1","2","Error","4"]);
            this.stream([1,2,,4], s => s.try(trial).flatConvert(i => TryFactory.error(new Error), e => TryFactory.success(e.name)).orThrow()).to.deep.equal(["Error","Error","Error","Error"]);
        }

        @test("should call the handler on error")
        public onError() {
            const error: any[] = [];
            factory.stream([1,,,4,5,]).try(trial).onError(e => error.push(String(e.name))).end();
            expect(error).to.deep.equal(["Error", "Error"]);
            factory.stream([1,,,4,5,]).try(trial).onError(e => error.push(String(e.name))).end();
            expect(error).to.deep.equal(["Error", "Error", "Error", "Error"]);
        }

        @test("should call the handler on success and on error")
        public onSuccess() {
            const success: any[] = [];
            const error: any[] = [];
            factory.stream([1,,,4,5,]).try(trial).onSuccess(i => success.push(i), e => error.push(String(e.name))).end();
            expect(success).to.deep.equal([1,4,5]);
            expect(error).to.deep.equal(["Error", "Error"]);
            factory.stream([1,,,4,5,]).try(trial).onSuccess(i => success.push(i)).end();
            expect(success).to.deep.equal([1,4,5,1,4,5]);
            expect(error).to.deep.equal(["Error", "Error"]);
        }

        @test("should call the handler for each successful and erroneous result")
        public forEachResult() {
            const success: any[] = [];
            const error: any[] = [];
            
            factory.stream([1,,,4,5,]).try(trial).forEachResult(i => success.push(i), e => error.push(String(e.name)));
            expect(success).to.deep.equal([1,4,5]);
            expect(error).to.deep.equal(["Error", "Error"]);

            factory.stream([1,,,4,5,]).try(trial).forEachResult(i => success.push(i), NOOP);
            expect(success).to.deep.equal([1,4,5,1,4,5]);
            expect(error).to.deep.equal(["Error", "Error"]);

            const oldError = console.error;
            console.error = (e: Error) => error.push(String(e.name));
            factory.stream([1,,,4,5,]).try(trial).forEachResult(i => success.push(i));
            expect(success).to.deep.equal([1,4,5,1,4,5,1,4,5]);
            expect(error).to.deep.equal(["Error", "Error", "Error", "Error"]);
            console.error = oldError;
        }

    }
    hack.push(ITryStreamTest);
});

