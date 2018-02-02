import { Collector, Function, Predicate, Statistics } from "./Interfaces";
import { collect } from "./Methods";

function identity<T>() : (x:T) => T {
    return x => x;
} 

function toNumber<T>() : (x:T) => number {
    return x => Number(x);
}

class StatisticsImpl implements Statistics {
    private _count : number = 0;
    private _sum : number = 0;
    private _sum2 : number = 0;
    private _min : number = undefined;
    private _max : number = undefined;

    accept(value: number) {
        this._sum += value;
        this._sum2 += value * value;
        if (this._count > 0) {
            this._max = Math.max(this._max, value);
            this._min = Math.min(this._min, value);
        }  
        else {
            this._min = this._max = value;
        }
        this._count += 1;
    }

    get average() : number {
        return this._count > 0 ? this._sum / this._count : 0;
    }

    get count() : number {
        return this._count;
    }

    get max() : number {
        return this._max;    
    }

    get min() : number {
        return this._min;
    }

    get sum() : number {
        return this._sum;        
    }

    get variance() : number {
        if (this._count === 0) {
            return Infinity;
        }
        const average = this.average;
        return this._sum2 / this._count - average*average;
    }
}

export const Collectors = {

    toArray<T>() : Collector<T, T[]> {
        return {
            accumulator(collected: T[], item: T) : void {
                collected.push(item);
            },
            supplier() : T[] {
                return [];
            },
            finisher: identity()
        };
    },

    toSet<T>() : Collector<T, Set<T>> {
        return {
            accumulator(collected: Set<T>, item: T) : void {
                collected.add(item);
            },
            supplier() : Set<T> {
                return new Set();
            },
            finisher: identity()
        };
    },

    toMap<T,K,V>(keyMapper: Function<T,K>, valueMapper: Function<T,V>) : Collector<T, Map<K,V>> {
        return {
            accumulator(collected: Map<K,V>, item: T) : void {
                collected.set(keyMapper(item), valueMapper(item));
            },
            supplier() : Map<K,V> {
                return new Map();
            },
            finisher: identity()
        };
    },

    group<T,K>(classifier: Function<T,K>) : Collector<T, Map<K, T[]>> {
        return {
            accumulator(collected: Map<K,T[]>, item: T) : void {
                const key = classifier(item);
                const list = collected.get(key);
                if (list === undefined) {
                    collected.set(key, [item]);
                }
                else {
                    list.push(item);
                }
            },
            supplier() : Map<K, T[]> {
                return new Map();
            },
            finisher: identity()
        };
    },

    groupDown<T,K,A,D>(classifier: Function<T,K>, downstream: Collector<T,A,D>) : Collector<T, Map<K, T[]>, Map<K, D>> {
        return {
            accumulator(collected: Map<K,T[]>, item: T) : void {
                const key = classifier(item);
                const list = collected.get(key);
                if (list === undefined) {
                    collected.set(key, [item]);
                }
                else {
                    list.push(item);
                }
            },
            supplier() : Map<K, T[]> {
                return new Map();
            },
            finisher(result: Map<K,T[]>) : Map<K, D> {
                const x : Map<K,D> = new Map();
                for (let [key,value] of result.entries()) {
                    x.set(key, collect(value[Symbol.iterator](), downstream));
                }
                return x;
            } 
        };
    },

    join<T>(delimiter: string = "", prefix? : string, suffix? : string) : Collector<T, string[], string> {
        return {
            accumulator(collected: string[], item: T) {
                collected.push(String(item));
            },
            supplier() : string[] {
                return prefix != undefined ? [prefix] : [];
            },
            finisher(result: string[]) : string {
                return result.join(delimiter);
            }
        };
    },

    sum<T>() : Collector<T, {sum:number}, number> {
        return {
            accumulator(collected: {sum:number}, item: T) {
                collected.sum += Number(item);
            },

            supplier() : {sum:number} {
                return {sum:0};
            },

            finisher(result: {sum:number}) : number{
                return result.sum;
            }
        };
    },

    average<T>(converter: Function<T, number> = toNumber()) : Collector<T, {sum:number, count:number}, number> {
        return {
            accumulator(collected: {sum:number,count:number}, item: T) {
                collected.sum += converter(item);
                collected.count += 1;
            },

            supplier() : {sum:number,count:number} {
                return {sum:0, count:0};
            },
            
            finisher(result: {sum:number,count:number}) : number{
                return result.count > 0 ? result.sum / result.count : 0;
            }
        };
    },

    averageGeometrically<T>(converter: Function<T, number> = toNumber()) : Collector<T, {product:number, count:number}, number> {
        return {
            accumulator(collected: {product:number,count:number}, item: T) {
                collected.product *= converter(item);
                collected.count += 1;
            },

            supplier() : {product: number, count: number} {
                return {product:1, count:0};
            },
            
            finisher(result: {product: number, count: number}) : number {
                return result.count > 0 ? result.product / result.count : 0;
            }
        };
    },

    averageHarmonically<T>(converter: Function<T, number> = toNumber()) : Collector<T, {sum:number, count:number}, number> {
        return {
            accumulator(collected: {sum:number,count:number}, item: T) {
                collected.sum += 1.0 / converter(item);
                collected.count += 1;
            },

            supplier() : {sum: number, count: number} {
                return {sum:0, count:0};
            },
            
            finisher(result: {sum: number, count: number}) : number {
                return result.count / result.sum;
            }
        };
    },

    summarize<T>(converter: Function<T, number> = toNumber()) : Collector<T, StatisticsImpl, Statistics> {
        return {
            accumulator(collected: StatisticsImpl, item: T) {
                collected.accept(converter(item));
            },

            supplier() : StatisticsImpl {
                return new StatisticsImpl;
            },
            
            finisher: identity()
        };
    },    

    factor<T>() : Collector<T, {product:number}, number> {
        return {
            accumulator(collected: {product:number}, item: T) {
                collected.product *= Number(item);
            },

            supplier() : {product:number} {
                return {product:1};
            },
            
            finisher(result: {product:number}) : number{
                return result.product;
            }
        };
    },

    partition<T>(predicate: Predicate<T>) : Collector<T, {false:T[],true:T[]}> {
        return {
            accumulator(collected: {false:T[],true:T[]}, item: T) : void {
                if (predicate(item)) {
                    collected.true.push(item);
                }
                else {
                    collected.false.push(item);
                }
            },
            supplier() : {false:T[],true:T[]} {
                return {
                    false: [],
                    true: []
                };
            },
            finisher: identity()
        };
    },

    partitionDown<T,A,D>(predicate: Predicate<T>, downstream: Collector<T,A,D>) : Collector<T, {false:T[],true:T[]}, {false:D,true:D}> {
        return {
            accumulator(collected: {false:T[],true:T[]}, item: T) : void {
                if (predicate(item)) {
                    collected.true.push(item);
                }
                else {
                    collected.false.push(item);
                }
            },
            supplier() : {false:T[],true:T[]} {
                return {
                    false: [],
                    true: []
                };
            },
            finisher(result: {false:T[],true:T[]}) : {false:D,true:D} {
                return {
                    false: collect(result.false, downstream),
                    true: collect(result.true, downstream)
                };
            }
        };
    },    
}