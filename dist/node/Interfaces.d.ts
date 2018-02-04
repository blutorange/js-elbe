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
    error<T>(error: Error | String, cause?: Error): Try<T>;
    of<T>(operation: Supplier<T>, cause?: Error): Try<T>;
    flatOf<T>(operation: Supplier<Try<T>>, cause?: Error): Try<T>;
}
export interface StreamFactory {
    stream<T>(iterable: Iterable<T>): Stream<T>;
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
    readonly success: boolean;
    include(predicate: Predicate<T>): Try<T>;
    convert<S>(success: Function<T, S>, backup?: Function<Error, S>): Try<S>;
    flatConvert<S>(operation: Function<T, Try<S>>, backup?: Function<Error, Try<S>>): Try<S>;
    orElse(backup: T): T;
    orTry(backup: Function<Error, T>): Try<T>;
    orFlatTry(backup: Function<Error, Try<T>>): Try<T>;
    orThrow(): T;
    ifPresent(success: Consumer<T>, error?: Consumer<Error>): this;
    ifAbsent(consumer: Consumer<Error>): this;
    stream(factory?: StreamFactory): Stream<T | Error>;
    iterate(): Iterable<T | Error>;
    then<S>(success: Function<T, S | Try<S>>, error: Function<Error, S | Try<S>>): Try<S>;
    catch(mapper: Function<Error, T | Try<T>>): Try<T>;
}
export interface Stream<T> {
    [Symbol.iterator](): Iterator<T>;
    chunk<K = any>(classifier: BiFunction<T, number, K>): Stream<T[]>;
    collect<S, R = S>(collector: Collector<T, S, R>): R;
    collectWith<S, R = S>(supplier: Supplier<S>, accumulator: BiConsumer<S, T>, finisher: Function<S, R>): R;
    concat(...iterables: Iterable<T>[]): this;
    cycle(count?: number): this;
    end(): void;
    every(predicate: Predicate<T>): boolean;
    find(predicate: Predicate<T>): T;
    flatMap<S>(mapper: Function<T, Iterable<S>>): Stream<S>;
    filter(predicate: Predicate<T>): this;
    forEach(consumer: Consumer<T>): void;
    group<K = any>(classifier: Function<T, K>): Map<K, T[]>;
    has(object: T): boolean;
    index(): Stream<[number, T]>;
    join(delimiter?: string, prefix?: string, suffix?: string): string;
    limit(limitTo: number): this;
    map<S>(mapper: Function<T, S>): Stream<S>;
    max(comparator: Comparator<T>): T;
    min(comparator: Comparator<T>): T;
    partition(predicate: Predicate<T>): {
        false: T[];
        true: T[];
    };
    reduce<S>(reducer: BiFunction<S, T, S>, initialValue: S): S;
    reduceSame(reducer: BiFunction<T, T, T>): T;
    reverse(): this;
    size(): number;
    skip(toSkip: number): this;
    slice(sliceSize: number): Stream<T[]>;
    some(predicate: Predicate<T>): boolean;
    sort(comparator?: Comparator<T>): this;
    sum(converter?: Function<T, number>): number;
    try<S>(operation: Function<T, S>): TryStream<S>;
    tryCompute<S>(operation: Function<Stream<T>, S>): Try<S>;
    tryEnd(): Try<void>;
    toArray(): T[];
    toSet(): Set<any>;
    toMap<K, V>(keyMapper: Function<any, K>, valueMapper: Function<any, V>): Map<K, V>;
    unique(keyExtractor?: Function<T, any>): this;
    visit(consumer: Consumer<T>): this;
    zip<S>(other: Iterable<S>): Stream<[T, S]>;
    zipSame(...others: Iterable<T>[]): Stream<T[]>;
}
export interface TryStream<T> extends Stream<Try<T>> {
    discardError(handler?: Consumer<Error>): Stream<T>;
    forEachResult(success: Consumer<T>, error?: Consumer<Error>): void;
    include(predicate: Predicate<T>): this;
    flatConvert<S>(operation: Function<T, Try<S>>, backup?: Function<Error, Try<S>>): TryStream<S>;
    convert<S>(operation: Function<T, S>, backup?: Function<Error, S>): TryStream<S>;
    orElse(backup: T): Stream<T>;
    onError(handler: Consumer<Error>): this;
    onSuccess(success: Consumer<T>, error: Consumer<Error>): this;
    orThrow(): Stream<T>;
    orTry(backup: Function<Error, T>): this;
}
