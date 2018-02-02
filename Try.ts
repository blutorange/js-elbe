import { IStreamFactory, Stream, Function, Supplier, Try, ITryFactory } from "./Interfaces";
import { TypesafeStreamFactory } from "./TypesafeStream";

function isTry<S>(result: S|Try<S>) : result is Try<S> {
    return result instanceof TryImpl;
}

class TryImpl<T> implements Try<T> {
    private value: T;
    private error : Error;

    private constructor(value: T, error?: Error) {
        this.value = value;
        this.error = error;
    }

    get success() : boolean {
        return this.error === undefined;
    }

    map<S>(mapper: Function<T, S>): Try<S> {
        if (this.success) {
            return TryImpl.of(() => mapper(this.value));
        }
        // undefined is both a T and S, so we can reuse this
        return this as Try<any>;
    }


    public toJSON() : {success:boolean, error:Error, value:T} {
        return {
            success: this.success,
            error: this.error, 
            value: this.value
        };
    }
    
    recover(backup: Function<Error, T>): Try<T> {
        if (this.success) {
            return this;
        }
        return TryImpl.of(() => backup(this.error));
    }

    orElse(backup: T): T {
        if (this.success) {
            return this.value;
        }
        return backup;
    }

    orThrow() : T {
        if (this.success) {
            return this.value;
        }
        throw this.error;
    }

    flatMap<S>(mapper: Function<T, Try<S>>): Try<S> {
        if (this.success) {
            try {
                return mapper(this.value);
            }
            catch (e) {
                return TryImpl.failure(e);
            }
        }
        // undefined is both a T and S, so we can reuse this
        return this as Try<any>;
    }

    * iterate() : Iterable<T> {
        if (this.success) {
            yield this.value;
        }
    }

    stream(factory: IStreamFactory = TypesafeStreamFactory) : Stream<T> {
        return factory.from(this.iterate());
    }

    then<S>(mapper: Function<T, S|Try<S>>) : Try<S> {
        return this.map(mapper).flatMap(v => isTry(v) ? v : TryImpl.success(v));
    }

    catch(backup: Function<Error, T|Try<T>>) : Try<T> {
        if (this.success) {
            return this;
        }
        return TryImpl.of(() => backup(this.error)).flatMap(v => isTry(v) ? v : TryImpl.success(v));
    }

    fold<S>(successHandler: Function<T,S>, failureHandler: Function<Error,S>) : Try<S> {
        if (this.success) {
            return TryImpl.of(()=>successHandler(this.value));
        }
        return TryImpl.of(()=>failureHandler(this.error));
    }

    static success<T>(value: T) : Try<T> {
        return new TryImpl(value);
    }

    static failure<T>(error: Error) : Try<T> {
        return new TryImpl(undefined, error);
    }

    static of<T>(action: Supplier<T>) : Try<T> {
        try {
            const value = action();
            return new TryImpl(value);
        }
        catch (e) {
            return new TryImpl(undefined, e);
        }
    }
}

export const TryFactory : ITryFactory = {
    of: TryImpl.of,
    success: TryImpl.success,
    failure: TryImpl.failure
};