export const DONE_RESULT: IteratorResult<any> = {
    done: true,
    value: undefined,
}

export const EMPTY_ITERATOR: Iterator<any> = {
    next(value?: any) {
        return DONE_RESULT;
    }
};

export const EMPTY_ITERABLE: Iterable<any> = {
    [Symbol.iterator](): Iterator<any> {
        return EMPTY_ITERATOR;
    }
}

export function * wrapIterator<T>(iterator: Iterator<T>): Iterable<T> {
    for (let result = iterator.next(); !result.done; result = iterator.next()) {
        yield result.value;
    }
}

export function identity<T>(x: T): T  {
    return x;
}
