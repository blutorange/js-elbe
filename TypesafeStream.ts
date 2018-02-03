import { Comparator } from "comparators";

import { BiFunction, Stream, Consumer, Function, Predicate, Try } from "./Interfaces";
import { cycle, chunk, slice, zip, zipSame, visit, index, concat, unique, doTry, flatMap, limit, map, reverse, skip, sort, filter } from "./Methods";
import { AbstractStream } from "./AbstractStream";

export class TypesafeStream<T> extends AbstractStream<T> implements Stream<T> {

    chunk<K=any>(classifier: BiFunction<T, number, K>) : Stream<T[]> {
        this.check();
        return new TypesafeStream(chunk(this.iterable, classifier));
    }

    concat(...iterables: Iterable<T>[]) : Stream<T> {
        this.check();
        return new TypesafeStream(concat(this.iterable, ...iterables));
    }

    cycle(count?: number) : Stream<T> {
        this.check();
        return new TypesafeStream(cycle(this.iterable, count));
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

    visit(consumer: Consumer<T>) : Stream<T> {
        this.check();
        return new TypesafeStream(visit(this.iterable, consumer));
    }

    reverse() : Stream<T> {
        this.check();
        return new TypesafeStream(reverse(this.iterable));
    }

    skip(toSkip: number) : Stream<T> {
        this.check();
        return new TypesafeStream(skip(this.iterable, toSkip));
    }

    slice(sliceSize: number) : Stream<T[]> {
        this.check();
        return new TypesafeStream(slice(this.iterable, sliceSize));
    }

    sort(comparator?: Comparator<T>) : Stream<T> {
        this.check();
        return new TypesafeStream(sort(this.iterable, comparator));
    }
    
    try<S>(mapper: Function<T,S>) : Stream<Try<S>> {
        this.check();
        return new TypesafeStream(doTry(this.iterable, mapper));
    }

    unique(keyExtractor?: Function<T,any>) : Stream<T> {
        this.check();
        return new TypesafeStream(unique(this.iterable, keyExtractor));
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