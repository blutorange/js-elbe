import { Comparator } from "comparators";
export interface Statistics {
    average: number;
    count: number;
    max: number;
    min: number;
    sum: number;
    variance: number;
}
export interface Function<T, R> {
    (arg1: T): R;
}
export interface Supplier<T> {
    (): T;
}
export interface Consumer<T> {
    (object: T): void;
}
export interface BiFunction<S, T, R> {
    (arg1: S, arg2: T): R;
}
export interface Predicate<T> {
    (object: T): boolean;
}
export interface BiConsumer<S, T> {
    (arg1: S, arg2: T): void;
}
export interface Collector<S, T, R = T> {
    accumulator: BiConsumer<T, S>;
    supplier: Supplier<T>;
    finisher: Function<T, R>;
}
export interface ITryFactory {
    success<T>(value: T): Try<T>;
    failure<T>(error: Error): Try<T>;
    of<T>(action: Supplier<T>): Try<T>;
}
export interface IStreamFactory {
    from<T>(iterable: Iterable<T>): Stream<T>;
    generate<T>(generator: Function<number, T>, amount?: number): Stream<T>;
    iterate<T>(seed: T, next: Function<T, T>, amount?: number): Stream<T>;
    repeat<T>(item: T, amount?: number): Stream<T>;
    times(amount: number, start?: number, end?: number): Stream<number>;
    fromObject<T>(object: {
        [s: string]: T;
    }): Stream<[string, T]>;
    fromObjectKeys(object: {
        [s: string]: any;
    }): Stream<string>;
    fromObjectValues<T>(object: {
        [s: string]: T;
    }): Stream<T>;
}
export interface Try<T> {
    success: boolean;
    map<S>(mapper: Function<T, S>): Try<S>;
    flatMap<S>(mapper: Function<T, Try<S>>): Try<S>;
    recover(backup: Function<Error, T>): Try<T>;
    stream(factory?: IStreamFactory): Stream<T>;
    iterate(): Iterable<T>;
    orElse(backup: T): T;
    orThrow(): T;
    fold<S>(successHandler: Function<T, S>, failureHandler: Function<Error, S>): Try<S>;
    then<S>(mapper: Function<T, S | Try<S>>): Try<S>;
    catch(mapper: Function<Error, T | Try<T>>): Try<T>;
}
export interface Stream<T> {
    [Symbol.iterator](): Iterator<T>;
    collect<S, R = S>(collector: Collector<T, S, R>): R;
    collectWith<S, R = S>(supplier: Supplier<S>, accumulator: BiConsumer<S, T>, finisher: Function<S, R>): R;
    concat(...iterables: Iterable<T>[]): Stream<T>;
    every(predicate: Predicate<T>): boolean;
    find(predicate: Predicate<T>): T;
    flatMap<S>(mapper: Function<T, Iterable<S>>): Stream<S>;
    filter(predicate: Predicate<T>): Stream<T>;
    forEach(consumer: Consumer<T>): void;
    group<K>(classifier: Function<T, K>): Map<K, T[]>;
    has(object: T): boolean;
    index(): Stream<[number, T]>;
    join(delimiter?: string, prefix?: string, suffix?: string): string;
    limit(limitTo: number): Stream<T>;
    map<S>(mapper: Function<T, S>): Stream<S>;
    max(comparator: Comparator<T>): T;
    min(comparator: Comparator<T>): T;
    partition(predicate: Predicate<T>): {
        false: T[];
        true: T[];
    };
    process(consumer: Consumer<T>): Stream<T>;
    reduce<S>(reducer: BiFunction<S, T, S>, initialValue: S): S;
    reduceSame(reducer: BiFunction<T, T, T>): T;
    reduceWith<S>(reducer: BiFunction<S, T, S>, initialValue: S): S;
    reverse(): Stream<T>;
    size(): number;
    skip(toSkip: number): Stream<T>;
    some(predicate: Predicate<T>): boolean;
    sort(comparator?: Comparator<T>): Stream<T>;
    sum(converter?: Function<T, number>): number;
    try<S>(mapper: Function<T, S>): Stream<Try<S>>;
    toArray(): T[];
    toSet(): Set<any>;
    toMap<K, V>(keyMapper: Function<any, K>, valueMapper: Function<any, V>): Map<K, V>;
    unique(): Stream<T>;
    uniqueBy(keyExtractor: Function<T, any>): Stream<T>;
}
