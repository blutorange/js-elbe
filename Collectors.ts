import {
    BinaryOperator,
    Function,
    ICollector,
    ICollectors,
    IStatistics,
    Predicate,
} from "./Interfaces";
import { identity, takeFirst, toNumber } from "./util";

class StatisticsImpl implements IStatistics {
    private Count: number = 0;
    private Sum: number = 0;
    private Sum2: number = 0;
    private Min: number = NaN;
    private Max: number = NaN;

    public accept(value: number) {
        this.Sum += value;
        this.Sum2 += value * value;
        if (this.Count > 0) {
            this.Max = Math.max(this.Max, value);
            this.Min = Math.min(this.Min, value);
        }
        else {
            this.Min = this.Max = value;
        }
        this.Count += 1;
    }

    public get average(): number {
        return this.Count > 0 ? this.Sum / this.Count : NaN;
    }

    public get count(): number {
        return this.Count;
    }

    public get max(): number {
        return this.Max;
    }

    public get min(): number {
        return this.Min;
    }

    public get sum(): number {
        if (this.Count === 0) {
            return NaN;
        }
        return this.Sum;
    }

    public get variance(): number {
        if (this.Count === 0) {
            return NaN;
        }
        const average = this.average;
        return this.Sum2 / this.Count - average * average;
    }

    public toJSON(): {average: number, count: number, max: number, min: number, sum: number, variance: number} {
        return {
            average: this.average,
            count: this.count,
            max: this.max,
            min: this.min,
            sum: this.sum,
            variance: this.variance,
        };
    }
}

/**
 * This implements the factory methods as defined by the interface {@link ICollectors}.
 * @see {@link ICollectors}
 */
