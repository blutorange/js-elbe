"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StreamFactory_1 = require("./StreamFactory");
function isTry(result) {
    return result instanceof TryImpl;
}
class TryImpl {
    constructor(value, error) {
        this.value = value;
        this.error = error;
    }
    get success() {
        return this.error === undefined;
    }
    map(mapper) {
        if (this.success) {
            return TryImpl.of(() => mapper(this.value));
        }
        return this;
    }
    toString() {
        return `Try[${String(this.success ? this.value : this.error)}]`;
    }
    toJSON() {
        return {
            success: this.success,
            error: this.error,
            value: this.value
        };
    }
    recover(backup) {
        if (this.success) {
            return this;
        }
        return TryImpl.of(() => backup(this.error));
    }
    orElse(backup) {
        if (this.success) {
            return this.value;
        }
        return backup;
    }
    orThrow() {
        if (this.success) {
            return this.value;
        }
        throw this.error;
    }
    flatMap(mapper) {
        if (this.success) {
            try {
                return mapper(this.value);
            }
            catch (e) {
                return TryImpl.failure(e);
            }
        }
        return this;
    }
    *iterate() {
        if (this.success) {
            yield this.value;
        }
    }
    stream(factory = StreamFactory_1.TypesafeStreamFactory) {
        return factory.stream(this.iterate());
    }
    then(mapper) {
        return this.map(mapper).flatMap(v => isTry(v) ? v : TryImpl.success(v));
    }
    catch(backup) {
        if (this.success) {
            return this;
        }
        return TryImpl.of(() => backup(this.error)).flatMap(v => isTry(v) ? v : TryImpl.success(v));
    }
    fold(successHandler, failureHandler) {
        if (this.success) {
            return TryImpl.of(() => successHandler(this.value));
        }
        return TryImpl.of(() => failureHandler(this.error));
    }
    static success(value) {
        return new TryImpl(value);
    }
    static failure(error) {
        return new TryImpl(undefined, error);
    }
    static of(action) {
        try {
            const value = action();
            return new TryImpl(value);
        }
        catch (e) {
            return new TryImpl(undefined, e);
        }
    }
}
exports.TryFactory = {
    of: TryImpl.of,
    success: TryImpl.success,
    failure: TryImpl.failure
};
