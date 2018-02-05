import { Comparator } from "comparators";
import { BiFunction, Stream, TryStream, Consumer, Function, Predicate } from "./Interfaces";
import { AbstractStream } from "./AbstractStream";
export declare class InplaceStream extends AbstractStream<any> {
    chunk<K = any>(classifier: BiFunction<any, number, K>): Stream<any[]>;
    concat(...iterables: Iterable<any>[]): this;
    cycle(count?: number): this;
    flatMap<S>(mapper: Function<any, Iterable<S>>): Stream<any>;
    filter(predicate: Predicate<any>): this;
    index(): Stream<[number, any]>;
    limit(limitTo: number): this;
    map<S>(mapper: Function<any, S>): Stream<any>;
    promise<S>(promiseConverter: Function<any, Promise<S>>): Promise<Stream<any>>;
    visit(consumer: Consumer<any>): this;
    reverse(): this;
    skip(toSkip: number): this;
    slice(sliceSize: number): Stream<any[]>;
    sort(comparator?: Comparator<any>): this;
    try<S>(operation: Function<any, S>): TryStream<S>;
    unique(comparator?: Comparator<any>): this;
    uniqueBy(keyExtractor?: Function<any, any>): this;
    zip<S>(other: Iterable<S>): Stream<[any, any]>;
    zipSame(...others: Iterable<any>[]): Stream<any[]>;
}
