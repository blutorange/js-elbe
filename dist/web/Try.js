"use strict";

require("regenerator-runtime/runtime");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TypesafeStream_1 = require("./TypesafeStream");

function isTry(result) {
  return result instanceof TryImpl;
}

var TryImpl =
/*#__PURE__*/
function () {
  function TryImpl(value, error) {
    _classCallCheck(this, TryImpl);

    this.value = value;
    this.error = error;
  }

  _createClass(TryImpl, [{
    key: "map",
    value: function map(mapper) {
      var _this = this;

      if (this.success) {
        return TryImpl.of(function () {
          return mapper(_this.value);
        });
      }

      return this;
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        success: this.success,
        error: this.error,
        value: this.value
      };
    }
  }, {
    key: "recover",
    value: function recover(backup) {
      var _this2 = this;

      if (this.success) {
        return this;
      }

      return TryImpl.of(function () {
        return backup(_this2.error);
      });
    }
  }, {
    key: "orElse",
    value: function orElse(backup) {
      if (this.success) {
        return this.value;
      }

      return backup;
    }
  }, {
    key: "orThrow",
    value: function orThrow() {
      if (this.success) {
        return this.value;
      }

      throw this.error;
    }
  }, {
    key: "flatMap",
    value: function flatMap(mapper) {
      if (this.success) {
        try {
          return mapper(this.value);
        } catch (e) {
          return TryImpl.failure(e);
        }
      }

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
              if (!this.success) {
                _context.next = 3;
                break;
              }

              _context.next = 3;
              return this.value;

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, iterate, this);
    })
  }, {
    key: "stream",
    value: function stream() {
      var factory = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : TypesafeStream_1.TypesafeStreamFactory;
      return factory.from(this.iterate());
    }
  }, {
    key: "then",
    value: function then(mapper) {
      return this.map(mapper).flatMap(function (v) {
        return isTry(v) ? v : TryImpl.success(v);
      });
    }
  }, {
    key: "catch",
    value: function _catch(backup) {
      var _this3 = this;

      if (this.success) {
        return this;
      }

      return TryImpl.of(function () {
        return backup(_this3.error);
      }).flatMap(function (v) {
        return isTry(v) ? v : TryImpl.success(v);
      });
    }
  }, {
    key: "fold",
    value: function fold(successHandler, failureHandler) {
      var _this4 = this;

      if (this.success) {
        return TryImpl.of(function () {
          return successHandler(_this4.value);
        });
      }

      return TryImpl.of(function () {
        return failureHandler(_this4.error);
      });
    }
  }, {
    key: "success",
    get: function get() {
      return this.error === undefined;
    }
  }], [{
    key: "success",
    value: function success(value) {
      return new TryImpl(value);
    }
  }, {
    key: "failure",
    value: function failure(error) {
      return new TryImpl(undefined, error);
    }
  }, {
    key: "of",
    value: function of(action) {
      try {
        var value = action();
        return new TryImpl(value);
      } catch (e) {
        return new TryImpl(undefined, e);
      }
    }
  }]);

  return TryImpl;
}();

exports.TryFactory = {
  of: TryImpl.of,
  success: TryImpl.success,
  failure: TryImpl.failure
};