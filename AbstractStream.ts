import {
    BiConsumer,
    BinaryOperator,
    BiPredicate,
    Collector,
    Comparator,
    Consumer,
    Decuple,
    Maybe,
    Nonuple,
    Octuple,
    Pair,
    Predicate,
    Quadruple,
    Quintuple,
    Septuple,
    Sextuple,
    Single,
    Supplier,
    Triple,
    TypedBiFunction,
    TypedFunction,
} from "andross";

import {
    IStream,
    ITry,
    ITryStream,
} from "./Interfaces";

import {
    collect,
    collectWith,
    consumeFirst,
    end,
    every,
    find,
    findIndex,
    first,
    fork,
    group,
    has,
    isEmpty,
    isSizeBetween,
    join,
    last,
    max,
    maxBy,
    min,
    minBy,
    none,
    nth,
    partition,
    reduce,
    reduceSame,
    size,
    slice,
    some,
    splice,
    sum,
    toArray,
    toMap,
    toSet,
    tryCompute,
    tryEnd,
} from "./Methods";

/**
 * @private
 */
export abstract class AbstractStream<T> implements IStream<T> {
    protected iterable: Iterable<T>;
    private done = false;

    public constructor(iterable: Iterable<T>) {
        this.iterable = iterable;
    }

    public [Symbol.iterator]() {
        this.check();
        return this.iterable[Symbol.iterator]();
    }

    public collect<S, R = S>(collector: Collector<T, S, R>): R {
        this.check();
        return collect(this.iterable, collector);
    }

    public collectWith<S, R = S>(supplier: Supplier<S>, accumulator: BiConsumer<S, T>, finisher: TypedFunction<S, R>): R {
        this.check();
        return collectWith(this.iterable, supplier, accumulator, finisher);
    }

    public end(): void {
        this.check();
        end(this.iterable);
    }

    public every(predicate: Predicate<T>): boolean {
        this.check();
        return every(this.iterable, predicate);
    }

    public find(predicate: BiPredicate<T, number>): Maybe<T> {
        this.check();
        return find(this.iterable, predicate);
    }

    public findIndex(predicate: BiPredicate<T, number>): number {
        this.check();
        return findIndex(this.iterable, predicate);
    }

    public first(): Maybe<T> {
        this.check();
        return first(this.iterable);
    }

    public forEach(consumer: Consumer<T>): void {
        this.visit(consumer).end();
    }

    public fork(): this {
        this.checkOnly();
        this.iterable = fork(this.iterable);
        return this.clone(this.iterable);
    }

    public group<K>(classifier: TypedFunction<T, K>): Map<K, T[]> {
        this.check();
        return group(this.iterable, classifier);
    }

    public has(object: T): boolean {
        this.check();
        return has(this.iterable, object);
    }

    public isEmpty(): boolean {
        this.checkOnly();
        const result = isEmpty(this.iterable);
        this.iterable = result.iterable;
        return result.result;
    }

    public isSizeBetween(lower?: number, upper?: number): boolean {
        this.checkOnly();
        const result = isSizeBetween(this.iterable, lower, upper);
        this.iterable = result.iterable;
        return result.result;
    }

    public join(delimiter?: string, prefix?: string, suffix?: string): string {
        this.check();
        return join(this.iterable, delimiter, prefix, suffix);
    }

    public last(): Maybe<T> {
        this.check();
        return last(this.iterable);
    }

    public none(predicate: Predicate<T>): boolean {
        this.check();
        return none(this.iterable, predicate);
    }

    public nth(n: number): Maybe<T> {
        this.check();
        return nth(this.iterable, n);
    }

    public max(comparator?: Comparator<T>): Maybe<T> {
        this.check();
        return max(this.iterable, comparator);
    }

    public maxBy<K = any>(sortKey: TypedFunction<T, K>): Maybe<T> {
        this.check();
        return maxBy(this.iterable, sortKey);
    }

    public min(comparator?: Comparator<T>): Maybe<T> {
        this.check();
        return min(this.iterable, comparator);
    }

    public minBy<K = any>(sortKey: TypedFunction<T, K>): Maybe<T> {
        this.check();
        return minBy(this.iterable, sortKey);
    }

    public partition(predicate: Predicate<T>): { false: T[], true: T[] } {
        this.check();
        return partition(this.iterable, predicate);
    }

    public reduce<S>(reducer: TypedBiFunction<S, T, S>, initialValue: S): S {
        this.check();
        return reduce(this.iterable, reducer, initialValue);
    }

    public reduceSame(reducer: TypedBiFunction<T, T, T>): Maybe<T> {
        this.check();
        return reduceSame(this.iterable, reducer);
    }

    public size(): number {
        this.check();
        return size(this.iterable);
    }

    public shift(): Maybe<T> {
        this.checkOnly();
        let result: Maybe<T>;
        this.iterable = consumeFirst(this.iterable, item => result = item);
        return result;
    }

    public some(predicate: Predicate<T>): boolean {
        this.check();
        return some(this.iterable, predicate);
    }

    public slice(startOffset?: number, endOffset?: number): T[] {
        this.checkOnly();
        const result = slice(this.iterable, startOffset, endOffset);
        this.iterable = result.iterable;
        return result.result;
    }

