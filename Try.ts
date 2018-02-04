import { Consumer, StreamFactory, Stream, Predicate, Function, Supplier, Try, ITryFactory } from "./Interfaces";
import { TypesafeStreamFactory } from "./StreamFactory";

function isTry<S>(result: S|Try<S>) : result is Try<S> {
    return result instanceof BaseTryImpl;
}

function appendCause(error: Error, cause: Error) {
    error.stack += "\nCaused by: " + cause.stack;    
}

abstract class BaseTryImpl<T> {
    public abstract get success() : boolean;

    public abstract iterate() : Iterable<T|Error>;

    public abstract convert<S>(success: Function<T, S>, backup?: Function<Error,S>): Try<S>;

    protected abstract get result() : T|Error;

    public stream(factory: StreamFactory = TypesafeStreamFactory) : Stream<T|Error> {
        return factory.stream(this.iterate());
    }

    public then<S>(success: Function<T, S|Try<S>>, failure: Function<Error, S|Try<S>>) : Try<S> {
        return this
            .convert(success, failure)
            .flatConvert(v => isTry(v) ? v : TryFactory.success(v));
    }

    public catch(backup: Function<Error, T|Try<T>>) : Try<T> {
        return this.then(x => x, backup);
    }

    public toString() : string {
        return `Try[success=${this.success},${String(this.result)}]`;
    }

    public toJSON() : {success:boolean, result:T|Error} {
        return {
            success: this.success,
            result: this.result
        };
    }
}

class FailureImpl<T> extends BaseTryImpl<T> implements Try<T> {
    private error: Error;

    public constructor(error: Error) {
        super();
        this.error = error;
    }

    get success() : boolean {
        return true;
    }

    protected get result() : Error {
        return this.error;
    }

    convert<S>(success: Function<T, S>, backup?: Function<Error,S>): Try<S> {
        if (backup !== undefined) {
            return TryFactory.of(() => backup(this.error), this.error);
        }
        // undefined is both a T and S, so we can reuse this try
        return this as Try<any>;
    }

    flatConvert<S>(mapper: Function<T, Try<S>>, backup?: Function<Error,Try<S>>): Try<S> {
        if (backup !== undefined) {
            return TryFactory.flatOf(() => backup(this.error), this.error);
        }
        // undefined is both a T and S, so we can reuse this
        return this as Try<any>;
    }

    include(predicate: Predicate<T>) : Try<T> {
        return TryFactory.error(new Error("Value does not match the predicate as it does not exist."), this.error);
    }
    
    orTry(backup: Function<Error, T>): Try<T> {
        return TryFactory.of(() => backup(this.error), this.error);
    }

    orFlatTry(backup: Function<Error, Try<T>>): Try<T> {
        return TryFactory.flatOf(() => backup(this.error), this.error);
    }

    orElse(backup: T): T {
        return backup;
    }

    orThrow() : T {
        throw this.error;
    }

    ifPresent(success: Consumer<T>, failure?: Consumer<Error>) : this {
        if (failure !== undefined) {
            failure(this.error);
        }
        return this;
    }

    ifAbsent(consumer: Consumer<Error>) : this {
        consumer(this.error);
        return this;
    }

    * iterate() : Iterable<T|Error> {
        yield this.error;
    }
}

class SuccessImpl<T> extends BaseTryImpl<T> implements Try<T> {
    private value: T;

    public constructor(value: T) {
        super();
        this.value = value;
    }

    get success() : boolean {
        return true;
    }

    protected get result() : T {
        return this.value;
    }

    convert<S>(operation: Function<T, S>, backup?: Function<Error,S>): Try<S> {
        return TryFactory.of(() => operation(this.value));
    }

    flatConvert<S>(operation: Function<T, Try<S>>, backup?: Function<Error,Try<S>>): Try<S> {
        return TryFactory.flatOf(() => operation(this.value));
    }

    include(predicate: Predicate<T>) : Try<T> {
        if (predicate(this.value)) {
            return this;
        }
        return TryFactory.error(new Error("Value does not match the predicate."));
    }
    
    orTry(backup: Function<Error, T>): Try<T> {
        return this;
    }

    orFlatTry(backup: Function<Error, Try<T>>): Try<T> {
        return this;
    }

    orElse(backup: T): T {
        return this.value;
    }

    orThrow() : T {
        return this.value;
    }

    ifPresent(success: Consumer<T>, failure?: Consumer<Error>) : this {
        success(this.value);
        return this;
    }

    ifAbsent(consumer: Consumer<Error>) : this {
        return this;
    }

    * iterate() : Iterable<T|Error> {
        yield this.value;
    }
}

export const TryFactory : ITryFactory = {
    success<T>(value: T) : Try<T> {
        return new SuccessImpl(value);
    },

    error<T>(error: Error|string, cause?: Error) : Try<T> {
        const e = error instanceof Error ? error : new Error(error);
        if (cause !== undefined) {
            appendCause(e, cause);
        }
        return new FailureImpl(e);
    },

    of<T>(action: Supplier<T>, cause?: Error) : Try<T> {
        try {
            return TryFactory.success(action());
        }
        catch (error) {
            return TryFactory.error(error, cause);
        }
    },

    flatOf<T>(action: Supplier<Try<T>>, cause?: Error) : Try<T> {
        try {
            return action();
        }
        catch (error) {
            return TryFactory.error(error, cause);
        }
    }
};