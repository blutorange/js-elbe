export declare class LazyBufferedIterable<T> implements Iterable<T> {
    private iterator;
    private buffer;
    constructor(iterable: Iterable<T>);
    [Symbol.iterator](): Iterator<T>;
}
