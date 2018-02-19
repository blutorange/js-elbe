import { Comparator, natural } from "kagura";

import { BiConsumer, BiFunction, BiPredicate, Consumer, Function, ICollector, IStream, ITry, ITryStream, Predicate, Supplier } from "./Interfaces";
import { collect, collectWith, end, every, find, findIndex, first, fork, group, has, join, last, max, maxBy, min, minBy, nth, partition, reduce, reduceSame, size, some, sum, toArray, toMap, toSet, tryCompute, tryEnd } from "./Methods";

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

    public collect<S, R = S>(collector: ICollector<T, S, R>): R {
        this.check();
        return collect(this.iterable, collector);
    }

    public collectWith<S, R = S>(supplier: Supplier<S>, accumulator: BiConsumer<S, T>, finisher: Function<S, R>): R {
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

    public find(predicate: BiPredicate<T, number>): T | undefined {
        this.check();
        return find(this.iterable, predicate);
    }

    public findIndex(predicate: BiPredicate<T, number>): number {
        this.check();
        return findIndex(this.iterable, predicate);
    }

    public first(): T | undefined {
        this.check();
        return first(this.iterable);
    }

    public forEach(consumer: Consumer<T>): void {
        this.check();
        for (const item of this.iterable) {
            consumer(item);
        }
    }

    public fork(): this {
        this.check();
        this.done = false;
        const iterable = fork(this.iterable);
        this.iterable = iterable;
        return this.clone(iterable);
    }

    public group<K>(classifier: Function<T, K>): Map<K, T[]> {
        this.check();
        return group(this.iterable, classifier);
    }

    public has(object: T): boolean {
        this.check();
        return has(this.iterable, object);
    }

    public join(delimiter: string = "", prefix?: string, suffix?: string): string {
        this.check();
        return join(this.iterable, delimiter, prefix, suffix);
    }

    public last(): T | undefined {
        this.check();
        return last(this.iterable);
    }

    public nth(n: number): T | undefined {
        this.check();
        return nth(this.iterable, n);
    }

    public max(comparator: Comparator<T> = natural): T | undefined {
        this.check();
        return max(this.iterable, comparator);
    }

    public maxBy<K = any>(sortKey: Function<T, K>): T | undefined {
        this.check();
        return maxBy(this.iterable, sortKey);
    }

    public min(comparator: Comparator<T> = natural): T | undefined {
        this.check();
        return min(this.iterable, comparator);
    }

    public minBy<K = any>(sortKey: Function<T, K>): T | undefined {
        this.check();
        return minBy(this.iterable, sortKey);
    }

    public partition(predicate: Predicate<T>): { false: T[], true: T[] } {
        this.check();
        return partition(this.iterable, predicate);
    }

    public reduce<S>(reducer: BiFunction<S, T, S>, initialValue: S): S {
        this.check();
        return reduce(this.iterable, reducer, initialValue);
    }

    public reduceSame(reducer: BiFunction<T, T, T>): T {
        this.check();
        return reduceSame(this.iterable, reducer);
    }

    public size(): number {
        this.check();
        return size(this.iterable);
    }

    public some(predicate: Predicate<T>): boolean {
        this.check();
        return some(this.iterable, predicate);
    }

    public sum(converter?: Function<T, number>): number {
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

    public toMap<K, V>(keyMapper: Function<T, K>, valueMapper: Function<T, V>): Map<K, V> {
        this.check();
        return toMap(this.iterable, keyMapper, valueMapper);
    }

    public tryCompute<S>(operation: Function<IStream<T>, S>): ITry<S> {
        this.check();
        return tryCompute(this.iterable, operation);
    }

    public tryEnd(): ITry<void> {
        this.check();
        return tryEnd(this.iterable);
    }

    public abstract chunk<K = any>(classifier: BiFunction<T, number, K>): IStream<T[]>;
    public abstract concat(...iterables: Iterable<T>[]): this;
    public abstract cycle(count?: number): this;
    public abstract flatMap<S>(mapper: Function<T, Iterable<S>>): IStream<S>;
    public abstract filter(predicate: Predicate<T>): this;
    public abstract index(): IStream<[number, T]>;
    public abstract limit(limitTo: number): this;
    public abstract map<S>(mapper: Function<T, S>): IStream<S>;
    public abstract promise<S>(promiseConverter: Function<T, Promise<S>>): Promise<IStream<S>>;
    public abstract reverse(): this;
    public abstract skip(toSkip: number): this;
    public abstract slice(sliceSize: number): IStream<T[]>;
    public abstract sort(comparator?: Comparator<T>): this;
    public abstract try<S>(operation: Function<T, S>): ITryStream<S>;
    public abstract unique(comparator?: Comparator<T>): this;
    public abstract uniqueBy(keyExtractor?: Function<T, any>): this;
    public abstract visit(consumer: Consumer<T>): this;
    public abstract zip<S>(other: Iterable<S>): IStream<[T, S]>;
    public abstract zipSame(...others: Iterable<T>[]): IStream<T[]>;

    protected abstract clone(iterable: Iterable<T>): this;

    protected check() {
        if (this.done) {
            throw new Error("Stream was already consumed.");
        }

        this.done = true;
    }
}
