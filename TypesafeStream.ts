import { Comparator } from "kagura";

import { AbstractStream } from "./AbstractStream";
import { BiFunction, Consumer, Function, IStream, ITry, ITryStream, Predicate } from "./Interfaces";
import { chunk, concat, cycle, filter, flatMap, index, limit, map, promise, reverse, skip, slice, sort, tryMap, unique, uniqueBy, visit, zip, zipSame } from "./Methods";

export class TypesafeStream<T> extends AbstractStream<T> {
    public ["constructor"]: (typeof TypesafeStream);

    public chunk<K= any>(classifier: BiFunction<T, number, K>): IStream<T[]> {
        this.check();
        return new TypesafeStream(chunk(this.iterable, classifier));
    }

    public concat(...iterables: Iterable<T>[]): this {
        this.check();
        return new this.constructor(concat(this.iterable, ...iterables)) as this;
    }

    public cycle(count?: number): this {
        this.check();
        return new this.constructor(cycle(this.iterable, count)) as this;
    }

    public flatMap<S>(mapper: Function<T, Iterable<S>>): IStream<S> {
        this.check();
        return new TypesafeStream(flatMap(this.iterable, mapper));
    }

    public filter(predicate: Predicate<T>): this {
        this.check();
        return new this.constructor(filter(this.iterable, predicate)) as this;
    }

    public index(): IStream<{index: number, value: T}> {
        this.check();
        return new TypesafeStream(index(this.iterable));
    }

    public limit(limitTo: number): this {
        this.check();
        return new this.constructor(limit(this.iterable, limitTo)) as this;
    }

    public map<S>(mapper: Function<T, S>): IStream<S> {
        this.check();
        return new TypesafeStream(map(this.iterable, mapper));
    }

    public promise<S>(promiseConverter: Function<any, Promise<S>>): Promise<IStream<any>> {
        this.check();
        return promise(this.iterable, promiseConverter)
            .then(iterable => new TypesafeStream(iterable));
    }

    public reverse(): this {
        this.check();
        return new this.constructor(reverse(this.iterable)) as this;
    }

    public skip(toSkip: number): this {
        this.check();
        return new this.constructor(skip(this.iterable, toSkip)) as this;
    }

    public slice(sliceSize: number): IStream<T[]> {
        this.check();
        return new TypesafeStream(slice(this.iterable, sliceSize));
    }

    public sort(comparator?: Comparator<T>): this {
        this.check();
        return new this.constructor(sort(this.iterable, comparator)) as this;
    }

    public try<S>(operation: Function<T, S>): ITryStream<S> {
        this.check();
        return new TryStreamImpl(tryMap(this.iterable, operation));
    }

    public unique(comparator?: Comparator<any>): this {
        this.check();
        return new this.constructor(unique(this.iterable, comparator)) as this;
    }

    public uniqueBy(keyExtractor?: Function<T, any>): this {
        this.check();
        return new this.constructor(uniqueBy(this.iterable, keyExtractor)) as this;
    }

    public visit(consumer: Consumer<T>): this {
        this.check();
        return new this.constructor(visit(this.iterable, consumer)) as this;
    }

    public zip<S>(other: Iterable<S>): IStream<[T, S]> {
        this.check();
        return new TypesafeStream(zip(this.iterable, other));
    }

    public zipSame(...others: Iterable<T>[]): IStream<T[]> {
        this.check();
        return new TypesafeStream(zipSame(this.iterable, others));
    }

    protected clone(iterable: Iterable<T>): this {
        return new this.constructor(iterable) as this;
    }
}

class TryStreamImpl<T> extends TypesafeStream<ITry<T>> implements ITryStream<T> {
    public forEachResult(success: Consumer<T>, error?: Consumer<Error>): void {
        if (error === undefined) {
            error = console.error;
        }
        return this.forEach(x => x.ifPresent(success, error));
    }

    public include(predicate: Predicate<T>): this {
        return this.visit(x => x.include(predicate));
    }

    public onError(handler: Consumer<Error>): this {
        return this.visit(x => x.ifAbsent(e => handler(e)));
    }

    public onSuccess(success: Consumer<T>, failure: Consumer<Error>): this {
        return this.visit(x => x.ifPresent(success, failure));
    }

    public orThrow(): IStream<T> {
        return this.map(x => x.orThrow());
    }

    public orElse(backup: T): IStream<T> {
        return this.map(x => x.orElse(backup));
    }

    public discardError(handler: Consumer<Error> = console.error): IStream<T> {
        return this.onError(handler).filter(x => x.success).orThrow();
    }

    public flatConvert<S>(operation: Function<T, ITry<S>>, backup?: Function<Error, ITry<S>>): ITryStream<S> {
        this.check();
        const x = map(this.iterable, x => x.flatConvert(operation, backup));
        return new this.constructor(x) as object as ITryStream<S>;
    }

    public convert<S>(operation: Function<T, S>, backup?: Function<Error, S>): ITryStream<S> {
        this.check();
        const x = map(this.iterable, x => x.convert(operation, backup));
        return new this.constructor(x) as object as ITryStream<S>;
    }

    public orTry(backup: Function<Error, T>): this {
        this.check();
        const x = map(this.iterable, y => y.orTry(backup));
        return new this.constructor(x) as object as this;
    }
}
