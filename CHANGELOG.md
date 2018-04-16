# Changelog

I use the following keywords:

- `Added` A new feature that is backwards-compatible.
- `Changed` A change that is not backwards-compatible.
- `Fixed` A bug or error that was fixed.

## 0.4.0

- Added methods `IStream#isEmpty` and `IStream#isSizeBetween`.
- Added method `IStream#slice` that works like `IStream#splice`, but does not remove the items from the stream.
- Changed method `IStream#splice` and exchanged the `offset` and `maxAmount` parameters to bring it in line with how `Array#splice` works. This also resulted in the same change for method `IStream#consume`.
- Changed the named of method `IStream#slice` to `chunk`, to avoid confusion with JavaScript's method `Array#slice`. The former method `IStream#chunk` is now called `IStream#chunkBy`.
- Changed: Extracted common interfaces and types to their own package. If you are using typescript and are referring to these types explicity, change the import statement from `elbe` to `andross`, see below.
- Fixed method `IStream#skip` when used with infinite stream and passed `Infinity`. This skips all items and returns an empty stream.

```typescript
import { Consumer, Predicate, /*...*/ } from "elbe";
// change to
import { Consumer, Predicate, /*...*/ } from "andross";
```

## 0.3.0

- Changed IStream#unique so that the single parameter `keyExtractor` is required. Not passing this parameter is equivalent to using IStream#unique with no parameters.
- Added method IStreamFactory#filterBy
- Added method IStreamFactory#sortBy
- Added possibility for Methods.concat to take 0 iterables instead of at least 1.
- Fixed typing for Methods.minBy, Methods.maxBy, Methods.uniqueBy

## 0.2.1

- Added method IStreamFactory#empty
- Added a shortcut for InplaceStreamFactory, `require("elbe").factory`

## 0.2.0
- Fixed ICollectors.averageGeometrically, which returned the wrong result.
- Fixed a bug with ITry#convert and ITry#flatConvert when called on a successful ITry without a backup.
- Fixed some typings.
- Changed the behaviour of IStream#limit and other methods expecting an integer argument to a more sane behaviour when a floating point number is given. 
- Changed ICollectors.summarize to return NaN for average, min, max, sum, variance. when there are no items. 
- Changed ICollectors.sum, Collectors.average, ICollectors.averageGeometrically ICollectors.averageHarmonically to return `NaN` when there are no items.
- Changed the name of Collectors.factor to Collectors.multiply. This matches the naming
  convention of Collectors.sum.
- Changed ICollectors.toMap so that when two items have the same key, it takes the
  first (not last) encountered item and adds it to the map for that key. This makes
  it consistent with IStream#unique that also takes the first value.
- Changed IStream#unique to process items only as requested. This makes it work with unlimited streams when limited afterwards. This is achieved with a [balanced binary tree](https://www.npmjs.com/package/bintrees) when a comparator is given, and a Set otherwise.
- Changed IStream#cycle to buffer the items lazily. This makes it work with unlimited
  streams when limited afterwards.
- Added a method ICollectors.random. This is not cryptographically secure.
- Added optionality to the error handler parameter of ITry#then, it is now optional.
- Added optionality to the `skip` parameter of ITry#skip, it is now optional. If not
  given, skips no items.
- Added optionality to the `limit` parameter of ITry#skip, it is now optional. If not 
  given, apply no limit.
- Added an optional paramter to Collectors.multiply for specifying how to convert
  the items into numbers.
- Added the method Collectors.map(mapper, downstream).
- Added an optional merge function to Collector.toMap and IStream#toMap.
- Improved performance of Collectors.groupDown and Collectors.partitionDown by
  not creating an unneccessary temporary array.
- Documented Collectors.
- Added second set of tests.

## 0.1.4
- Fixed typings for IStream#toMap and added type parameter to IStream#uniqueBy, IStream#minBy and IStream#maxBy
- Fixed IStreamFactory#repeat(item, amount) to default to Infinity when the second argument is not given.
- Fixed #IStream#times when called with arguments (Infinity, 0, 10) to return a stream of unlimited `0`s. `times(Infinity, 0, 10) means infinitely many items between 0 and 10, ie. separated by an infinitesimal step.
- Fixed a bug where ITry#success returned true for an erronous result.
- Fixed ITryStream#include that would not exclude the items that did not match the predicate.
- Fixed IStream#nth(n) so that it immediately returns on numbers smaller than 0. If a non-integer is given, floors it.
- Changed ITry#convert(converter, backup) and ITry#flatConvert so that it applies the backup in case the converter threw an error.
- Changed IStream#max(comparator) and IStreamFactory#min(comparator) to make the comparator optional, default to the natural comparator.
- Changed IStream#uniqueBy so that it consumes the iterable only on-demand. This allows it to work with infinite streams: `stream([1,2,3].cycle(Infinity)).uniqueBy().limit(2)`. Note that this still enters a never-ending loop when not called with a limit or a too-high limit, as it needs to keep scanning the stream for elements that are potentially new.
- The IStreamFactory.fromObject now returns a stream of objects {key, value} instead of [key, value].
- Added Methods.fromIter() that takes an iterable or an iterator and returns an iterable.
- Added IStream.consume(sink, maxAmount, offset) that consumes the given amount of items, writes them to the sink and returns a stream over the remaining items.
- Added IStream#shift and IStream#splice that return the first item or the first few items from the stream, but leave the stream open for further consumption of the remaining items. 
- Added IStrem#none(Predicate), returning true iff no item matches the given predicate.
- Added IStreamFactory#step(amount, start, step), which is similar to IStreamFactory#times, but allows specifying the step directly.
- Added first set of tests.

## 0.1.3
- The IStream#index method now returns a stream of objects {index, value}. Previously it returned a stream of array [index, value]. Named keys are easier to work with than integer keys. Performance wise, arrays are only objects, and objects with fixed keys can be optimized.

## 0.1.2
- The IStream#fork method now works with streams of unlimited length. This is achieved by querying and buffering the original stream only when needed.
