import { Comparator } from "comparators";

import { BiFunction, Stream, Consumer, Function, Predicate, Try } from "./Interfaces";
import { cycle, chunk, slice, zip, zipSame, visit, index, concat, unique, doTry, flatMap, limit, map, reverse, skip, sort, filter } from "./Methods";
import { AbstractStream } from "./AbstractStream";

export class InplaceStream extends AbstractStream<any> implements Stream<any> {

    chunk<K=any>(classifier: BiFunction<any, number, K>) : Stream<any[]> {
        this.iterable = chunk(this.iterable, classifier);
        return this;
    }

    concat(...iterables: Iterable<any>[]) : Stream<any> {
        this.iterable = concat(this.iterable, ...iterables);
        return this;
    }

    cycle(count?: number) : Stream<any> {
        this.iterable = cycle(this.iterable, count);
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

    visit(consumer: Consumer<any>) : Stream<any> {
        this.iterable = visit(this.iterable, consumer);
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

    slice(sliceSize: number) : Stream<any[]> {
        this.iterable = slice(this.iterable, sliceSize);
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

    unique(keyExtractor?: Function<any,any>) : Stream<any> {
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