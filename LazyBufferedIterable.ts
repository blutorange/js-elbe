export class LazyBufferedIterable<T> implements Iterable<T> {
    private iterator: Iterator<T>;
    private buffer: T[];
    constructor(iterable: Iterable<T>) {
        this.iterator = iterable[Symbol.iterator]();
        this.buffer = [];
    }
    [Symbol.iterator](): Iterator<T> {
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
                    value: $.buffer[index]
                };
                index += 1;
                return result;
            }            
        }
    }
}