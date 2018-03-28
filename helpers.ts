const EMPTY_ITERATOR_RESULT: IteratorResult<any> = {
    done: true,
    value: undefined,
};

export const EMPTY_ITERATOR: Iterator<any> = {
    next(value?: any): IteratorResult<any> {
        return EMPTY_ITERATOR_RESULT;
    },
};

export const EMPTY_ITERABLE: Iterable<any> = {
    [Symbol.iterator](): Iterator<any> {
        return EMPTY_ITERATOR;
    },
};
