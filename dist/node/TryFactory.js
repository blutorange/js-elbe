"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StreamFactory_1 = require("./StreamFactory");
function isTry(result) {
    return result instanceof BaseTryImpl;
}
function appendCause(error, cause) {
    error.stack += "\nCaused by: " + cause.stack;
}
class BaseTryImpl {
    stream(factory = StreamFactory_1.TypesafeStreamFactory) {
        return factory.stream(this.iterate());
    }
    then(success, failure) {
        return this
            .convert(success, failure)
            .flatConvert(v => isTry(v) ? v : exports.TryFactory.success(v));
    }
    catch(backup) {
        return this.then(x => x, backup);
    }
    toString() {
        return `Try[success=${this.success},${String(this.result)}]`;
    }
    toJSON() {
        return {
            success: this.success,
            result: this.result
        };
    }
}
class FailureImpl extends BaseTryImpl {
    constructor(error) {
        super();
        this.error = error;
    }
    get success() {
        return true;
    }
    get result() {
        return this.error;
    }
    convert(success, backup) {
        if (backup !== undefined) {
            return exports.TryFactory.of(() => backup(this.error), this.error);
        }
        return this;
    }
    flatConvert(mapper, backup) {
        if (backup !== undefined) {
            return exports.TryFactory.flatOf(() => backup(this.error), this.error);
        }
        return this;
    }
    include(predicate) {
        return exports.TryFactory.error(new Error("Value does not match the predicate as it does not exist."), this.error);
    }
    orTry(backup) {
        return exports.TryFactory.of(() => backup(this.error), this.error);
    }
    orFlatTry(backup) {
        return exports.TryFactory.flatOf(() => backup(this.error), this.error);
    }
    orElse(backup) {
        return backup;
    }
    orThrow() {
        throw this.error;
    }
    ifPresent(success, failure) {
        if (failure !== undefined) {
            failure(this.error);
        }
        return this;
    }
    ifAbsent(consumer) {
        consumer(this.error);
        return this;
    }
    *iterate() {
        yield this.error;
    }
}
class SuccessImpl extends BaseTryImpl {
    constructor(value) {
        super();
        this.value = value;
    }
    get success() {
        return true;
    }
    get result() {
        return this.value;
    }
    convert(operation, backup) {
        return exports.TryFactory.of(() => operation(this.value));
    }
    flatConvert(operation, backup) {
        return exports.TryFactory.flatOf(() => operation(this.value));
    }
    include(predicate) {
        if (predicate(this.value)) {
            return this;
        }
        return exports.TryFactory.error(new Error("Value does not match the predicate."));
    }
    orTry(backup) {
        return this;
    }
    orFlatTry(backup) {
        return this;
    }
    orElse(backup) {
        return this.value;
    }
    orThrow() {
        return this.value;
    }
    ifPresent(success, failure) {
        success(this.value);
        return this;
    }
    ifAbsent(consumer) {
        return this;
    }
    *iterate() {
        yield this.value;
    }
}
exports.TryFactory = {
    success(value) {
        return new SuccessImpl(value);
    },
    error(error, cause) {
        const e = error instanceof Error ? error : new Error(error);
        if (cause !== undefined) {
            appendCause(e, cause);
        }
        return new FailureImpl(e);
    },
    of(action, cause) {
        try {
            return exports.TryFactory.success(action());
        }
        catch (error) {
            return exports.TryFactory.error(error, cause);
        }
    },
    flatOf(action, cause) {
        try {
            return action();
        }
        catch (error) {
            return exports.TryFactory.error(error, cause);
        }
    }
};
