import { Comparator } from "kagura";
import { AbstractStream } from "./AbstractStream";
import { BiFunction, Consumer, Function, IStream, ITryStream, Predicate } from "./Interfaces";
export declare class InplaceStream extends AbstractStream<any> {
    ["constructor"]: (typeof InplaceStream);
    chunk<K = any>(classifier: BiFunction<any, number, K>): IStream<any[]>;
    concat(...iterables: Iterable<any>[]): this;
    cycle(count?: number): this;
    flatMap<S>(mapper: Function<any, Iterable<S>>): IStream<any>;
    filter(predicate: Predicate<any>): this;
    index(): IStream<[number, any]>;
    limit(limitTo: number): this;
    map<S>(mapper: Function<any, S>): IStream<any>;
    promise<S>(promiseConverter: Function<any, Promise<S>>): Promise<IStream<any>>;
    visit(consumer: Consumer<any>): this;
    reverse(): this;
    skip(toSkip: number): this;
    slice(sliceSize: number): IStream<any[]>;
    sort(comparator?: Comparator<any>): this;
    try<S>(operation: Function<any, S>): ITryStream<S>;
    unique(comparator?: Comparator<any>): this;
    uniqueBy(keyExtractor?: Function<any, any>): this;
    zip<S>(other: Iterable<S>): IStream<[any, any]>;
    zipSame(...others: Iterable<any>[]): IStream<any[]>;
    protected clone(iterable: Iterable<any>): this;
}
