import { Comparator } from "comparators";

import { IStreamFactory, Stream, Consumer, Function, Predicate, Try } from "./Interfaces";
import { fromObject, fromObjectKeys, process, index, fromObjectValues, concat, unique, uniqueBy, doTry, flatMap, limit, map, reverse, skip, sort, generate, iterate, repeat, times, filter } from "./Methods";
import { AbstractStream } from "./AbstractStream";

class TypesafeStream<T> extends AbstractStream<T> implements Stream<T> {
    concat(...iterables: Iterable<T>[]) : Stream<T> {
        this.check();
        return new TypesafeStream(concat(this.iterable, ...iterables));
    }

    unique() : Stream<T> {
        this.check();
        return new TypesafeStream(unique(this.iterable));
    }

    uniqueBy(keyExtractor: Function<T,any>) : Stream<T> {
        this.check();
        return new TypesafeStream(uniqueBy(this.iterable, keyExtractor));
    }

    flatMap<S>(mapper: Function<T,Iterable<S>>) : Stream<S> {
        this.check();
        return new TypesafeStream(flatMap(this.iterable, mapper));
    }    

    filter(predicate : Predicate<T>) : Stream<T> {
        this.check();
        return new TypesafeStream(filter(this.iterable, predicate));
    }

    index() : Stream<[number, T]> {
        return new TypesafeStream(index(this.iterable));
    }
 
    limit(limitTo: number) : Stream<T> {
        this.check();
        return new TypesafeStream(limit(this.iterable, limitTo));
    }

    map<S>(mapper : Function<T,S>) : Stream<S> {
        this.check();
        return new TypesafeStream(map(this.iterable, mapper));
    }

    process(consumer: Consumer<T>) : Stream<T> {
        this.check();
        return new TypesafeStream(process(this.iterable, consumer));
    }

    reverse() : Stream<T> {
        this.check();
        return new TypesafeStream(reverse(this.iterable));
    }

    skip(toSkip: number) : Stream<T> {
        this.check();
        return new TypesafeStream(skip(this.iterable, toSkip));
    }

    sort(comparator?: Comparator<T>) : Stream<T> {
        this.check();
        return new TypesafeStream(sort(this.iterable, comparator));
    }
    
    try<S>(mapper: Function<T,S>) : Stream<Try<S>> {
        this.check();
        return new TypesafeStream(doTry(this.iterable, mapper));
    }

    static from<T>(items: Iterable<T>) : Stream<T> {
        return new TypesafeStream(items);
    }

    static generate<T>(generator: Function<number, T>, amount: number = -1) : Stream<T> {
        return new TypesafeStream(generate(generator, amount));
    }

    static iterate<T>(seed: T, next: Function<T,T>, amount: number = -1) : Stream<T> {
        return new TypesafeStream(iterate(seed, next, amount));
    }

    static repeat<T>(item: T, amount: number = -1) : Stream<T> {
        return new TypesafeStream(repeat(item, amount));
    }

    static times(amount: number, start?: number, end?: number) : Stream<number> {
        return new TypesafeStream(times(amount, start, end));
    }

    static fromObject<T>(object: {[s: string] : T}) : Stream<[string,T]> {
        return new TypesafeStream(fromObject(object));
    }

    static fromObjectKeys(object: {[s: string] : any}) : Stream<string> {
        return new TypesafeStream(fromObjectKeys(object));
    }

    static fromObjectValues<T>(object: {[s: string] : T}) : Stream<T> {
        return new TypesafeStream(fromObjectValues(object));
    }
};

export const TypesafeStreamFactory : IStreamFactory = {
    from: TypesafeStream.from,
    generate: TypesafeStream.generate,
    iterate: TypesafeStream.iterate,
    repeat: TypesafeStream.repeat,
    times: TypesafeStream.times,
    fromObject: TypesafeStream.fromObject,
    fromObjectKeys: TypesafeStream.fromObjectKeys,
    fromObjectValues: TypesafeStream.fromObjectValues,
};