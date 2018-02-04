import { natural, Comparator } from "comparators";

import { BiPredicate, Try, TryStream, Stream, Collector, Supplier, BiConsumer, Function, Predicate, Consumer, BiFunction } from "./Interfaces";
import { findIndex, first, last, nth, collect, collectWith, end, every, find, group, has, join, max, min, partition, reduce, reduceSame, size, some, sum, toArray, toSet, toMap, tryCompute, tryEnd } from "./Methods";

/**
 * @private
 */
export abstract class AbstractStream<T> implements Stream<T> {
    protected iterable : Iterable<T>;
    private done = false;

    public constructor(iterable : Iterable<T>) {
        this.iterable = iterable;
    }

    abstract chunk<K = any>(classifier: BiFunction<T, number, K>): Stream<T[]>;
    abstract concat(...iterables: Iterable<T>[]): this;
    abstract cycle(count?: number): this;
    abstract flatMap<S>(mapper: Function<T, Iterable<S>>): Stream<S>;
    abstract filter(predicate: Predicate<T>): this;
    abstract index(): Stream<[number, T]>;
    abstract limit(limitTo: number): this;
    abstract map<S>(mapper: Function<T, S>): Stream<S>;
    abstract reverse(): this;
    abstract skip(toSkip: number): this;
    abstract slice(sliceSize: number): Stream<T[]>;
    abstract sort(comparator?: Comparator<T>): this;
    abstract try<S>(operation: Function<T, S>): TryStream<S>;
    abstract unique(keyExtractor?: Function<T, any>): this;
    abstract visit(consumer: Consumer<T>): this;
    abstract zip<S>(other: Iterable<S>): Stream<[T, S]>;
    abstract zipSame(...others: Iterable<T>[]): Stream<T[]>;

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

    find(predicate: BiPredicate<T, number>) : T|undefined {
        this.check();
        return find(this.iterable, predicate);
    }

    findIndex(predicate: BiPredicate<T, number>) : number {
        this.check();
        return findIndex(this.iterable, predicate);
    }

    first() : T|undefined {
        this.check();
        return first(this.iterable);
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

    last() : T|undefined {
        this.check();
        return last(this.iterable);
    }

    nth(n: number) : T|undefined {
        this.check();
        return nth(this.iterable, n);
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

    tryCompute<S>(operation: Function<Stream<T>, S>) : Try<S> {
        this.check();
        return tryCompute(this.iterable, operation);
    }

    tryEnd() : Try<void> {
        this.check();
        return tryEnd(this.iterable);
    }
}