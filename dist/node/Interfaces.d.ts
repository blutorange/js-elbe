import { Comparator } from "kagura";
export interface IStatistics {
    average: number;
    count: number;
    max: number;
    min: number;
    sum: number;
    variance: number;
}
export declare type Function<T, R> = (arg1: T) => R;
export declare type Maybe<T> = T | undefined;
export declare type Supplier<T> = () => T;
export declare type Consumer<T> = (object: T) => void;
export declare type BiFunction<S, T, R> = (arg1: S, arg2: T) => R;
export declare type Predicate<T> = (object: T) => boolean;
export declare type BiPredicate<T, S> = (arg1: T, arg2: S) => boolean;
export declare type BiConsumer<S, T> = (arg1: S, arg2: T) => void;
export interface ICollector<S, T, R = T> {
    accumulator: BiConsumer<T, S>;
    supplier: Supplier<T>;
    finisher: Function<T, R>;
}
export interface ITryFactory {
    success<T>(value: T): ITry<T>;
    error<T>(error: Error | string, cause?: Error): ITry<T>;
    of<T>(operation: Supplier<T>, cause?: Error): ITry<T>;
    flatOf<T>(operation: Supplier<ITry<T>>, cause?: Error): ITry<T>;
}
export interface IStreamFactory {
    stream<T>(iterable: Iterable<T>): IStream<T>;
    generate<T>(generator: Function<number, T>, amount?: number): IStream<T>;
    iterate<T>(seed: T, next: Function<T, T>, amount?: number): IStream<T>;
    repeat<T>(item: T, amount?: number): IStream<T>;
    times(amount: number, start?: number, end?: number): IStream<number>;
    fromObject<T>(object: {
        [s: string]: T;
    }): IStream<[string, T]>;
    fromObjectKeys(object: {
        [s: string]: any;
    }): IStream<string>;
    fromObjectValues<T>(object: {
        [s: string]: T;
    }): IStream<T>;
}
export interface ITry<T> {
    readonly success: boolean;
    include(predicate: Predicate<T>): ITry<T>;
    convert<S>(success: Function<T, S>, backup?: Function<Error, S>): ITry<S>;
    flatConvert<S>(operation: Function<T, ITry<S>>, backup?: Function<Error, ITry<S>>): ITry<S>;
    orElse(backup: T): T;
    orTry(backup: Function<Error, T>): ITry<T>;
    orFlatTry(backup: Function<Error, ITry<T>>): ITry<T>;
    orThrow(): T;
    ifPresent(success: Consumer<T>, error?: Consumer<Error>): this;
    ifAbsent(consumer: Consumer<Error>): this;
    stream(factory?: IStreamFactory): IStream<T | Error>;
    iterate(): Iterable<T | Error>;
    then<S>(success: Function<T, S | ITry<S>>, error: Function<Error, S | ITry<S>>): ITry<S>;
    catch(mapper: Function<Error, T | ITry<T>>): ITry<T>;
}
export interface IStream<T> {
    [Symbol.iterator](): Iterator<T>;
    chunk<K = any>(classifier: BiFunction<T, number, K>): IStream<T[]>;
    collect<S, R = S>(collector: ICollector<T, S, R>): R;
    collectWith<S, R = S>(supplier: Supplier<S>, accumulator: BiConsumer<S, T>, finisher: Function<S, R>): R;
    concat(...iterables: Iterable<T>[]): this;
    cycle(count?: number): this;
    end(): void;
    every(predicate: Predicate<T>): boolean;
    find(predicate: BiPredicate<T, number>): Maybe<T>;
    findIndex(predicate: BiPredicate<T, number>): number;
    first(): Maybe<T>;
    flatMap<S>(mapper: Function<T, Iterable<S>>): IStream<S>;
    filter(predicate: Predicate<T>): this;
    forEach(consumer: Consumer<T>): void;
    fork(): this;
    group<K = any>(classifier: Function<T, K>): Map<K, T[]>;
    has(object: T): boolean;
    index(): IStream<[number, T]>;
    join(delimiter?: string, prefix?: string, suffix?: string): string;
    last(): Maybe<T>;
    limit(limitTo: number): this;
    map<S>(mapper: Function<T, S>): IStream<S>;
    max(comparator: Comparator<T>): Maybe<T>;
    maxBy(sortKey: Function<T, any>): Maybe<T>;
    min(comparator: Comparator<T>): Maybe<T>;
    minBy(sortKey: Function<T, any>): Maybe<T>;
    nth(n: number): Maybe<T>;
    partition(discriminator: Predicate<T>): {
        false: T[];
        true: T[];
    };
    promise<S>(promiseConverter: Function<T, Promise<S>>): Promise<IStream<S>>;
    reduce<S>(reducer: BiFunction<S, T, S>, initialValue: S): S;
    reduceSame(reducer: BiFunction<T, T, T>): T;
    reverse(): this;
    size(): number;
    skip(toSkip: number): this;
    slice(sliceSize: number): IStream<T[]>;
    some(predicate: Predicate<T>): boolean;
    sort(comparator?: Comparator<T>): this;
    sum(converter?: Function<T, number>): number;
    try<S>(operation: Function<T, S>): ITryStream<S>;
    tryCompute<S>(operation: Function<IStream<T>, S>): ITry<S>;
    tryEnd(): ITry<void>;
    toArray(fresh?: boolean): T[];
    toSet(fresh?: boolean): Set<any>;
    toMap<K, V>(keyMapper: Function<any, K>, valueMapper: Function<any, V>): Map<K, V>;
    unique(comparator?: Comparator<T>): this;
    uniqueBy(keyExtractor?: Function<T, any>): this;
    visit(consumer: Consumer<T>): this;
    zip<S>(other: Iterable<S>): IStream<[T, S]>;
    zipSame(...others: Iterable<T>[]): IStream<T[]>;
}
export interface ITryStream<T> extends IStream<ITry<T>> {
    discardError(handler?: Consumer<Error>): IStream<T>;
    forEachResult(success: Consumer<T>, error?: Consumer<Error>): void;
    include(predicate: Predicate<T>): this;
    flatConvert<S>(operation: Function<T, ITry<S>>, backup?: Function<Error, ITry<S>>): ITryStream<S>;
    convert<S>(operation: Function<T, S>, backup?: Function<Error, S>): ITryStream<S>;
    orElse(backup: T): IStream<T>;
    onError(handler: Consumer<Error>): this;
    onSuccess(success: Consumer<T>, error?: Consumer<Error>): this;
    orThrow(): IStream<T>;
    orTry(backup: Function<Error, T>): this;
}
