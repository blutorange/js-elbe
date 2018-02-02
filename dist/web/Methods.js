"use strict";

require("core-js/modules/es6.set");

require("core-js/modules/es6.array.sort");

require("core-js/modules/es6.array.from");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

require("regenerator-runtime/runtime");

var _marked =
/*#__PURE__*/
regeneratorRuntime.mark(map),
    _marked2 =
/*#__PURE__*/
regeneratorRuntime.mark(flatMap),
    _marked3 =
/*#__PURE__*/
regeneratorRuntime.mark(filter),
    _marked4 =
/*#__PURE__*/
regeneratorRuntime.mark(doTry),
    _marked5 =
/*#__PURE__*/
regeneratorRuntime.mark(uniqueBy),
    _marked6 =
/*#__PURE__*/
regeneratorRuntime.mark(index),
    _marked7 =
/*#__PURE__*/
regeneratorRuntime.mark(limit),
    _marked8 =
/*#__PURE__*/
regeneratorRuntime.mark(process),
    _marked9 =
/*#__PURE__*/
regeneratorRuntime.mark(skip),
    _marked10 =
/*#__PURE__*/
regeneratorRuntime.mark(reverse),
    _marked11 =
/*#__PURE__*/
regeneratorRuntime.mark(concat),
    _marked12 =
/*#__PURE__*/
regeneratorRuntime.mark(fromObject),
    _marked13 =
/*#__PURE__*/
regeneratorRuntime.mark(fromObjectKeys),
    _marked14 =
/*#__PURE__*/
regeneratorRuntime.mark(fromObjectValues),
    _marked15 =
/*#__PURE__*/
regeneratorRuntime.mark(generate),
    _marked16 =
/*#__PURE__*/
regeneratorRuntime.mark(times),
    _marked17 =
/*#__PURE__*/
regeneratorRuntime.mark(repeat),
    _marked18 =
/*#__PURE__*/
regeneratorRuntime.mark(iterate);

Object.defineProperty(exports, "__esModule", {
  value: true
});

var comparators_1 = require("comparators");

var Collectors_1 = require("./Collectors");

var Try_1 = require("./Try");

var hasOwnProperty = Object.prototype.hasOwnProperty;

function map(iterable, mapper) {
  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _item;

  return regeneratorRuntime.wrap(function map$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 3;
          _iterator = iterable[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context.next = 12;
            break;
          }

          _item = _step.value;
          _context.next = 9;
          return mapper(_item);

        case 9:
          _iteratorNormalCompletion = true;
          _context.next = 5;
          break;

        case 12:
          _context.next = 18;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](3);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 18:
          _context.prev = 18;
          _context.prev = 19;

          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }

        case 21:
          _context.prev = 21;

          if (!_didIteratorError) {
            _context.next = 24;
            break;
          }

          throw _iteratorError;

        case 24:
          return _context.finish(21);

        case 25:
          return _context.finish(18);

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, this, [[3, 14, 18, 26], [19,, 21, 25]]);
}

exports.map = map;

