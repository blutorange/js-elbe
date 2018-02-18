import { Comparator } from "kagura";
import { BiFunction, Stream, TryStream, Consumer, Function, Predicate } from "./Interfaces";
import { AbstractStream } from "./AbstractStream";
export declare class TypesafeStream<T> extends AbstractStream<T> {
    ['constructor']: (typeof TypesafeStream);
    chunk<K = any>(classifier: BiFunction<T, number, K>): Stream<T[]>;
    concat(...iterables: Iterable<T>[]): this;
    protected clone(iterable: Iterable<T>): this;
    cycle(count?: number): this;
    flatMap<S>(mapper: Function<T, Iterable<S>>): Stream<S>;
    filter(predicate: Predicate<T>): this;
    index(): Stream<[number, T]>;
    limit(limitTo: number): this;
    map<S>(mapper: Function<T, S>): Stream<S>;
    promise<S>(promiseConverter: Function<any, Promise<S>>): Promise<Stream<any>>;
    reverse(): this;
    skip(toSkip: number): this;
    slice(sliceSize: number): Stream<T[]>;
    sort(comparator?: Comparator<T>): this;
    try<S>(operation: Function<T, S>): TryStream<S>;
    unique(comparator?: Comparator<any>): this;
    uniqueBy(keyExtractor?: Function<T, any>): this;
    visit(consumer: Consumer<T>): this;
    zip<S>(other: Iterable<S>): Stream<[T, S]>;
    zipSame(...others: Iterable<T>[]): Stream<T[]>;
}
