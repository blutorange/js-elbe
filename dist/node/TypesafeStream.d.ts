import { Comparator } from "comparators";
import { BiFunction, Stream, TryStream, Consumer, Function, Predicate } from "./Interfaces";
import { AbstractStream } from "./AbstractStream";
export declare class TypesafeStream<T> extends AbstractStream<T> {
    ['constructor']: (typeof TypesafeStream);
    chunk<K = any>(classifier: BiFunction<T, number, K>): Stream<T[]>;
    concat(...iterables: Iterable<T>[]): this;
    cycle(count?: number): this;
    flatMap<S>(mapper: Function<T, Iterable<S>>): Stream<S>;
    filter(predicate: Predicate<T>): this;
    index(): Stream<[number, T]>;
    limit(limitTo: number): this;
    map<S>(mapper: Function<T, S>): Stream<S>;
    visit(consumer: Consumer<T>): this;
    reverse(): this;
    skip(toSkip: number): this;
    slice(sliceSize: number): Stream<T[]>;
    sort(comparator?: Comparator<T>): this;
    try<S>(operation: Function<T, S>): TryStream<S>;
    unique(keyExtractor?: Function<T, any>): this;
    zip<S>(other: Iterable<S>): Stream<[T, S]>;
    zipSame(...others: Iterable<T>[]): Stream<T[]>;
}
