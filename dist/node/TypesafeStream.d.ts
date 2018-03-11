import { Comparator } from "kagura";
import { AbstractStream } from "./AbstractStream";
import { BiFunction, Consumer, Function, IStream, ITryStream, Predicate } from "./Interfaces";
export declare class TypesafeStream<T> extends AbstractStream<T> {
    ["constructor"]: (typeof TypesafeStream);
    chunk<K = any>(classifier: BiFunction<T, number, K>): IStream<T[]>;
    concat(...iterables: Iterable<T>[]): this;
    cycle(count?: number): this;
    flatMap<S>(mapper: Function<T, Iterable<S>>): IStream<S>;
    filter(predicate: Predicate<T>): this;
    index(): IStream<{
        index: number;
        value: T;
    }>;
    limit(limitTo: number): this;
    map<S>(mapper: Function<T, S>): IStream<S>;
    promise<S>(promiseConverter: Function<any, Promise<S>>): Promise<IStream<any>>;
    reverse(): this;
    skip(toSkip: number): this;
    slice(sliceSize: number): IStream<T[]>;
    sort(comparator?: Comparator<T>): this;
    try<S>(operation: Function<T, S>): ITryStream<S>;
    unique(comparator?: Comparator<any>): this;
    uniqueBy(keyExtractor?: Function<T, any>): this;
    visit(consumer: Consumer<T>): this;
    zip<S>(other: Iterable<S>): IStream<[T, S]>;
    zipSame(...others: Iterable<T>[]): IStream<T[]>;
    protected clone(iterable: Iterable<T>): this;
}
