import { Comparator } from "comparators";

import { BiFunction, Stream, TryStream, Consumer, Function, Predicate, Try } from "./Interfaces";
import { cycle, chunk, slice, zip, zipSame, visit, index, concat, unique, tryMap, flatMap, limit, map, reverse, skip, sort, filter } from "./Methods";
import { AbstractStream } from "./AbstractStream";

export class InplaceStream extends AbstractStream<any> {

    chunk<K=any>(classifier: BiFunction<any, number, K>) : Stream<any[]> {
        this.iterable = chunk(this.iterable, classifier);
        return this;
    }

    concat(...iterables: Iterable<any>[]) : this {
        this.iterable = concat(this.iterable, ...iterables);
        return this;
    }

    cycle(count?: number) : this {
        this.iterable = cycle(this.iterable, count);
        return this;        
    }

    flatMap<S>(mapper: Function<any,Iterable<S>>) : Stream<any> {
        this.iterable = flatMap(this.iterable, mapper);
        return this;
    }

    filter(predicate : Predicate<any>) : this {
        this.iterable = filter(this.iterable, predicate);
        return this;
    }

    index() : Stream<[number, any]> {
        this.iterable = index(this.iterable);
        return this;
    }
    
    limit(limitTo: number) : this {
        this.iterable = limit(this.iterable, limitTo);
        return this;
    }

    map<S>(mapper : Function<any,S>) : Stream<any> {
        this.iterable = map(this.iterable, mapper);
        return this;
    }

    visit(consumer: Consumer<any>) : this {
        this.iterable = visit(this.iterable, consumer);
        return this;        
    }

    reverse() : this {
        this.iterable = reverse(this.iterable);
        return this;
    }

    skip(toSkip: number) : this {
        this.iterable = skip(this.iterable, toSkip);
        return this;
    }

    slice(sliceSize: number) : Stream<any[]> {
        this.iterable = slice(this.iterable, sliceSize);
        return this;
    }

    sort(comparator?: Comparator<any>) : this {
        this.iterable = sort(this.iterable, comparator);
        return this;
    }

    try<S>(operation: Function<any,S>) : TryStream<S> {
        let x = tryMap(this.iterable, operation);
        return new TryStreamImpl(x);
    }

    unique(keyExtractor?: Function<any,any>) : this {
        this.iterable = unique(this.iterable, keyExtractor);
        return this;
    }

    zip<S>(other: Iterable<S>) : Stream<[any, any]> {
        this.iterable = zip(this.iterable, other);
        return this;
    }

    zipSame(...others: Iterable<any>[]) : Stream<any[]> {
        this.iterable = zipSame(this.iterable, others);
        return this;
    }
};


class TryStreamImpl extends InplaceStream implements TryStream<any> {
    forEachResult(success: Consumer<any>, error?: Consumer<Error>): void {
        return this.forEach(x => x.ifPresent(success, error));
    }

    include(predicate: Predicate<any>): this {
        return this.visit(x => x.include(predicate));
    }

    onError(handler: Consumer<Error>): this {
        return this.visit((x:Try<any>) => x.ifAbsent(e => handler(e)));
    }

    onSuccess(success: Consumer<any>, failure: Consumer<Error>): this {
        return this.visit(x => x.ifPresent(success,failure));
    }

    orThrow(): Stream<any> {
        return this.map(x => x.orThrow());
    }

    orElse(backup: any): Stream<any> {
        return this.map(x => x.orElse(backup));
    }

    discardError(handler: Consumer<Error> = console.error) : Stream<any> {
        return this.onError(handler).filter(x => x.success).orThrow();
    }

    flatConvert<S>(operation: Function<any, Try<S>>, backup?: Function<Error, Try<S>>): TryStream<S> {
        this.iterable = map(this.iterable, x => x.flatConvert(operation, backup));
        return this;
    }
    
    convert<S>(operation: Function<any, S>, backup?: Function<Error, S>): TryStream<any> {
        this.iterable = map(this.iterable, x => x.convert(operation, backup));
        return this;
    }

    orTry(backup: Function<Error, any>): this {
        this.iterable = map(this.iterable, y => y.orTry(backup));
        return this;
    }
}