function flatMap(iterable, mapper) {
  var _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _item2, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _i;

  return regeneratorRuntime.wrap(function flatMap$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _iteratorNormalCompletion2 = true;
          _didIteratorError2 = false;
          _iteratorError2 = undefined;
          _context2.prev = 3;
          _iterator2 = iterable[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
            _context2.next = 36;
            break;
          }

          _item2 = _step2.value;
          _iteratorNormalCompletion3 = true;
          _didIteratorError3 = false;
          _iteratorError3 = undefined;
          _context2.prev = 10;
          _iterator3 = mapper(_item2)[Symbol.iterator]();

        case 12:
          if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
            _context2.next = 19;
            break;
          }

          _i = _step3.value;
          _context2.next = 16;
          return _i;

        case 16:
          _iteratorNormalCompletion3 = true;
          _context2.next = 12;
          break;

        case 19:
          _context2.next = 25;
          break;

        case 21:
          _context2.prev = 21;
          _context2.t0 = _context2["catch"](10);
          _didIteratorError3 = true;
          _iteratorError3 = _context2.t0;

        case 25:
          _context2.prev = 25;
          _context2.prev = 26;

          if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
            _iterator3.return();
          }

        case 28:
          _context2.prev = 28;

          if (!_didIteratorError3) {
            _context2.next = 31;
            break;
          }

          throw _iteratorError3;

        case 31:
          return _context2.finish(28);

        case 32:
          return _context2.finish(25);

        case 33:
          _iteratorNormalCompletion2 = true;
          _context2.next = 5;
          break;

        case 36:
          _context2.next = 42;
          break;

        case 38:
          _context2.prev = 38;
          _context2.t1 = _context2["catch"](3);
          _didIteratorError2 = true;
          _iteratorError2 = _context2.t1;

        case 42:
          _context2.prev = 42;
          _context2.prev = 43;

          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }

        case 45:
          _context2.prev = 45;

          if (!_didIteratorError2) {
            _context2.next = 48;
            break;
          }

          throw _iteratorError2;

        case 48:
          return _context2.finish(45);

        case 49:
          return _context2.finish(42);

        case 50:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked2, this, [[3, 38, 42, 50], [10, 21, 25, 33], [26,, 28, 32], [43,, 45, 49]]);
}

exports.flatMap = flatMap;

function filter(iterable, predicate) {
  var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _item3;

  return regeneratorRuntime.wrap(function filter$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _iteratorNormalCompletion4 = true;
          _didIteratorError4 = false;
          _iteratorError4 = undefined;
          _context3.prev = 3;
          _iterator4 = iterable[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
            _context3.next = 13;
            break;
          }

          _item3 = _step4.value;

          if (!predicate(_item3)) {
            _context3.next = 10;
            break;
          }

          _context3.next = 10;
          return _item3;

        case 10:
          _iteratorNormalCompletion4 = true;
          _context3.next = 5;
          break;

        case 13:
          _context3.next = 19;
          break;

        case 15:
          _context3.prev = 15;
          _context3.t0 = _context3["catch"](3);
          _didIteratorError4 = true;
          _iteratorError4 = _context3.t0;

        case 19:
          _context3.prev = 19;
          _context3.prev = 20;

          if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
            _iterator4.return();
          }

        case 22:
          _context3.prev = 22;

          if (!_didIteratorError4) {
            _context3.next = 25;
            break;
          }

          throw _iteratorError4;

        case 25:
          return _context3.finish(22);

        case 26:
          return _context3.finish(19);

        case 27:
        case "end":
          return _context3.stop();
      }
    }
  }, _marked3, this, [[3, 15, 19, 27], [20,, 22, 26]]);
}

exports.filter = filter;

function doTry(iterable, mapper) {
  var _loop, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, item;

  return regeneratorRuntime.wrap(function doTry$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _loop =
          /*#__PURE__*/
          regeneratorRuntime.mark(function _loop(item) {
            return regeneratorRuntime.wrap(function _loop$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return Try_1.TryFactory.of(function () {
                      return mapper(item);
                    });

                  case 2:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _loop, this);
          });
          _iteratorNormalCompletion5 = true;
          _didIteratorError5 = false;
          _iteratorError5 = undefined;
          _context5.prev = 4;
          _iterator5 = iterable[Symbol.iterator]();

        case 6:
          if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
            _context5.next = 12;
            break;
          }

          item = _step5.value;
          return _context5.delegateYield(_loop(item), "t0", 9);

        case 9:
          _iteratorNormalCompletion5 = true;
          _context5.next = 6;
          break;

        case 12:
          _context5.next = 18;
          break;

        case 14:
          _context5.prev = 14;
          _context5.t1 = _context5["catch"](4);
          _didIteratorError5 = true;
          _iteratorError5 = _context5.t1;

        case 18:
          _context5.prev = 18;
          _context5.prev = 19;

          if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
            _iterator5.return();
          }

        case 21:
          _context5.prev = 21;

          if (!_didIteratorError5) {
            _context5.next = 24;
            break;
          }

          throw _iteratorError5;

        case 24:
          return _context5.finish(21);

        case 25:
          return _context5.finish(18);

        case 26:
        case "end":
          return _context5.stop();
      }
    }
  }, _marked4, this, [[4, 14, 18, 26], [19,, 21, 25]]);
}

