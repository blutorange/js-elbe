import { Comparator } from "comparators";
import { Collector, Supplier, BiConsumer, Function, Predicate, Consumer, BiFunction } from "./Interfaces";
export declare abstract class AbstractStream<T> {
    protected iterable: Iterable<T>;
    private done;
    protected constructor(iterable: Iterable<T>);
    protected check(): void;
    [Symbol.iterator](): Iterator<T>;
    collect<S, R = S>(collector: Collector<T, S, R>): R;
    collectWith<S, R = S>(supplier: Supplier<S>, accumulator: BiConsumer<S, T>, finisher: Function<S, R>): R;
    every(predicate: Predicate<T>): boolean;
    find(predicate: Predicate<T>): T;
    forEach(consumer: Consumer<T>): void;
    group<K>(classifier: Function<T, K>): Map<K, T[]>;
    has(object: T): boolean;
    join(delimiter?: string, prefix?: string, suffix?: string): string;
    max(comparator?: Comparator<T>): T;
    min(comparator?: Comparator<T>): T;
    partition(predicate: Predicate<T>): {
        false: T[];
        true: T[];
    };
    reduce<S>(reducer: BiFunction<S, T, S>, initialValue: S): S;
    reduceSame(reducer: BiFunction<T, T, T>): T;
    reduceWith<S>(reducer: BiFunction<S, T, S>, initialValue: S): S;
    size(): number;
    some(predicate: Predicate<T>): boolean;
    sum(converter?: Function<T, number>): number;
    toArray(): T[];
    toSet(): Set<T>;
    toJSON(): T[];
    toString(): string;
    toMap<K, V>(keyMapper: Function<T, K>, valueMapper: Function<T, V>): Map<K, V>;
}
