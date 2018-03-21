import { Consumer, Function, IStream, IStreamFactory, ITry, ITryFactory, Predicate, Supplier } from "./Interfaces";
import { TypesafeStreamFactory } from "./StreamFactory";

function isTry<S>(result: S | ITry<S>): result is ITry<S> {
    return result instanceof BaseTryImpl;
}

function appendCause(error: Error, cause: Error) {
    error.stack += "\nCaused by: " + cause.stack;
}

abstract class BaseTryImpl<T> {
    public abstract get success(): boolean;

    public abstract iterate(): Iterable<T | Error>;

    public abstract convert<S>(success: Function<T, S>, backup?: Function<Error, S>): ITry<S>;

    protected abstract get result(): T | Error;

    public stream(factory: IStreamFactory = TypesafeStreamFactory): IStream<T | Error> {
        return factory.stream(this.iterate());
    }

    public then<S>(success: Function<T, S | ITry<S>>, failure?: Function<Error, S | ITry<S>>): ITry<S> {
        return this
            .convert(success, failure)
            .flatConvert(v => isTry(v) ? v : TryFactory.success(v));
    }

    public catch(backup: Function<Error, T | ITry<T>>): ITry<T> {
        return this.then(x => x, backup);
    }

    public toString(): string {
        return `Try[success=${this.success},${String(this.result)}]`;
    }
}

class FailureImpl<T> extends BaseTryImpl<T> implements ITry<T> {
    private error: Error;

    public constructor(error: Error) {
        super();
        this.error = error;
    }

    public get success(): boolean {
        return false;
    }

    protected get result(): Error {
        return this.error;
    }

    public toJSON(): { success: boolean, result: T | string } {
        return {
            result: this.error.toString(),
            success: this.success,
        };
    }

    public convert<S>(success: Function<T, S>, backup?: Function<Error, S>): ITry<S> {
        if (backup !== undefined) {
            return TryFactory.of(() => backup(this.error), this.error);
        }
        // undefined is both a T and S, so we can reuse this try
        return this as ITry<any>;
    }

    public flatConvert<S>(mapper: Function<T, ITry<S>>, backup?: Function<Error, ITry<S>>): ITry<S> {
        if (backup !== undefined) {
            return TryFactory.flatOf(() => backup(this.error), this.error);
        }
        // undefined is both a T and S, so we can reuse this
        return this as ITry<any>;
    }

    public include(predicate: Predicate<T>): ITry<T> {
        return TryFactory.error(new Error("Value does not match the predicate as it does not exist."), this.error);
    }

    public orTry(backup: Function<Error, T>): ITry<T> {
        return TryFactory.of(() => backup(this.error), this.error);
    }

    public orFlatTry(backup: Function<Error, ITry<T>>): ITry<T> {
        return TryFactory.flatOf(() => backup(this.error), this.error);
    }

    public orElse(backup: T): T {
        return backup;
    }

    public orThrow(): T {
        throw this.error;
    }

    public ifPresent(success: Consumer<T>, failure?: Consumer<Error>): this {
        if (failure !== undefined) {
            failure(this.error);
        }
        return this;
    }

    public ifAbsent(consumer: Consumer<Error>): this {
        consumer(this.error);
        return this;
    }

    public * iterate(): Iterable<T | Error> {
        yield this.error;
    }

    public unwrap(): T | Error {
        return this.error;
    }
}

class SuccessImpl<T> extends BaseTryImpl<T> implements ITry<T> {
    private value: T;

    public constructor(value: T) {
        super();
        this.value = value;
    }

    public get success(): boolean {
        return true;
    }

    protected get result(): T {
        return this.value;
    }

    public toJSON(): { success: boolean, result: T | string } {
        return {
            result: this.value,
            success: this.success,
        };
    }

    public convert<S>(operation: Function<T, S>, backup?: Function<Error, S>): ITry<S> {
        const c = TryFactory.of(() => operation(this.value));
        return backup !== undefined ? c.orTry(backup) : c;
    }

    public flatConvert<S>(operation: Function<T, ITry<S>>, backup?: Function<Error, ITry<S>>): ITry<S> {
        const c = TryFactory.flatOf(() => operation(this.value));
        return backup !== undefined ? c.orFlatTry(backup) : c;
    }

    public include(predicate: Predicate<T>): ITry<T> {
        if (predicate(this.value)) {
            return this;
        }
        return TryFactory.error(new Error("Value does not match the predicate."));
    }

    public orTry(backup: Function<Error, T>): ITry<T> {
        return this;
    }

    public orFlatTry(backup: Function<Error, ITry<T>>): ITry<T> {
        return this;
    }

    public orElse(backup: T): T {
        return this.value;
    }

    public orThrow(): T {
        return this.value;
    }

    public ifPresent(success: Consumer<T>, failure?: Consumer<Error>): this {
        success(this.value);
        return this;
    }

    public ifAbsent(consumer: Consumer<Error>): this {
        return this;
    }

    public * iterate(): Iterable<T | Error> {
        yield this.value;
    }

    public unwrap(): T | Error {
        return this.value;
    }
}

export const TryFactory: ITryFactory = {
    success<T>(value: T): ITry<T> {
        return new SuccessImpl(value);
    },

    error<T>(error: Error | string, cause?: Error): ITry<T> {
        const e = error instanceof Error ? error : new Error(error);
        if (cause !== undefined) {
            appendCause(e, cause);
        }
        return new FailureImpl(e);
    },

    of<T>(action: Supplier<T>, cause?: Error): ITry<T> {
        try {
            return TryFactory.success(action());
        }
        catch (error) {
            return TryFactory.error(error, cause);
        }
    },

    flatOf<T>(action: Supplier<ITry<T>>, cause?: Error): ITry<T> {
        try {
            return action();
        }
        catch (error) {
            return TryFactory.error(error, cause);
        }
    },
};