exports.doTry = doTry;

function partition(iterable, discriminator) {
  return collect(iterable, Collectors_1.Collectors.partition(discriminator));
}

exports.partition = partition;
;

function group(iterable, classifier) {
  return collect(iterable, Collectors_1.Collectors.group(classifier));
}

exports.group = group;
;

function join(iterable) {
  var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var prefix = arguments.length > 2 ? arguments[2] : undefined;
  var suffix = arguments.length > 3 ? arguments[3] : undefined;
  return collect(iterable, Collectors_1.Collectors.join(delimiter, prefix, suffix));
}

exports.join = join;

function sort(iterable, comparator) {
  var arr = Array.from(iterable);
  arr.sort(comparator);
  return arr[Symbol.iterator]();
}

exports.sort = sort;

function unique(iterable) {
  var set = new Set(iterable);
  return set.values();
}

exports.unique = unique;

function uniqueBy(iterable, keyExtractor) {
  var set, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _item4, key;

  return regeneratorRuntime.wrap(function uniqueBy$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          set = new Set();
          _iteratorNormalCompletion6 = true;
          _didIteratorError6 = false;
          _iteratorError6 = undefined;
          _context6.prev = 4;
          _iterator6 = iterable[Symbol.iterator]();

        case 6:
          if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
            _context6.next = 16;
            break;
          }

          _item4 = _step6.value;
          key = keyExtractor(_item4);

          if (set.has(key)) {
            _context6.next = 13;
            break;
          }

          _context6.next = 12;
          return _item4;

        case 12:
          set.add(key);

        case 13:
          _iteratorNormalCompletion6 = true;
          _context6.next = 6;
          break;

        case 16:
          _context6.next = 22;
          break;

        case 18:
          _context6.prev = 18;
          _context6.t0 = _context6["catch"](4);
          _didIteratorError6 = true;
          _iteratorError6 = _context6.t0;

        case 22:
          _context6.prev = 22;
          _context6.prev = 23;

          if (!_iteratorNormalCompletion6 && _iterator6.return != null) {
            _iterator6.return();
          }

        case 25:
          _context6.prev = 25;

          if (!_didIteratorError6) {
            _context6.next = 28;
            break;
          }

          throw _iteratorError6;

        case 28:
          return _context6.finish(25);

        case 29:
          return _context6.finish(22);

        case 30:
        case "end":
          return _context6.stop();
      }
    }
  }, _marked5, this, [[4, 18, 22, 30], [23,, 25, 29]]);
}

exports.uniqueBy = uniqueBy;

function index(iterable) {
  var i, _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _iterator7, _step7, _item5;

  return regeneratorRuntime.wrap(function index$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          i = 0;
          _iteratorNormalCompletion7 = true;
          _didIteratorError7 = false;
          _iteratorError7 = undefined;
          _context7.prev = 4;
          _iterator7 = iterable[Symbol.iterator]();

        case 6:
          if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
            _context7.next = 14;
            break;
          }

          _item5 = _step7.value;
          _context7.next = 10;
          return [i, _item5];

        case 10:
          i += 1;

        case 11:
          _iteratorNormalCompletion7 = true;
          _context7.next = 6;
          break;

        case 14:
          _context7.next = 20;
          break;

        case 16:
          _context7.prev = 16;
          _context7.t0 = _context7["catch"](4);
          _didIteratorError7 = true;
          _iteratorError7 = _context7.t0;

        case 20:
          _context7.prev = 20;
          _context7.prev = 21;

          if (!_iteratorNormalCompletion7 && _iterator7.return != null) {
            _iterator7.return();
          }

        case 23:
          _context7.prev = 23;

          if (!_didIteratorError7) {
            _context7.next = 26;
            break;
          }

          throw _iteratorError7;

        case 26:
          return _context7.finish(23);

        case 27:
          return _context7.finish(20);

        case 28:
        case "end":
          return _context7.stop();
      }
    }
  }, _marked6, this, [[4, 16, 20, 28], [21,, 23, 27]]);
}