    public splice(offset?: number, maxAmount?: number): T[] {
        this.checkOnly();
        const result = splice(this.iterable, offset, maxAmount);
        this.iterable = result.iterable;
        return result.result;
    }

    public sum(converter?: TypedFunction<T, number>): number {
        this.check();
        return sum(this.iterable, converter);
    }

    public toArray(fresh?: boolean): T[] {
        this.check();
        return toArray(this.iterable, fresh);
    }

    public toSet(fresh?: boolean): Set<T> {
        this.check();
        return toSet(this.iterable, fresh);
    }

    public toJSON(): T[] {
        return this.toArray();
    }

    public toString() {
        return `Stream[done=${this.done}]`;
    }

    public toMap<K, V>(keyMapper: TypedFunction<T, K>, valueMapper: TypedFunction<T, V>, merger?: BinaryOperator<V>): Map<K, V> {
        this.check();
        return toMap(this.iterable, keyMapper, valueMapper, merger);
    }

    public tryCompute<S>(operation: TypedFunction<IStream<T>, S>): ITry<S> {
        this.checkOnly();
        return tryCompute(this, operation);
    }

    public tryEnd(): ITry<void> {
        this.check();
        return tryEnd(this.iterable);
    }

    public abstract chunkBy<K = any>(classifier: TypedBiFunction<T, number, K>): IStream<T[]>;
    public abstract concat(...iterables: Iterable<T>[]): this;
    public abstract consume(sink: T[] | Consumer<T>, offset?: number, maxAmount?: number): this;
    public abstract cycle(count?: number): this;
    public abstract flatMap<S>(mapper: TypedFunction<T, Iterable<S>>): IStream<S>;
    public abstract filter(predicate: Predicate<T>): this;
    public abstract filterBy<K>(target: K, keyExtractor?: TypedFunction<T, K>, comparator?: Comparator<K>): this;
    public abstract index(): IStream<{index: number, value: T}>;
    public abstract limit(limitTo: number): this;
    public abstract map<S>(mapper: TypedFunction<T, S>): IStream<S>;
    public abstract promise<S>(promiseConverter: TypedFunction<T, Promise<S>>): Promise<IStream<S>>;
    public abstract reverse(): this;
    public abstract skip(toSkip: number): this;
    public abstract chunk(chunkSize: 0): IStream<never>;
    public abstract chunk(chunkSize: 1): IStream<Single<T>>;
    public abstract chunk(chunkSize: 2): IStream<Pair<T> | Single<T>>;
    public abstract chunk(chunkSize: 3): IStream<Triple<T> | Pair<T> | Single<T>>;
    public abstract chunk(chunkSize: 4): IStream<Quadruple<T> | Triple<T> | Pair<T> | Single<T>>;
    public abstract chunk(chunkSize: 5): IStream<Quintuple<T> | Quadruple<T> | Triple<T> | Pair<T> | Single<T>>;
    public abstract chunk(chunkSize: 6): IStream<Sextuple<T> | Quintuple<T> | Quadruple<T> | Triple<T> | Pair<T> | Single<T>>;
    public abstract chunk(chunkSize: 7): IStream<Septuple<T> | Sextuple<T> | Quintuple<T> | Quadruple<T> | Triple<T> | Pair<T> | Single<T>>;
    public abstract chunk(chunkSize: 8): IStream<Octuple<T> | Septuple<T> | Sextuple<T> | Quintuple<T> | Quadruple<T> | Triple<T> | Pair<T> | Single<T>>;
    public abstract chunk(chunkSize: 9): IStream<Nonuple<T> | Octuple<T> | Septuple<T> | Sextuple<T> | Quintuple<T> | Quadruple<T> | Triple<T> | Pair<T> | Single<T>>;
    public abstract chunk(chunkSize: 10): IStream<Decuple<T> | Nonuple<T> | Octuple<T> | Septuple<T> | Sextuple<T> | Quintuple<T> | Quadruple<T> | Triple<T> | Pair<T> | Single<T>>;
    public abstract chunk(sliceSize: number): IStream<T[]>;
    public abstract sort(comparator?: Comparator<T>): this;
    public abstract sortBy<K>(keyExtractor: TypedFunction<T, K>, comparator?: Comparator<K>): this;
    public abstract try<S>(operation: TypedFunction<T, S>): ITryStream<S>;
    public abstract unique(comparator?: Comparator<T>): this;
    public abstract uniqueBy(keyExtractor?: TypedFunction<T, any>): this;
    public abstract visit(consumer: Consumer<T>): this;
    public abstract zip<S>(other: Iterable<S>): IStream<[Maybe<T>, Maybe<S>]>;
    public abstract zipSame(...others: Iterable<T>[]): IStream<Maybe<T>[]>;

    protected abstract clone(iterable: Iterable<T>): this;

    protected checkOnly() {
        if (this.done) {
            throw new Error("Stream was already consumed.");
        }
    }

    protected check() {
        if (this.done) {
            throw new Error("Stream was already consumed.");
        }
        this.done = true;
    }
}
