import { EMPTY_ITERATOR } from "./util";

/**
 * Makes a copy of the elements returned by the given iterable so that
 * multiple iterations over these elements are possible. This is used
 * by IStream#fork.
 *
 * The original iterable is queried only on-demand, ie. when items are
 * requested from this iterable. This reduces memory consumption and
 * allows unlimited iterables to be buffered.
 *
 * ```javascript
 *
 * // An iterable that returns an unlimited amount of random numbers.
 * function * randomStream() {
 *   while(true) yield Math.random();
 * }
 *
 * // Many iterations over the same random numbers are possible with buffering.
 * const iterable = new LazyBufferedIterable(randomStream());
 * for (const it = iterable[Symbol.iterator](), i = 10; i-->0;)
 *   console.log(it.next().value);
 * for (const it = iterable[Symbol.iterator](), i = 10; i-->0;)
 *   console.log(it.next().value);
 * // => Both times the same random numbers are printed.
 *
 * // Illustrates buffered vs. unbuffered iterators
 * const set = new Set();
 * set.add(1);
 * set.add(2);
 * set.add(3);
 *
 * // An unbuffered iterables only returns its values once.
 * const unbuffered = set.values();
 * Array.from(unbuffered) // => [1,2,3]
 * Array.from(ubuffered) // => []
 *
 * // A buffered iterable can return them as many times as requested.
 * const buffered = new LazyBufferedIterable(set.values());
 * Array.from(buffered) // => [1,2,3]
 * Array.from(buffered) // => [1,2,3]
 * ```
 *
 */
export class LazyBufferedIterable<T> implements Iterable<T> {
    private iterator: Iterator<T>;

    private buffer: T[];

    constructor(iterable: Iterable<T>) {
        if (Array.isArray(iterable)) {
            this.buffer = iterable;
            this.iterator = EMPTY_ITERATOR;
        }
        else {
            this.iterator = iterable[Symbol.iterator]();
            this.buffer = [];
        }
    }

    public [Symbol.iterator](): Iterator<T> {
        const $ = this;
        let index = 0;
        return {
            next(value?: any): IteratorResult<T> {
                if (index >= $.buffer.length) {
                    const next = $.iterator.next();
                    if (!next.done) {
                        $.buffer.push(next.value);
                    }
                }
                const result = {
                    done: index >= $.buffer.length,
                    value: $.buffer[index],
                };
                index += 1;
                return result;
            },
        };
    }
}