exports.index = index;
;

function limit(iterable, limit) {
  var _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, _item6;

  return regeneratorRuntime.wrap(function limit$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _iteratorNormalCompletion8 = true;
          _didIteratorError8 = false;
          _iteratorError8 = undefined;
          _context8.prev = 3;
          _iterator8 = iterable[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
            _context8.next = 14;
            break;
          }

          _item6 = _step8.value;
          _context8.next = 9;
          return _item6;

        case 9:
          if (!(--limit < 1)) {
            _context8.next = 11;
            break;
          }

          return _context8.abrupt("break", 14);

        case 11:
          _iteratorNormalCompletion8 = true;
          _context8.next = 5;
          break;

        case 14:
          _context8.next = 20;
          break;

        case 16:
          _context8.prev = 16;
          _context8.t0 = _context8["catch"](3);
          _didIteratorError8 = true;
          _iteratorError8 = _context8.t0;

        case 20:
          _context8.prev = 20;
          _context8.prev = 21;

          if (!_iteratorNormalCompletion8 && _iterator8.return != null) {
            _iterator8.return();
          }

        case 23:
          _context8.prev = 23;

          if (!_didIteratorError8) {
            _context8.next = 26;
            break;
          }

          throw _iteratorError8;

        case 26:
          return _context8.finish(23);

        case 27:
          return _context8.finish(20);

        case 28:
        case "end":
          return _context8.stop();
      }
    }
  }, _marked7, this, [[3, 16, 20, 28], [21,, 23, 27]]);
}

exports.limit = limit;

function process(iterable, consumer) {
  var _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, _item7;

  return regeneratorRuntime.wrap(function process$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _iteratorNormalCompletion9 = true;
          _didIteratorError9 = false;
          _iteratorError9 = undefined;
          _context9.prev = 3;
          _iterator9 = iterable[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
            _context9.next = 13;
            break;
          }

          _item7 = _step9.value;
          consumer(_item7);
          _context9.next = 10;
          return _item7;

        case 10:
          _iteratorNormalCompletion9 = true;
          _context9.next = 5;
          break;

        case 13:
          _context9.next = 19;
          break;

        case 15:
          _context9.prev = 15;
          _context9.t0 = _context9["catch"](3);
          _didIteratorError9 = true;
          _iteratorError9 = _context9.t0;

        case 19:
          _context9.prev = 19;
          _context9.prev = 20;

          if (!_iteratorNormalCompletion9 && _iterator9.return != null) {
            _iterator9.return();
          }

        case 22:
          _context9.prev = 22;

          if (!_didIteratorError9) {
            _context9.next = 25;
            break;
          }

          throw _iteratorError9;

        case 25:
          return _context9.finish(22);

        case 26:
          return _context9.finish(19);

        case 27:
        case "end":
          return _context9.stop();
      }
    }
  }, _marked8, this, [[3, 15, 19, 27], [20,, 22, 26]]);
}

exports.process = process;

function skip(iterable, skip) {
  var it, entry;
  return regeneratorRuntime.wrap(function skip$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          it = iterable[Symbol.iterator]();

        case 1:
          if (!(skip-- > 0)) {
            _context10.next = 6;
            break;
          }

          if (!it.next().done) {
            _context10.next = 4;
            break;
          }

          return _context10.abrupt("break", 6);

        case 4:
          _context10.next = 1;
          break;

        case 6:
          entry = it.next();

        case 7:
          if (entry.done) {
            _context10.next = 13;
            break;
          }

          _context10.next = 10;
          return entry.value;

        case 10:
          entry = it.next();
          _context10.next = 7;
          break;

        case 13:
        case "end":
          return _context10.stop();
      }
    }
  }, _marked9, this);
}

