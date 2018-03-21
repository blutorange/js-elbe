/* tslint:disable */
import { expect } from "chai";
import { suite, test } from "mocha-typescript";

import { InplaceStreamFactory, TypesafeStreamFactory } from "../StreamFactory";
import { TryFactory } from "../TryFactory";
import { StreamTest, expectTry } from "./utils";

export const hack: any[] = [];
[InplaceStreamFactory, TypesafeStreamFactory].forEach((factory, i) => {
    @suite(`ITry with ${i === 0 ? "InplaceStreamFactory" : "TypesafeStreamFactory"}`)
    class ITryTest extends StreamTest {
        constructor() {
            super(factory);
        }

        @test("should create a new erronous Try")
        public error() {
            expectTry(TryFactory.error("bad"), false, expect => expect.to.include({message: "bad"}));
            expectTry(TryFactory.error(new Error("bad")), false, expect => expect.to.include({message: "bad"}));
        }

        @test("should create a new flat try")
        public flatOf() {
            expectTry(TryFactory.flatOf(() => TryFactory.success(10)), true, expect => expect.to.equal(10));
            expectTry(TryFactory.flatOf(() => TryFactory.error("bad")), false, expect => expect.to.include({message: "bad"}));
            expectTry(TryFactory.flatOf(() => {throw new Error("bad")}), false, expect => expect.to.include({message: "bad"}));
        }

        @test("should return the value or the error")
        public unwrap() {
            expect(TryFactory.success(5).unwrap()).to.equal(5);
            expect(TryFactory.error("foo").unwrap()).to.include({message: "foo"});
        }

        @test("should iterate the value or the error")
        public iterate() {
            for (const r of TryFactory.success(5).iterate())
                expect(r).to.equal(5);
            for (const r of TryFactory.error("foo").iterate())
                expect(r).to.include({message: "foo"});
        }

        @test("should stream the value or the error")
        public _stream() {
            expect(TryFactory.success(5).stream().first()).to.equal(5);
            expect(TryFactory.success(5).stream(factory).first()).to.equal(5);
            expect(TryFactory.error("foo").stream().first()).to.include({message: "foo"});
            expect(TryFactory.error("foo").stream(factory).first()).to.include({message: "foo"});
        }

        @test("should call the catch handler on error")
        public catch() {
            const s: any = [];
            TryFactory.success(5).catch(e => s.push(e));
            expect(s).to.be.empty;
            expectTry(TryFactory.error("bad").catch(e => e.message), true, expect => expect.to.equal("bad"));
            expectTry(TryFactory.error("bad").catch(e => TryFactory.success(e.message)), true, expect => expect.to.equal("bad"));
            expectTry(TryFactory.error("bad").catch(e => TryFactory.error(e.message)), false, expect => expect.to.include({message: "bad"}));
        }
        
        @test("should call the success handler on success")
        public then() {
            const s: any = [];
            TryFactory.error<any>("bad").then(x => s.push(x));
            expect(s).to.be.empty;
            expectTry(TryFactory.success(21).then(x => x+x), true, expect => expect.to.equal(42));
            expectTry(TryFactory.success(21).then(x => TryFactory.success(x+x)), true, expect => expect.to.equal(42));
            expectTry(TryFactory.success(21).then(x => TryFactory.error(String(x+x))), false, expect => expect.to.include({message: "42"}));
            expectTry(TryFactory.success(2).then(x=>x*2).then(x=>x*2).then(x=>x*2), true, expect => expect.to.equal(16));
        }

        @test("should return a concise string representation")
        public _toString() {
            expect(TryFactory.success(5).toString()).to.equal("Try[success=true,5]");
            expect(TryFactory.error("bad").toString()).to.equal("Try[success=false,Error: bad]");
        }

        @test("should return a JSON object representation of itself")
        public _toJSON() {
            expect(TryFactory.success(5).toJSON()).to.deep.equal({
                success: true,
                result: 5
            });
            expect(TryFactory.error("bad").toJSON()).to.deep.equal({
                success: false,
                result: "Error: bad",
            });
        }
    }
    hack.push(ITryTest);
});