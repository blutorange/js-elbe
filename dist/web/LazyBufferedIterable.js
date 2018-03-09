"use strict";

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var LazyBufferedIterable =
/*#__PURE__*/
function () {
  function LazyBufferedIterable(iterable) {
    _classCallCheck(this, LazyBufferedIterable);

    this.iterator = iterable[Symbol.iterator]();
    this.buffer = [];
  }

  _createClass(LazyBufferedIterable, [{
    key: Symbol.iterator,
    value: function value() {
      var $ = this;
      var index = 0;
      return {
        next: function next(value) {
          if (index >= $.buffer.length) {
            var next = $.iterator.next();

            if (!next.done) {
              $.buffer.push(next.value);
            }
          }

          var result = {
            done: index >= $.buffer.length,
            value: $.buffer[index]
          };
          index += 1;
          return result;
        }
      };
    }
  }]);

  return LazyBufferedIterable;
}();

exports.LazyBufferedIterable = LazyBufferedIterable;