exports.skip = skip;

function reverse(iterable) {
  var arr, i;
  return regeneratorRuntime.wrap(function reverse$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          arr = Array.from(iterable);
          i = arr.length;

        case 2:
          if (!(i-- > 0)) {
            _context11.next = 7;
            break;
          }

          _context11.next = 5;
          return arr[i];

        case 5:
          _context11.next = 2;
          break;

        case 7:
        case "end":
          return _context11.stop();
      }
    }
  }, _marked10, this);
}

exports.reverse = reverse;

function concat(iterable) {
  var _iteratorNormalCompletion10,
      _didIteratorError10,
      _iteratorError10,
      _iterator10,
      _step10,
      _item8,
      _len,
      moreIterables,
      _key,
      _i2,
      _iterable,
      _iteratorNormalCompletion11,
      _didIteratorError11,
      _iteratorError11,
      _iterator11,
      _step11,
      _item10,
      _args12 = arguments;

  return regeneratorRuntime.wrap(function concat$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _iteratorNormalCompletion10 = true;
          _didIteratorError10 = false;
          _iteratorError10 = undefined;
          _context12.prev = 3;
          _iterator10 = iterable[Symbol.iterator]();

        case 5:
          if (_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done) {
            _context12.next = 12;
            break;
          }

          _item8 = _step10.value;
          _context12.next = 9;
          return _item8;

        case 9:
          _iteratorNormalCompletion10 = true;
          _context12.next = 5;
          break;

        case 12:
          _context12.next = 18;
          break;

        case 14:
          _context12.prev = 14;
          _context12.t0 = _context12["catch"](3);
          _didIteratorError10 = true;
          _iteratorError10 = _context12.t0;

        case 18:
          _context12.prev = 18;
          _context12.prev = 19;

          if (!_iteratorNormalCompletion10 && _iterator10.return != null) {
            _iterator10.return();
          }

        case 21:
          _context12.prev = 21;

          if (!_didIteratorError10) {
            _context12.next = 24;
            break;
          }

          throw _iteratorError10;

        case 24:
          return _context12.finish(21);

        case 25:
          return _context12.finish(18);

        case 26:
          for (_len = _args12.length, moreIterables = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            moreIterables[_key - 1] = _args12[_key];
          }

          _i2 = 0;

        case 28:
          if (!(_i2 < moreIterables.length)) {
            _context12.next = 59;
            break;
          }

          _iterable = moreIterables[_i2];
          _iteratorNormalCompletion11 = true;
          _didIteratorError11 = false;
          _iteratorError11 = undefined;
          _context12.prev = 33;
          _iterator11 = _iterable[Symbol.iterator]();

        case 35:
          if (_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done) {
            _context12.next = 42;
            break;
          }

          _item10 = _step11.value;
          _context12.next = 39;
          return _item10;

        case 39:
          _iteratorNormalCompletion11 = true;
          _context12.next = 35;
          break;

        case 42:
          _context12.next = 48;
          break;

        case 44:
          _context12.prev = 44;
          _context12.t1 = _context12["catch"](33);
          _didIteratorError11 = true;
          _iteratorError11 = _context12.t1;

        case 48:
          _context12.prev = 48;
          _context12.prev = 49;

          if (!_iteratorNormalCompletion11 && _iterator11.return != null) {
            _iterator11.return();
          }

        case 51:
          _context12.prev = 51;

          if (!_didIteratorError11) {
            _context12.next = 54;
            break;
          }

          throw _iteratorError11;

        case 54:
          return _context12.finish(51);

        case 55:
          return _context12.finish(48);

        case 56:
          _i2++;
          _context12.next = 28;
          break;

        case 59:
        case "end":
          return _context12.stop();
      }
    }
  }, _marked11, this, [[3, 14, 18, 26], [19,, 21, 25], [33, 44, 48, 56], [49,, 51, 55]]);
}

