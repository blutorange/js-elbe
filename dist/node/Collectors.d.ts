import { Collector, Function, Predicate, Statistics } from "./Interfaces";
export declare const Collectors: {
    toArray<T>(): Collector<T, T[], T[]>;
    toSet<T>(): Collector<T, Set<T>, Set<T>>;
    toMap<T, K, V>(keyMapper: Function<T, K>, valueMapper: Function<T, V>): Collector<T, Map<K, V>, Map<K, V>>;
    group<T, K>(classifier: Function<T, K>): Collector<T, Map<K, T[]>, Map<K, T[]>>;
    groupDown<T, K, A, D>(classifier: Function<T, K>, downstream: Collector<T, A, D>): Collector<T, Map<K, T[]>, Map<K, D>>;
    join<T>(delimiter?: string, prefix?: string, suffix?: string): Collector<T, string[], string>;
    sum<T>(converter?: Function<T, number>): Collector<T, {
        sum: number;
    }, number>;
    average<T>(converter?: Function<T, number>): Collector<T, {
        sum: number;
        count: number;
    }, number>;
    averageGeometrically<T>(converter?: Function<T, number>): Collector<T, {
        product: number;
        count: number;
    }, number>;
    averageHarmonically<T>(converter?: Function<T, number>): Collector<T, {
        sum: number;
        count: number;
    }, number>;
    summarize<T>(converter?: Function<T, number>): Collector<T, any, Statistics>;
    factor<T>(): Collector<T, {
        product: number;
    }, number>;
    partition<T>(predicate: Predicate<T>): Collector<T, {
        false: T[];
        true: T[];
    }, {
        false: T[];
        true: T[];
    }>;
    partitionDown<T, A, D>(predicate: Predicate<T>, downstream: Collector<T, A, D>): Collector<T, {
        false: T[];
        true: T[];
    }, {
        false: D;
        true: D;
    }>;
};
