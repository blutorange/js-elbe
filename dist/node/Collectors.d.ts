import { Function, ICollector, IStatistics, Predicate } from "./Interfaces";
export declare const Collectors: {
    toArray<T>(): ICollector<T, T[], T[]>;
    count(): ICollector<any, {
        count: number;
    }, number>;
    toSet<T>(): ICollector<T, Set<T>, Set<T>>;
    toMap<T, K, V>(keyMapper: Function<T, K>, valueMapper: Function<T, V>): ICollector<T, Map<K, V>, Map<K, V>>;
    group<T, K>(classifier: Function<T, K>): ICollector<T, Map<K, T[]>, Map<K, T[]>>;
    groupDown<T, K, A, D>(classifier: Function<T, K>, downstream: ICollector<T, A, D>): ICollector<T, Map<K, T[]>, Map<K, D>>;
    join<T>(delimiter?: string, prefix?: string, suffix?: string): ICollector<T, string[], string>;
    sum<T>(converter?: Function<T, number>): ICollector<T, {
        sum: number;
    }, number>;
    average<T>(converter?: Function<T, number>): ICollector<T, {
        sum: number;
        count: number;
    }, number>;
    averageGeometrically<T>(converter?: Function<T, number>): ICollector<T, {
        product: number;
        count: number;
    }, number>;
    averageHarmonically<T>(converter?: Function<T, number>): ICollector<T, {
        sum: number;
        count: number;
    }, number>;
    summarize<T>(converter?: Function<T, number>): ICollector<T, any, IStatistics>;
    factor<T>(): ICollector<T, {
        product: number;
    }, number>;
    partition<T>(predicate: Predicate<T>): ICollector<T, {
        false: T[];
        true: T[];
    }, {
        false: T[];
        true: T[];
    }>;
    partitionDown<T, A, D>(predicate: Predicate<T>, downstream: ICollector<T, A, D>): ICollector<T, {
        false: T[];
        true: T[];
    }, {
        false: D;
        true: D;
    }>;
};
