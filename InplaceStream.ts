import { Comparator } from "comparators";

import { Stream, Consumer, IStreamFactory, Function, Predicate, Try } from "./Interfaces";
import { fromObject, fromObjectKeys, fromObjectValues, process, index, concat, unique, uniqueBy, doTry, flatMap, limit, map, reverse, skip, sort, generate, iterate, repeat, times, filter } from "./Methods";
import { AbstractStream } from "./AbstractStream";

class InplaceStream extends AbstractStream<any> implements Stream<any> {

    concat(...iterables: Iterable<any>[]) : Stream<any> {
        this.iterable = concat(this.iterable, ...iterables);
        return this;
    }

    unique() : Stream<any> {
        this.iterable = unique(this.iterable);
        return this;
    }

    uniqueBy(keyExtractor: Function<any,any>) : Stream<any> {
        this.iterable = uniqueBy(this.iterable, keyExtractor);
        return this;
    }

    flatMap<S>(mapper: Function<any,Iterable<S>>) : Stream<any> {
        this.iterable = flatMap(this.iterable, mapper);
        return this;
    }    

    filter(predicate : Predicate<any>) : Stream<any> {
        this.iterable = filter(this.iterable, predicate);
        return this;
    }

    index() : Stream<[number, any]> {
        this.iterable = index(this.iterable);
        return this;
    }
    
    limit(limitTo: number) : Stream<any> {
        this.iterable = limit(this.iterable, limitTo);
        return this;
    }

    map<S>(mapper : Function<any,S>) : Stream<any> {
        this.iterable = map(this.iterable, mapper);
        return this;
    }

    process(consumer: Consumer<any>) : Stream<any> {
        this.iterable = process(this.iterable, consumer);
        return this;        
    }

    reverse() : Stream<any> {
        this.iterable = reverse(this.iterable);
        return this;
    }

    skip(toSkip: number) : Stream<any> {
        this.iterable = skip(this.iterable, toSkip);
        return this;
    }

    sort(comparator?: Comparator<any>) : Stream<any> {
        this.iterable = sort(this.iterable, comparator);
        return this;
    }

    try<S>(mapper: Function<any,S>) : Stream<Try<any>> {
        this.iterable = doTry(this.iterable, mapper);
        return this;
    }

    static from<T>(items: Iterable<T>) : Stream<any> {
        return new InplaceStream(items);
    }

    static times(amount: number, start?: number, end?: number) : Stream<any> {
        return new InplaceStream(times(amount, start, end));
    }

    static generate<T>(generator: Function<number, T>, amount: number = -1) : Stream<any> {
        return new InplaceStream(generate(generator, amount));
    }

    static iterate<T>(seed: T, next: Function<T, T>, amount: number = -1) : Stream<any> {
        return new InplaceStream(iterate(seed, next, amount));
    }

    static repeat<T>(item: T, amount: number = -1) : Stream<any> {
        return new InplaceStream(repeat(item, amount));
    }

    static fromObject<T>(object: {[s: string] : T}) : Stream<[string,T]> {
        return new InplaceStream(fromObject(object));
    }

    static fromObjectKeys(object: {[s: string] : any}) : Stream<string> {
        return new InplaceStream(fromObjectKeys(object));
    }

    static fromObjectValues<T>(object: {[s: string] : T}) : Stream<T> {
        return new InplaceStream(fromObjectValues(object));
    }
};

export const InplaceStreamFactory : IStreamFactory = {
    from: InplaceStream.from,
    generate: InplaceStream.generate,
    iterate: InplaceStream.iterate,
    repeat: InplaceStream.repeat,
    times: InplaceStream.times,
    fromObject: InplaceStream.fromObject,
    fromObjectKeys: InplaceStream.fromObjectKeys,
    fromObjectValues: InplaceStream.fromObjectValues,
};