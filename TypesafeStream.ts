import { Comparator } from "comparators";

import { BiFunction, Stream, TryStream, Consumer, Function, Predicate, Try } from "./Interfaces";
import { promise, cycle, chunk, slice, zip, zipSame, visit, index, concat, unique, uniqueBy, tryMap, flatMap, limit, map, reverse, skip, sort, filter } from "./Methods";
import { AbstractStream } from "./AbstractStream";

export class TypesafeStream<T> extends AbstractStream<T> {
    ['constructor'] : (typeof TypesafeStream);

    chunk<K=any>(classifier: BiFunction<T, number, K>) : Stream<T[]> {
        this.check();
        return new TypesafeStream(chunk(this.iterable, classifier));
    }

    concat(...iterables: Iterable<T>[]) : this {
        this.check();
        return new this.constructor(concat(this.iterable, ...iterables)) as this;
    }

    cycle(count?: number) : this {
        this.check();
        return new this.constructor(cycle(this.iterable, count)) as this;
    }

    flatMap<S>(mapper: Function<T,Iterable<S>>) : Stream<S> {
        this.check();
        return new TypesafeStream(flatMap(this.iterable, mapper));
    }

    filter(predicate : Predicate<T>) : this {
        this.check();
        return new this.constructor(filter(this.iterable, predicate)) as this;
    }

    index() : Stream<[number, T]> {
        this.check();
        return new TypesafeStream(index(this.iterable));
    }
 
    limit(limitTo: number) : this {
        this.check();
        return new this.constructor(limit(this.iterable, limitTo)) as this;
    }

    map<S>(mapper : Function<T,S>) : Stream<S> {
        this.check();
        return new TypesafeStream(map(this.iterable, mapper));
    }

    promise<S>(promiseConverter: Function<any, Promise<S>>) : Promise<Stream<any>> {
        this.check();
        return promise(this.iterable, promiseConverter)
            .then(iterable => new TypesafeStream(iterable));
    }

    reverse() : this {
        this.check();
        return new this.constructor(reverse(this.iterable)) as this;
    }

    skip(toSkip: number) : this {
        this.check();
        return new this.constructor(skip(this.iterable, toSkip)) as this;
    }

    slice(sliceSize: number) : Stream<T[]> {
        this.check();
        return new TypesafeStream(slice(this.iterable, sliceSize));
    }

    sort(comparator?: Comparator<T>) : this {
        this.check();
        return new this.constructor(sort(this.iterable, comparator)) as this;
    }

    try<S>(operation: Function<T,S>) : TryStream<S> {
        this.check();
        return new TryStreamImpl(tryMap(this.iterable, operation));
    }

    unique(comparator?: Comparator<any>) : this {
        this.check();
        return new this.constructor(unique(this.iterable, comparator)) as this;
    }

    uniqueBy(keyExtractor?: Function<T,any>) : this {
        this.check();
        return new this.constructor(uniqueBy(this.iterable, keyExtractor)) as this;
    }

    visit(consumer: Consumer<T>) : this {
        this.check();
        return new this.constructor(visit(this.iterable, consumer)) as this;
    }

    zip<S>(other: Iterable<S>) : Stream<[T, S]> {
        this.check();
        return new TypesafeStream(zip(this.iterable, other));
    }

    zipSame(...others: Iterable<T>[]) : Stream<T[]> {
        this.check();
        return new TypesafeStream(zipSame(this.iterable, others));
    }
};

class TryStreamImpl<T> extends TypesafeStream<Try<T>> implements TryStream<T> {
    forEachResult(success: Consumer<T>, error?: Consumer<Error>): void {
        if (error === undefined) {
            error = console.error;
        }
        return this.forEach(x => x.ifPresent(success, error));
    }

    include(predicate: Predicate<T>): this {
        return this.visit(x => x.include(predicate));
    }

    onError(handler: Consumer<Error>): this {
        return this.visit(x => x.ifAbsent(e => handler(e)));
    }

    onSuccess(success: Consumer<T>, failure: Consumer<Error>): this {
        return this.visit(x => x.ifPresent(success,failure));
    }

    orThrow(): Stream<T> {
        return this.map(x => x.orThrow());
    }

    orElse(backup: T): Stream<T> {
        return this.map(x => x.orElse(backup));
    }

    discardError(handler: Consumer<Error> = console.error) : Stream<T> {
        return this.onError(handler).filter(x => x.success).orThrow();        
    }

    flatConvert<S>(operation: Function<T, Try<S>>, backup?: Function<Error, Try<S>>): TryStream<S> {
        this.check();
        let x = map(this.iterable, x => x.flatConvert(operation, backup));
        return new this.constructor(x) as object as TryStream<S>;
    }

    convert<S>(operation: Function<T, S>, backup?: Function<Error, S>): TryStream<S> {
        this.check();
        let x = map(this.iterable, x => x.convert(operation, backup));
        return new this.constructor(x) as object as TryStream<S>;
    }

    orTry(backup: Function<Error, T>): this {
        this.check();
        let x = map(this.iterable, y => y.orTry(backup));
        return new this.constructor(x) as object as this;
    }
}