import {
    Comparator,
    Consumer,
    Decuple,
    Maybe,
    Nonuple,
    Octuple,
    Pair,
    Predicate,
    Quadruple,
    Quintuple,
    Septuple,
    Sextuple,
    Single,
    Triple,
    TypedBiFunction,
    TypedFunction,
} from "andross";

import { AbstractStream } from "./AbstractStream";

import { IStream, ITry, ITryStream } from "./Interfaces";

import {
    chunk,
    chunkBy,
    concat,
    consume,
    cycle,
    filter,
    filterBy,
    flatMap,
    index,
    limit,
    map,
    promise,
    reverse,
    skip,
    sort,
    sortBy,
    tryMap,
    unique,
    uniqueBy,
    visit,
    zip,
    zipSame,
} from "./Methods";

export class TypesafeStream<T> extends AbstractStream<T> {
    public ["constructor"]: (typeof TypesafeStream);

    public chunk(chunkSize: 0): IStream<never>;
    public chunk(chunkSize: 1): IStream<Single<T>>;
    public chunk(chunkSize: 2): IStream<Pair<T> | Single<T>>;
    public chunk(chunkSize: 3): IStream<Triple<T> | Pair<T> | Single<T>>;
    public chunk(chunkSize: 4): IStream<Quadruple<T> | Triple<T> | Pair<T> | Single<T>>;
    public chunk(chunkSize: 5): IStream<Quintuple<T> | Quadruple<T> | Triple<T> | Pair<T> | Single<T>>;
    public chunk(chunkSize: 6): IStream<Sextuple<T> | Quintuple<T> | Quadruple<T> | Triple<T> | Pair<T> | Single<T>>;
    public chunk(chunkSize: 7): IStream<Septuple<T> | Sextuple<T> | Quintuple<T> | Quadruple<T> | Triple<T> | Pair<T> | Single<T>>;
    public chunk(chunkSize: 8): IStream<Octuple<T> | Septuple<T> | Sextuple<T> | Quintuple<T> | Quadruple<T> | Triple<T> | Pair<T> | Single<T>>;
    public chunk(chunkSize: 9): IStream<Nonuple<T> | Octuple<T> | Septuple<T> | Sextuple<T> | Quintuple<T> | Quadruple<T> | Triple<T> | Pair<T> | Single<T>>;
    public chunk(chunkSize: 10): IStream<Decuple<T> | Nonuple<T> | Octuple<T> | Septuple<T> | Sextuple<T> | Quintuple<T> | Quadruple<T> | Triple<T> | Pair<T> | Single<T>>;
    public chunk(chunkSize: number): IStream<T[]>;
    public chunk(chunkSize: number): IStream<T[]> {
        this.check();
        return new TypesafeStream(chunk(this.iterable, chunkSize));
    }

    public chunkBy<K= any>(classifier: TypedBiFunction<T, number, K>): IStream<T[]> {
        this.check();
        return new TypesafeStream(chunkBy(this.iterable, classifier));
    }

    public concat(...iterables: Iterable<T>[]): this {
        this.check();
        return new this.constructor(concat(this.iterable, ...iterables)) as this;
    }

    public consume(sink: T[] | Consumer<T>, offset?: number, maxAmount?: number): this {
        this.check();
        return new this.constructor(consume(this.iterable, sink, offset, maxAmount)) as this;
    }

    public cycle(count?: number): this {
        this.check();
        return new this.constructor(cycle(this.iterable, count)) as this;
    }

    public flatMap<S>(mapper: TypedFunction<T, Iterable<S>>): IStream<S> {
        this.check();
        return new TypesafeStream(flatMap(this.iterable, mapper));
    }

    public filter(predicate: Predicate<T>): this {
        this.check();
        return new this.constructor(filter(this.iterable, predicate)) as this;
    }

    public filterBy<K>(target: K, keyExtractor: TypedFunction<T, K>, comparator?: Comparator<K>): this {
        this.check();
        return new this.constructor(filterBy(this.iterable, target, keyExtractor, comparator)) as this;
    }

    public index(): IStream<{index: number, value: T}> {
        this.check();
        return new TypesafeStream(index(this.iterable));
    }

    public limit(limitTo?: number): this {
        this.check();
        return new this.constructor(limit(this.iterable, limitTo)) as this;
    }

    public map<S>(mapper: TypedFunction<T, S>): IStream<S> {
        this.check();
        return new TypesafeStream(map(this.iterable, mapper));
    }

    public promise<S>(promiseConverter: TypedFunction<any, Promise<S>>): Promise<IStream<any>> {
        this.check();
        return promise(this.iterable, promiseConverter)
            .then(iterable => new TypesafeStream(iterable));
    }

    public replace(mapper: TypedFunction<T, T>): this {
        this.check();
        return new this.constructor(map(this.iterable, mapper)) as this;
    }

    public reverse(): this {
        this.check();
        return new this.constructor(reverse(this.iterable)) as this;
    }

    public skip(toSkip?: number): this {
        this.check();
        return new this.constructor(skip(this.iterable, toSkip)) as this;
    }

    public sort(comparator?: Comparator<T>): this {
        this.check();
        return new this.constructor(sort(this.iterable, comparator)) as this;
    }

    public sortBy<K>(keyExtractor: TypedFunction<T, K>, comparator?: Comparator<K>): this {
        this.check();
        return new this.constructor(sortBy(this.iterable, keyExtractor, comparator)) as this;
    }

    public try<S>(operation: TypedFunction<T, S>): ITryStream<S> {
        this.check();
        return new TryStreamImpl(tryMap(this.iterable, operation));
    }

    public unique(comparator?: Comparator<any>): this {
        this.check();
        return new this.constructor(unique(this.iterable, comparator)) as this;
    }

    public uniqueBy(keyExtractor: TypedFunction<T, any>): this {
        this.check();
        return new this.constructor(uniqueBy(this.iterable, keyExtractor)) as this;
    }

    public visit(consumer: Consumer<T>): this {
        this.check();
        return new this.constructor(visit(this.iterable, consumer)) as this;
    }

    public zip<S>(other: Iterable<S>): IStream<[Maybe<T>, Maybe<S>]> {
        this.check();
        return new TypesafeStream(zip(this.iterable, other));
    }

    public zipSame(...others: Iterable<T>[]): IStream<Maybe<T>[]> {
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
        return this.replace(x => x.include(predicate));
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

    public flatConvert<S>(operation: TypedFunction<T, ITry<S>>, backup?: TypedFunction<Error, ITry<S>>): ITryStream<S> {
        this.check();
        const x = map(this.iterable, x => x.flatConvert(operation, backup));
        return new this.constructor(x) as object as ITryStream<S>;
    }

    public convert<S>(operation: TypedFunction<T, S>, backup?: TypedFunction<Error, S>): ITryStream<S> {
        this.check();
        const x = map(this.iterable, x => x.convert(operation, backup));
        return new this.constructor(x) as object as ITryStream<S>;
    }

    public orTry(backup: TypedFunction<Error, T>): this {
        this.check();
        const x = map(this.iterable, y => y.orTry(backup));
        return new this.constructor(x) as object as this;
    }
}