exports.concat = concat;

function size(iterable) {
  var i = 0;

  for (var it = iterable[Symbol.iterator](); !it.next().done;) {
    ++i;
  }

  return i;
}

exports.size = size;

function find(iterable, predicate) {
  var _iteratorNormalCompletion12 = true;
  var _didIteratorError12 = false;
  var _iteratorError12 = undefined;

  try {
    for (var _iterator12 = iterable[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
      var _item11 = _step12.value;

      if (predicate(_item11)) {
        return _item11;
      }
    }
  } catch (err) {
    _didIteratorError12 = true;
    _iteratorError12 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion12 && _iterator12.return != null) {
        _iterator12.return();
      }
    } finally {
      if (_didIteratorError12) {
        throw _iteratorError12;
      }
    }
  }

  return undefined;
}

exports.find = find;

function every(iterable, predicate) {
  var _iteratorNormalCompletion13 = true;
  var _didIteratorError13 = false;
  var _iteratorError13 = undefined;

  try {
    for (var _iterator13 = iterable[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
      var _item12 = _step13.value;

      if (!predicate(_item12)) {
        return false;
      }
    }
  } catch (err) {
    _didIteratorError13 = true;
    _iteratorError13 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion13 && _iterator13.return != null) {
        _iterator13.return();
      }
    } finally {
      if (_didIteratorError13) {
        throw _iteratorError13;
      }
    }
  }

  return true;
}

exports.every = every;

function some(iterable, predicate) {
  var _iteratorNormalCompletion14 = true;
  var _didIteratorError14 = false;
  var _iteratorError14 = undefined;

  try {
    for (var _iterator14 = iterable[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
      var _item13 = _step14.value;

      if (predicate(_item13)) {
        return true;
      }
    }
  } catch (err) {
    _didIteratorError14 = true;
    _iteratorError14 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion14 && _iterator14.return != null) {
        _iterator14.return();
      }
    } finally {
      if (_didIteratorError14) {
        throw _iteratorError14;
      }
    }
  }

  return false;
}

exports.some = some;

function none(iterable, predicate) {
  return !some(iterable, predicate);
}

exports.none = none;

function has(iterable, object) {
  return some(iterable, function (item) {
    return item === object;
  });
}

exports.has = has;

function min(iterable) {
  var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : comparators_1.natural;
  var first = true;
  var min;
  var _iteratorNormalCompletion15 = true;
  var _didIteratorError15 = false;
  var _iteratorError15 = undefined;

  try {
    for (var _iterator15 = iterable[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
      var _item14 = _step15.value;

      if (first) {
        min = _item14;
      } else {
        if (comparator(_item14, min) < 0) {
          min = _item14;
        }
      }
    }
  } catch (err) {
    _didIteratorError15 = true;
    _iteratorError15 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion15 && _iterator15.return != null) {
        _iterator15.return();
      }
    } finally {
      if (_didIteratorError15) {
        throw _iteratorError15;
      }
    }
  }

  return min;
}

exports.min = min;

function max(iterable) {
  var comparator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : comparators_1.natural;
  var first = true;
  var min;
  var _iteratorNormalCompletion16 = true;
  var _didIteratorError16 = false;
  var _iteratorError16 = undefined;

  try {
    for (var _iterator16 = iterable[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
      var _item15 = _step16.value;

      if (first) {
        min = _item15;
      } else {
        if (comparator(_item15, min) > 0) {
          min = _item15;
        }
      }
    }
  } catch (err) {
    _didIteratorError16 = true;
    _iteratorError16 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion16 && _iterator16.return != null) {
        _iterator16.return();
      }
    } finally {
      if (_didIteratorError16) {
        throw _iteratorError16;
      }
    }
  }

  return min;
}

exports.max = max;

