import { natural, Comparator } from "comparators";

import { Collector, Supplier, BiConsumer, Function, Predicate, Consumer, BiFunction } from "./Interfaces";
import { collect, collectWith, end, every, find, group, has, join, max, min, partition, reduce, reduceSame, size, some, sum, toArray, toSet, toMap } from "./Methods";

export abstract class AbstractStream<T> {

    protected iterable : Iterable<T>;
    private done = false;

    public constructor(iterable : Iterable<T>) {
        this.iterable = iterable;
    }

    protected check() {
        if (this.done) {
            throw new Error("Stream was already consumed.");
        }
        this.done = true;
    }

    [Symbol.iterator]() {
        this.check();
        return this.iterable[Symbol.iterator]();
    }

    collect<S,R=S>(collector: Collector<T, S, R>): R {
        this.check();
        return collect(this.iterable, collector);
    }

    collectWith<S,R=S>(supplier: Supplier<S>, accumulator: BiConsumer<S, T>, finisher: Function<S,R>): R {
        this.check();
        return collectWith(this.iterable, supplier, accumulator, finisher);
    }

    end() : void {
        this.check();
        end(this.iterable);
    }

    every(predicate: Predicate<T>) : boolean {
        this.check();
        return every(this.iterable, predicate);
    }

    find(predicate: Predicate<T>) : T {
        this.check();
        return find(this.iterable, predicate);
    }

    forEach(consumer: Consumer<T>) : void {
        this.check();
        for (let item of this.iterable) {
            consumer(item);
        }
    }

    group<K>(classifier: Function<T,K>) : Map<K, T[]> {
        this.check();
        return group(this.iterable, classifier);
    }

    has(object: T) : boolean {
        this.check();
        return has(this.iterable, object);
    }

    join(delimiter: string = "", prefix? : string, suffix? : string) : string {
        this.check();
        return join(this.iterable, delimiter, prefix, suffix);
    }

    max(comparator : Comparator<T> = natural) : T {
        this.check();
        return max(this.iterable, comparator);
    }

    min(comparator : Comparator<T> = natural) : T {
        this.check();
        return min(this.iterable, comparator);
    }

    partition(predicate: Predicate<T>) : {false:T[],true:T[]} {
        this.check();
        return partition(this.iterable, predicate);
    }

    reduce<S>(reducer: BiFunction<S,T,S>, initialValue: S) : S {
        this.check();
        return reduce(this.iterable, reducer, initialValue);
    }

    reduceSame(reducer: BiFunction<T,T,T>) : T {
        this.check();
        return reduceSame(this.iterable, reducer);
    }

    size() : number {
        this.check();
        return size(this.iterable);
    }

    some(predicate: Predicate<T>) : boolean {
        this.check();
        return some(this.iterable, predicate);
    }

    sum(converter?: Function<T, number>) : number {
        this.check();
        return sum(this.iterable, converter);
    }
        
    toArray() : T[] {
        this.check();
        return toArray(this.iterable);
    }

    toSet() : Set<T> {
        this.check();
        return toSet(this.iterable);
    }

    toJSON() : T[] {
        return this.toArray();
    }

    toString() {
        return `Stream[done=${this.done}]`;
    }

    toMap<K,V>(keyMapper: Function<T,K>, valueMapper: Function<T,V>) : Map<K,V> {
        this.check();
        return toMap(this.iterable, keyMapper, valueMapper);
    }
}