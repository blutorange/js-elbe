/* tslint:disable */

import { expect } from "chai";
import { monkeyPatch } from "../monkeypatch";

function f(x: any): any {
    return x;
}

[false, true, undefined].forEach(inplace => {
    if (inplace === undefined) {
        monkeyPatch();
    }
    else {
        monkeyPatch(inplace);
    }

    expect(f("").stream().toArray()).to.deep.equal([]);
    expect(f("foo").stream().toArray()).to.deep.equal(["f", "o", "o"]);

    expect(f([]).stream().map((i: number) => i *i).toArray()).to.deep.equal([]);
    expect(f([1,2,3]).stream().map((i: number) => i *i).toArray()).to.deep.equal([1, 4, 9]);

    const set1 = new Set();
    expect(f(set1).stream().map((i: number) => i *i).toArray()).to.deep.equal([]);
    const set2 = new Set([1,2,3]);
    expect(f(set2).stream().map((i: number) => i *i).toArray()).to.deep.equal([1, 4, 9]);

    const map1 = new Map();
    expect(f(map1).stream().toArray()).to.deep.equal([]);
    const map2 = new Map();
    map2.set("foo", 1);
    map2.set("bar", 2);
    expect(f(map2).stream().toArray()).to.deep.equal([["foo", 1], ["bar", 2]]);

    expect(f({}).stream().toArray()).to.deep.equal([]);
    expect(f({foo: 1, bar: 2}).stream().toArray()).to.deep.equal([
        {key: "foo", value: 1},
        {key: "bar", value: 2},
    ]);

    expect(f({}).keys().toArray()).to.deep.equal([]);
    expect(f({foo: 1, bar: 2}).keys().toArray()).to.deep.equal(["foo", "bar"]);

    expect(f({}).values().toArray()).to.deep.equal([]);
    expect(f({foo: 1, bar: 2}).values().toArray()).to.deep.equal([1, 2]);
});