function reduce(iterable, reducer, initialValue) {
  var _iteratorNormalCompletion17 = true;
  var _didIteratorError17 = false;
  var _iteratorError17 = undefined;

  try {
    for (var _iterator17 = iterable[Symbol.iterator](), _step17; !(_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done); _iteratorNormalCompletion17 = true) {
      var _item16 = _step17.value;
      initialValue = reducer(initialValue, _item16);
    }
  } catch (err) {
    _didIteratorError17 = true;
    _iteratorError17 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion17 && _iterator17.return != null) {
        _iterator17.return();
      }
    } finally {
      if (_didIteratorError17) {
        throw _iteratorError17;
      }
    }
  }

  return initialValue;
}

exports.reduce = reduce;

function reduceSame(iterable, reducer) {
  var reduced;
  var first = true;
  var _iteratorNormalCompletion18 = true;
  var _didIteratorError18 = false;
  var _iteratorError18 = undefined;

  try {
    for (var _iterator18 = iterable[Symbol.iterator](), _step18; !(_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done); _iteratorNormalCompletion18 = true) {
      var _item17 = _step18.value;

      if (first) {
        reduced = _item17;
        first = false;
      } else {
        reduced = reducer(reduced, _item17);
      }
    }
  } catch (err) {
    _didIteratorError18 = true;
    _iteratorError18 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion18 && _iterator18.return != null) {
        _iterator18.return();
      }
    } finally {
      if (_didIteratorError18) {
        throw _iteratorError18;
      }
    }
  }

  return reduced;
}

exports.reduceSame = reduceSame;

function sum(iterable, converter) {
  return collect(iterable, Collectors_1.Collectors.sum(converter));
}

exports.sum = sum;
;

function collect(iterable, collector) {
  return collectWith(iterable, collector.supplier, collector.accumulator, collector.finisher);
}

exports.collect = collect;
;

function collectWith(iterable, supplier, accumulator, finisher) {
  var collected = supplier();
  var _iteratorNormalCompletion19 = true;
  var _didIteratorError19 = false;
  var _iteratorError19 = undefined;

  try {
    for (var _iterator19 = iterable[Symbol.iterator](), _step19; !(_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done); _iteratorNormalCompletion19 = true) {
      var _item18 = _step19.value;
      accumulator(collected, _item18);
    }
  } catch (err) {
    _didIteratorError19 = true;
    _iteratorError19 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion19 && _iterator19.return != null) {
        _iterator19.return();
      }
    } finally {
      if (_didIteratorError19) {
        throw _iteratorError19;
      }
    }
  }

  return finisher(collected);
}

exports.collectWith = collectWith;
;

function toArray(iterable) {
  return Array.from(iterable);
}

exports.toArray = toArray;

function toSet(iterable) {
  return new Set(iterable);
}

exports.toSet = toSet;

function toMap(iterable, keyMapper, valueMapper) {
  return collect(iterable, Collectors_1.Collectors.toMap(keyMapper, valueMapper));
}

exports.toMap = toMap;

function fromObject(object) {
  var key;
  return regeneratorRuntime.wrap(function fromObject$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.t0 = regeneratorRuntime.keys(object);

        case 1:
          if ((_context13.t1 = _context13.t0()).done) {
            _context13.next = 8;
            break;
          }

          key = _context13.t1.value;

          if (!hasOwnProperty.call(object, key)) {
            _context13.next = 6;
            break;
          }

          _context13.next = 6;
          return [key, object[key]];

        case 6:
          _context13.next = 1;
          break;

        case 8:
        case "end":
          return _context13.stop();
      }
    }
  }, _marked12, this);
}

exports.fromObject = fromObject;

function fromObjectKeys(object) {
  var key;
  return regeneratorRuntime.wrap(function fromObjectKeys$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.t0 = regeneratorRuntime.keys(object);

        case 1:
          if ((_context14.t1 = _context14.t0()).done) {
            _context14.next = 8;
            break;
          }

          key = _context14.t1.value;

          if (!hasOwnProperty.call(object, key)) {
            _context14.next = 6;
            break;
          }

          _context14.next = 6;
          return key;

        case 6:
          _context14.next = 1;
          break;

        case 8:
        case "end":
          return _context14.stop();
      }
    }
  }, _marked13, this);
}