export const Collectors: ICollectors = {
    toArray<T>(): ICollector<T, T[]> {
        return {
            accumulator(collected: T[], item: T): void {
                collected.push(item);
            },
            supplier(): T[] {
                return [];
            },
            finisher: identity,
        };
    },

    count(): ICollector<any, { count: number }, number> {
        return {
            accumulator(collected: { count: number }, item: any): void {
                collected.count += 1;
            },
            supplier(): { count: number } {
                return {
                    count: 0,
                };
            },
            finisher(result: { count: number }): number {
                return result.count;
            },
        };
    },

    toSet<T>(): ICollector<T, Set<T>> {
        return {
            accumulator(collected: Set<T>, item: T): void {
                collected.add(item);
            },
            supplier(): Set<T> {
                return new Set();
            },
            finisher: identity,
        };
    },

    toMap<T, K, V>(keyMapper: Function<T, K>, valueMapper: Function<T, V>, merger: BinaryOperator<V> = takeFirst): ICollector<T, Map<K, V>, Map<K, V>> {
        return {
            accumulator(collected: Map<K, V>, item: T): void {
                const key = keyMapper(item);
                const val = valueMapper(item);
                if (collected.has(key)) {
                    collected.set(key, merger(collected.get(key) as V, val));
                }
                else {
                    collected.set(key, val);
                }
            },
            supplier(): Map<K, V> {
                return new Map();
            },
            finisher: identity,
        };
    },

    group<T, K>(classifier: Function<T, K>): ICollector<T, Map<K, T[]>> {
        return {
            accumulator(collected: Map<K, T[]>, item: T): void {
                const key = classifier(item);
                const list = collected.get(key);
                if (list === undefined) {
                    collected.set(key, [item]);
                }
                else {
                    list.push(item);
                }
            },
            supplier(): Map<K, T[]> {
                return new Map();
            },
            finisher: identity,
        };
    },

    groupDown<T, K, A, D>(classifier: Function<T, K>, downstream: ICollector<T, A, D>): ICollector<T, Map<K, A>, Map<K, D>> {
        return {
            accumulator(collected: Map<K, A>, item: T): void {
                const key = classifier(item);
                if (collected.has(key)) {
                    downstream.accumulator(collected.get(key) as A, item);
                }
                else {
                    const a = downstream.supplier();
                    collected.set(key, a);
                    downstream.accumulator(a, item);
                }
            },
            supplier(): Map<K, A> {
                return new Map();
            },
            finisher(result: Map<K, A>): Map<K, D> {
                const x: Map<K, D> = new Map();
                for (const [key, value] of result.entries()) {
                    x.set(key, downstream.finisher(value));
                }
                return x;
            },
        };
    },

    map<T, U, A, R>(mapper: Function<T, U>, downstream: ICollector<U, A, R>): ICollector<T, A, R> {
        return {
            accumulator(collected: A, item: T): void {
                downstream.accumulator(collected, mapper(item));
            },
            supplier(): A {
                return downstream.supplier();
            },
            finisher(result: A): R {
                return downstream.finisher(result);
            },
        };
    },

    join<T>(delimiter: string = "", prefix?: string, suffix?: string): ICollector<T, string[], string> {
        return {
            accumulator(collected: string[], item: T) {
                collected.push(String(item));
            },
            supplier(): string[] {
                return prefix !== undefined ? [] : [];
            },
            finisher(result: string[]): string {
                if (prefix !== undefined) {
                    if (suffix !== undefined) {
                        return prefix.concat(result.join(delimiter)).concat(suffix);
                    }
                    return prefix.concat(result.join(delimiter));
                }
                if (suffix !== undefined) {
                    return result.join(delimiter).concat(suffix);
                }
                return result.join(delimiter);
            },
        };
    },

    sum<T>(converter: Function<T, number> = toNumber): ICollector<T, { sum: number, count: number }, number> {
        return {
            accumulator(collected: { sum: number, count: number }, item: T) {
                collected.sum += converter(item);
                collected.count += 1;
            },

            supplier(): { sum: number, count: number } {
                return { sum: 0, count: 0 };
            },

            finisher(result: { sum: number, count: number }): number {
                return result.count > 0  ? result.sum : NaN;
            },
        };
    },

    average<T>(converter: Function<T, number> = toNumber): ICollector<T, { sum: number, count: number }, number> {
        return {
            accumulator(collected: { sum: number, count: number }, item: T) {
                collected.sum += converter(item);
                collected.count += 1;
            },

            supplier(): { sum: number, count: number } {
                return { sum: 0, count: 0 };
            },

            finisher(result: { sum: number, count: number }): number {
                return result.count > 0 ? result.sum / result.count : NaN;
            },
        };
    },

    averageGeometrically<T>(converter: Function<T, number> = toNumber): ICollector<T, { product: number, count: number }, number> {
        return {
            accumulator(collected: { product: number, count: number }, item: T) {
                collected.product *= converter(item);
                collected.count += 1;
            },

            supplier(): { product: number, count: number } {
                return { product: 1, count: 0 };
            },

            finisher(result: { product: number, count: number }): number {
                return result.count > 0 ? Math.pow(result.product, 1 / result.count) : NaN;
            },
        };
    },

    averageHarmonically<T>(converter: Function<T, number> = toNumber): ICollector<T, { sum: number, count: number }, number> {
        return {
            accumulator(collected: { sum: number, count: number }, item: T) {
                collected.sum += 1.0 / converter(item);
                collected.count += 1;
            },

            supplier(): { sum: number, count: number } {
                return { sum: 0, count: 0 };
            },

            finisher(result: { sum: number, count: number }): number {
                return result.count > 0 ? result.count / result.sum : NaN;
            },
        };
    },

    summarize<T>(converter: Function<T, number> = toNumber): ICollector<T, any, IStatistics> {
        return {
            accumulator(collected: StatisticsImpl, item: T) {
                collected.accept(converter(item));
            },

            supplier(): StatisticsImpl {
                return new StatisticsImpl();
            },
            finisher: identity,
        };
    },

    multiply<T>(converter: Function<T, number> = toNumber): ICollector<T, { product: number, count: number }, number> {
        return {
            accumulator(collected: { product: number, count: number }, item: T) {
                collected.product *= converter(item);
                collected.count += 1;
            },

            supplier(): { product: number, count: number } {
                return { product: 1, count: 0 };
            },

            finisher(result: { product: number, count: number }): number {
                return result.count > 0 ? result.product : NaN;
            },
        };
    },

    partition<T>(predicate: Predicate<T>): ICollector<T, { false: T[], true: T[] }> {
        return {
            accumulator(collected: { false: T[], true: T[] }, item: T): void {
                if (predicate(item)) {
                    collected.true.push(item);
                }
                else {
                    collected.false.push(item);
                }
            },
            supplier(): { false: T[], true: T[] } {
                return {
                    false: [],
                    true: [],
                };
            },
            finisher: identity,
        };
    },

    partitionDown<T, A, D>(predicate: Predicate<T>, downstream: ICollector<T, A, D>): ICollector<T, { false: A, true: A }, { false: D, true: D }> {
        return {
            accumulator(collected: { false: A, true: A }, item: T): void {
                if (predicate(item)) {
                    downstream.accumulator(collected.true, item);
                }
                else {
                    downstream.accumulator(collected.false, item);
                }
            },
            supplier(): { false: A, true: A } {
                return {
                    false: downstream.supplier(),
                    true: downstream.supplier(),
                };
            },
            finisher(result: { false: A, true: A }): { false: D, true: D } {
                return {
                    false: downstream.finisher(result.false),
                    true: downstream.finisher(result.true),
                };
            },
        };
    },
};
