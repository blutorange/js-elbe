"use strict";

require("core-js/modules/es6.object.set-prototype-of");

require("core-js/modules/es6.symbol");

require("regenerator-runtime/runtime");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var StreamFactory_1 = require("./StreamFactory");

function isTry(result) {
  return result instanceof BaseTryImpl;
}

function appendCause(error, cause) {
  error.stack += "\nCaused by: " + cause.stack;
}

var BaseTryImpl =
/*#__PURE__*/
function () {
  function BaseTryImpl() {
    _classCallCheck(this, BaseTryImpl);
  }

  _createClass(BaseTryImpl, [{
    key: "stream",
    value: function stream() {
      var factory = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : StreamFactory_1.TypesafeStreamFactory;
      return factory.stream(this.iterate());
    }
  }, {
    key: "then",
    value: function then(success, failure) {
      return this.convert(success, failure).flatConvert(function (v) {
        return isTry(v) ? v : exports.TryFactory.success(v);
      });
    }
  }, {
    key: "catch",
    value: function _catch(backup) {
      return this.then(function (x) {
        return x;
      }, backup);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "Try[success=".concat(this.success, ",").concat(String(this.result), "]");
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        success: this.success,
        result: this.result
      };
    }
  }]);

  return BaseTryImpl;
}();

var FailureImpl =
/*#__PURE__*/
function (_BaseTryImpl) {
  _inherits(FailureImpl, _BaseTryImpl);

  function FailureImpl(error) {
    var _this;

    _classCallCheck(this, FailureImpl);

    _this = _possibleConstructorReturn(this, (FailureImpl.__proto__ || Object.getPrototypeOf(FailureImpl)).call(this));
    _this.error = error;
    return _this;
  }

  _createClass(FailureImpl, [{
    key: "convert",
    value: function convert(success, backup) {
      var _this2 = this;

      if (backup !== undefined) {
        return exports.TryFactory.of(function () {
          return backup(_this2.error);
        }, this.error);
      }

      return this;
    }
  }, {
    key: "flatConvert",
    value: function flatConvert(mapper, backup) {
      var _this3 = this;

      if (backup !== undefined) {
        return exports.TryFactory.flatOf(function () {
          return backup(_this3.error);
        }, this.error);
      }

      return this;
    }
  }, {
    key: "include",
    value: function include(predicate) {
      return exports.TryFactory.error(new Error("Value does not match the predicate as it does not exist."), this.error);
    }
  }, {
    key: "orTry",
    value: function orTry(backup) {
      var _this4 = this;

      return exports.TryFactory.of(function () {
        return backup(_this4.error);
      }, this.error);
    }
  }, {
    key: "orFlatTry",
    value: function orFlatTry(backup) {
      var _this5 = this;

      return exports.TryFactory.flatOf(function () {
        return backup(_this5.error);
      }, this.error);
    }
  }, {
    key: "orElse",
    value: function orElse(backup) {
      return backup;
    }
  }, {
    key: "orThrow",
    value: function orThrow() {
      throw this.error;
    }
  }, {
    key: "ifPresent",
    value: function ifPresent(success, failure) {
      if (failure !== undefined) {
        failure(this.error);
      }

      return this;
    }
  }, {
    key: "ifAbsent",
    value: function ifAbsent(consumer) {
      consumer(this.error);
      return this;
    }
  }, {
    key: "iterate",
    value:
    /*#__PURE__*/
    regeneratorRuntime.mark(function iterate() {
      return regeneratorRuntime.wrap(function iterate$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.error;

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, iterate, this);
    })
  }, {
    key: "success",
    get: function get() {
      return true;
    }
  }, {
    key: "result",
    get: function get() {
      return this.error;
    }
  }]);

  return FailureImpl;
}(BaseTryImpl);

var SuccessImpl =
/*#__PURE__*/
function (_BaseTryImpl2) {
  _inherits(SuccessImpl, _BaseTryImpl2);

  function SuccessImpl(value) {
    var _this6;

    _classCallCheck(this, SuccessImpl);

    _this6 = _possibleConstructorReturn(this, (SuccessImpl.__proto__ || Object.getPrototypeOf(SuccessImpl)).call(this));
    _this6.value = value;
    return _this6;
  }

  _createClass(SuccessImpl, [{
    key: "convert",
    value: function convert(operation, backup) {
      var _this7 = this;

      return exports.TryFactory.of(function () {
        return operation(_this7.value);
      });
    }
  }, {
    key: "flatConvert",
    value: function flatConvert(operation, backup) {
      var _this8 = this;

      return exports.TryFactory.flatOf(function () {
        return operation(_this8.value);
      });
    }
  }, {
    key: "include",
    value: function include(predicate) {
      if (predicate(this.value)) {
        return this;
      }

      return exports.TryFactory.error(new Error("Value does not match the predicate."));
    }
  }, {
    key: "orTry",
    value: function orTry(backup) {
      return this;
    }
  }, {
    key: "orFlatTry",
    value: function orFlatTry(backup) {
      return this;
    }
  }, {
    key: "orElse",
    value: function orElse(backup) {
      return this.value;
    }
  }, {
    key: "orThrow",
    value: function orThrow() {
      return this.value;
    }
  }, {
    key: "ifPresent",
    value: function ifPresent(success, failure) {
      success(this.value);
      return this;
    }
  }, {
    key: "ifAbsent",
    value: function ifAbsent(consumer) {
      return this;
    }
  }, {
    key: "iterate",
    value:
    /*#__PURE__*/
    regeneratorRuntime.mark(function iterate() {
      return regeneratorRuntime.wrap(function iterate$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.value;

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, iterate, this);
    })
  }, {
    key: "success",
    get: function get() {
      return true;
    }
  }, {
    key: "result",
    get: function get() {
      return this.value;
    }
  }]);

  return SuccessImpl;
}(BaseTryImpl);

exports.TryFactory = {
  success: function success(value) {
    return new SuccessImpl(value);
  },
  error: function error(_error, cause) {
    var e = _error instanceof Error ? _error : new Error(_error);

    if (cause !== undefined) {
      appendCause(e, cause);
    }

    return new FailureImpl(e);
  },
  of: function of(action, cause) {
    try {
      return exports.TryFactory.success(action());
    } catch (error) {
      return exports.TryFactory.error(error, cause);
    }
  },
  flatOf: function flatOf(action, cause) {
    try {
      return action();
    } catch (error) {
      return exports.TryFactory.error(error, cause);
    }
  }
};