import { Comparator } from "comparators";
import { BiFunction, Stream, Consumer, Function, Predicate, Try } from "./Interfaces";
import { AbstractStream } from "./AbstractStream";
export declare class TypesafeStream<T> extends AbstractStream<T> implements Stream<T> {
    chunk<K = any>(classifier: BiFunction<T, number, K>): Stream<T[]>;
    concat(...iterables: Iterable<T>[]): Stream<T>;
    cycle(count?: number): Stream<T>;
    flatMap<S>(mapper: Function<T, Iterable<S>>): Stream<S>;
    filter(predicate: Predicate<T>): Stream<T>;
    index(): Stream<[number, T]>;
    limit(limitTo: number): Stream<T>;
    map<S>(mapper: Function<T, S>): Stream<S>;
    visit(consumer: Consumer<T>): Stream<T>;
    reverse(): Stream<T>;
    skip(toSkip: number): Stream<T>;
    slice(sliceSize: number): Stream<T[]>;
    sort(comparator?: Comparator<T>): Stream<T>;
    try<S>(mapper: Function<T, S>): Stream<Try<S>>;
    unique(keyExtractor?: Function<T, any>): Stream<T>;
    zip<S>(other: Iterable<S>): Stream<[T, S]>;
    zipSame(...others: Iterable<T>[]): Stream<T[]>;
}
