import { Comparator } from "comparators";
import { BiFunction, Stream, Consumer, Function, Predicate, Try } from "./Interfaces";
import { AbstractStream } from "./AbstractStream";
export declare class InplaceStream extends AbstractStream<any> implements Stream<any> {
    chunk<K = any>(classifier: BiFunction<any, number, K>): Stream<any[]>;
    concat(...iterables: Iterable<any>[]): Stream<any>;
    cycle(count?: number): Stream<any>;
    flatMap<S>(mapper: Function<any, Iterable<S>>): Stream<any>;
    filter(predicate: Predicate<any>): Stream<any>;
    index(): Stream<[number, any]>;
    limit(limitTo: number): Stream<any>;
    map<S>(mapper: Function<any, S>): Stream<any>;
    visit(consumer: Consumer<any>): Stream<any>;
    reverse(): Stream<any>;
    skip(toSkip: number): Stream<any>;
    slice(sliceSize: number): Stream<any[]>;
    sort(comparator?: Comparator<any>): Stream<any>;
    try<S>(mapper: Function<any, S>): Stream<Try<any>>;
    unique(keyExtractor?: Function<any, any>): Stream<any>;
    zip<S>(other: Iterable<S>): Stream<[any, any]>;
    zipSame(...others: Iterable<any>[]): Stream<any[]>;
}