exports.fromObjectKeys = fromObjectKeys;

function fromObjectValues(object) {
  var key;
  return regeneratorRuntime.wrap(function fromObjectValues$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.t0 = regeneratorRuntime.keys(object);

        case 1:
          if ((_context15.t1 = _context15.t0()).done) {
            _context15.next = 8;
            break;
          }

          key = _context15.t1.value;

          if (!hasOwnProperty.call(object, key)) {
            _context15.next = 6;
            break;
          }

          _context15.next = 6;
          return object[key];

        case 6:
          _context15.next = 1;
          break;

        case 8:
        case "end":
          return _context15.stop();
      }
    }
  }, _marked14, this);
}

exports.fromObjectValues = fromObjectValues;

function generate(generator) {
  var amount,
      i,
      _args16 = arguments;
  return regeneratorRuntime.wrap(function generate$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          amount = _args16.length > 1 && _args16[1] !== undefined ? _args16[1] : Infinity;
          amount = Math.max(0, amount);
          i = 0;

        case 3:
          if (!(i < amount)) {
            _context16.next = 9;
            break;
          }

          _context16.next = 6;
          return generator(i);

        case 6:
          ++i;
          _context16.next = 3;
          break;

        case 9:
        case "end":
          return _context16.stop();
      }
    }
  }, _marked15, this);
}

exports.generate = generate;

function times(amount) {
  var start,
      end,
      step,
      half,
      i,
      _i3,
      _args17 = arguments;

  return regeneratorRuntime.wrap(function times$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          start = _args17.length > 1 && _args17[1] !== undefined ? _args17[1] : 0;
          end = _args17.length > 2 && _args17[2] !== undefined ? _args17[2] : start + amount - 1;
          amount = Math.floor(Math.max(0, amount));
          step = amount > 1 ? (end - start) / (amount - 1) : 0;

          if (!isFinite(step)) {
            step = NaN;
          }

          half = Math.floor(amount / 2);
          i = 0;

        case 7:
          if (!(i < half)) {
            _context17.next = 13;
            break;
          }

          _context17.next = 10;
          return start + i * step;

        case 10:
          ++i;
          _context17.next = 7;
          break;

        case 13:
          _i3 = amount - half - 1;

        case 14:
          if (!(_i3 >= 0)) {
            _context17.next = 20;
            break;
          }

          _context17.next = 17;
          return end - _i3 * step;

        case 17:
          --_i3;
          _context17.next = 14;
          break;

        case 20:
        case "end":
          return _context17.stop();
      }
    }
  }, _marked16, this);
}

exports.times = times;

function repeat(item) {
  var amount,
      i,
      _args18 = arguments;
  return regeneratorRuntime.wrap(function repeat$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          amount = _args18.length > 1 && _args18[1] !== undefined ? _args18[1] : Infinity;
          amount = Math.max(0, amount);
          i = 0;

        case 3:
          if (!(i < amount)) {
            _context18.next = 9;
            break;
          }

          _context18.next = 6;
          return item;

        case 6:
          ++i;
          _context18.next = 3;
          break;

        case 9:
        case "end":
          return _context18.stop();
      }
    }
  }, _marked17, this);
}

exports.repeat = repeat;
;

function iterate(seed, next) {
  var amount,
      i,
      _args19 = arguments;
  return regeneratorRuntime.wrap(function iterate$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          amount = _args19.length > 2 && _args19[2] !== undefined ? _args19[2] : Infinity;
          amount = Math.max(0, amount);
          i = 0;

        case 3:
          if (!(i < amount)) {
            _context19.next = 10;
            break;
          }

          _context19.next = 6;
          return seed;

        case 6:
          seed = next(seed);

        case 7:
          ++i;
          _context19.next = 3;
          break;

        case 10:
        case "end":
          return _context19.stop();
      }
    }
  }, _marked18, this);
}

exports.iterate = iterate;