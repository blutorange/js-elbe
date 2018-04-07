import {
    Comparator,
    Consumer,
    Maybe,
    Predicate,
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

export class InplaceStream extends AbstractStream<any> {
    public ["constructor"]: (typeof InplaceStream);

    public chunk(chunkSize: number): IStream<any[]> {
        this.iterable = chunk(this.iterable, chunkSize);
        return this;
    }

    public chunkBy<K = any>(classifier: TypedBiFunction<any, number, K>): IStream<any[]> {
        this.iterable = chunkBy(this.iterable, classifier);
        return this;
    }

    public concat(...iterables: Iterable<any>[]): this {
        this.iterable = concat(this.iterable, ...iterables);
        return this;
    }

    public consume(sink: any[] | Consumer<any>, offset?: number, maxAmount?: number): this {
        this.checkOnly();
        this.iterable = consume(this.iterable, sink, offset, maxAmount);
        return this;
    }

    public cycle(count?: number): this {
        this.iterable = cycle(this.iterable, count);
        return this;
    }

    public flatMap<S>(mapper: TypedFunction<any, Iterable<S>>): IStream<any> {
        this.iterable = flatMap(this.iterable, mapper);
        return this;
    }

    public filter(predicate: Predicate<any>): this {
        this.iterable = filter(this.iterable, predicate);
        return this;
    }

    public filterBy<K>(target: K, keyExtractor: TypedFunction<any, K>, comparator?: Comparator<K>): this {
        this.iterable = filterBy(this.iterable, target, keyExtractor, comparator);
        return this;
    }

    public index(): IStream<{index: number, value: any}> {
        this.iterable = index(this.iterable);
        return this;
    }

    public limit(limitTo?: number): this {
        this.iterable = limit(this.iterable, limitTo);
        return this;
    }

    public map<S>(mapper: TypedFunction<any, S>): IStream<any> {
        this.iterable = map(this.iterable, mapper);
        return this;
    }

    public promise<S>(promiseConverter: TypedFunction<any, Promise<S>>): Promise<IStream<any>> {
        this.check();
        return promise(this.iterable, promiseConverter)
            .then(iterable => new InplaceStream(iterable));
    }

    public replace<S>(mapper: TypedFunction<any, S>): this {
        this.iterable = map(this.iterable, mapper);
        return this;
    }

    public visit(consumer: Consumer<any>): this {
        this.iterable = visit(this.iterable, consumer);
        return this;
    }

    public reverse(): this {
        this.iterable = reverse(this.iterable);
        return this;
    }

    public skip(toSkip?: number): this {
        this.iterable = skip(this.iterable, toSkip);
        return this;
    }

    public sort(comparator?: Comparator<any>): this {
        this.iterable = sort(this.iterable, comparator);
        return this;
    }

    public sortBy<K>(keyExtractor: TypedFunction<any, K>, comparator?: Comparator<K>): this {
        this.iterable = sortBy(this.iterable, keyExtractor, comparator);
        return this;
    }

    public try<S>(operation: TypedFunction<any, S>): ITryStream<S> {
        const x = tryMap(this.iterable, operation);
        return new TryStreamImpl(x);
    }

    public unique(comparator?: Comparator<any>): this {
        this.iterable = unique(this.iterable, comparator);
        return this;
    }

    public uniqueBy(keyExtractor: TypedFunction<any, any>): this {
        this.iterable = uniqueBy(this.iterable, keyExtractor);
        return this;
    }

    public zip<S>(other: Iterable<S>): IStream<[Maybe<any>, Maybe<any>]> {
        this.iterable = zip(this.iterable, other);
        return this;
    }

    public zipSame(...others: Iterable<any>[]): IStream<Maybe<any>[]> {
        this.iterable = zipSame(this.iterable, others);
        return this;
    }

    protected clone(iterable: Iterable<any>): this {
        return new this.constructor(iterable) as this;
    }
}

class TryStreamImpl extends InplaceStream implements ITryStream<any> {
    public forEachResult(success: Consumer<any>, error?: Consumer<Error>): void {
        if (error === undefined) {
            error = console.error;
        }
        return this.forEach(x => x.ifPresent(success, error));
    }

    public include(predicate: Predicate<any>): this {
        return this.replace(x => x.include(predicate));
    }

    public onError(handler: Consumer<Error>): this {
        return this.visit((x: ITry<any>) => x.ifAbsent(e => handler(e)));
    }

    public onSuccess(success: Consumer<any>, failure: Consumer<Error>): this {
        return this.visit(x => x.ifPresent(success, failure));
    }

    public orThrow(): IStream<any> {
        return this.map(x => x.orThrow());
    }

    public orElse(backup: any): IStream<any> {
        return this.map(x => x.orElse(backup));
    }

    public discardError(handler: Consumer<Error> = console.error): IStream<any> {
        return this.onError(handler).filter(x => x.success).orThrow();
    }

    public flatConvert<S>(operation: TypedFunction<any, ITry<S>>, backup?: TypedFunction<Error, ITry<S>>): ITryStream<S> {
        this.iterable = map(this.iterable, x => x.flatConvert(operation, backup));
        return this;
    }

    public convert<S>(operation: TypedFunction<any, S>, backup?: TypedFunction<Error, S>): ITryStream<any> {
        this.iterable = map(this.iterable, x => x.convert(operation, backup));
        return this;
    }

    public orTry(backup: TypedFunction<Error, any>): this {
        this.iterable = map(this.iterable, y => y.orTry(backup));
        return this;
    }
}
