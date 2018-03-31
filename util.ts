export const DONE_RESULT: IteratorResult<any> = {
    done: true,
    value: undefined,
};

export const EMPTY_ITERATOR: Iterator<any> = {
    next(value?: any) {
        return DONE_RESULT;
    },
};

export const EMPTY_ITERABLE: Iterable<any> = {
    [Symbol.iterator](): Iterator<any> {
        return EMPTY_ITERATOR;
    },
};

export function * wrapIterator<T>(iterator: Iterator<T>): Iterable<T> {
    for (let result = iterator.next(); !result.done; result = iterator.next()) {
        yield result.value;
    }
}

export function identity<T>(x: T): any  {
    return x;
}

export function toNumber<T>(x: T): number {
    return Number(x);
}

export function takeFirst<T>(arg1: T, arg2: T): T {
    return arg1;
}

export function appendCause(error: Error, cause: Error) {
    error.stack += "\nCaused by: " + cause.stack;
}
