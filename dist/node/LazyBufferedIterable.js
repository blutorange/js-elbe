"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LazyBufferedIterable {
    constructor(iterable) {
        this.iterator = iterable[Symbol.iterator]();
        this.buffer = [];
    }
    [Symbol.iterator]() {
        const $ = this;
        let index = 0;
        return {
            next(value) {
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
        };
    }
}
exports.LazyBufferedIterable = LazyBufferedIterable;
