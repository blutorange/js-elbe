Iterators are great, and work well with Sets and Maps, eg. `(new Map()).entries()`.
Until I realized you can't really do much with iterators, and having to do manual
iterations all the time is a pain. Methods and their names inspired by JavaScript,
Java stream API and ruby's enumerables. Minified, transpiled code without browser
polyfills etc. is 20 KB, and around ~7 KB gzipped.

Let's compare how parsing a set of JSON strings feels like with this library and vanilla JS:

```javascript
const input = new Set(["9","9a"])

// Doing it with this library, returns [9,0]
stream(input).try(JSON.parse)
    .onError(console.error)
    .orElse(0)
    .toArray()

// The same with vanilla JS, returns [9,0]
Array.from(function*(data) {
    for (let item of data) {
        try {
            yield JSON.parse(item)
        }
        catch (e) {
            console.error(e)
            yield 0
        }
    }
}(input))
```

# Roadmap

- investigate a IStream#rewind method. IStream#fork already serves this purpose.
- testing the API in practice, making it easier to use

# Versioning

This is currently in version 0.x. Once this package is used by other packages other than my own, the version will be
increased to 1.0 and start using [semantic versioning](https://semver.org/).

# Docs

[All methods with documentation](https://blutorange.github.io/js-elbe/).

The entire public API is expressed in terms of (typescript) interfaces, these
are fully documented.

The docs can be viewed offline from the directory `docs`. Tests with more examples are in `test`. 

```javascript
const lib = require("elbe");
```

This returns an object with the following entries:

* [Collectors](https://blutorange.github.io/js-elbe/globals.html#collectors)
* [InplaceStreamFactory](https://blutorange.github.io/js-elbe/globals.html#inplacestreamfactory)
* [Methods](https://blutorange.github.io/js-elbe/globals.html#appendCause)
* [monkeyPatch](https://blutorange.github.io/js-elbe/globals.html#monkeypatch)
* [stream](https://blutorange.github.io/js-elbe/globals.html#stream)
* [TryFactory](https://blutorange.github.io/js-elbe/globals.html#tryfactory)
* [TypesafeStreamFactory](https://blutorange.github.io/js-elbe/globals.html#typesafestreamfactory)

The [IStream](https://blutorange.github.io/js-elbe/interfaces/istream.html) contains all the juicy methods you want. A stream is created by an [InplaceStreamFactory](https://blutorange.github.io/js-elbe/globals.html#inplacestreamfactory), accessible via `require("elbe").factory`. Read
below for further details.

[Coverage report.](https://blutorange.github.io/js-elbe/coverage/)

# Install

You know the drill.

```sh
npm install --save elbe
```

Then load it

```javascript
const { stream, factory } = require("elbe");
// or
import { stream, factory } from "elbe";
```

Or use the standalone in `dist/elbe.js` that includes all required npm libraries and
was transformed with babel. Within a browser it registers globally as `window.Elbe`.

# Usage

You can create a stream either from an iterable source such as an array
or a `Set`; or use one of the factory methods such as `times` or `random`.
The created stream then provides several methods such as `map` or `collect`
to operate on its items.

Generate a stream of 100 numbers between 1 and 100 and sums them, as fast as Gauss.

```javascript
const factory = require("elbe").factory;
factory.times(100,1,100).sum()
// => 5050
```

Generate numbers between 1.4 and 1.5, and take the one whose square is closest to 2.

```javascript
const factory = require("elbe").factory;
factory.times(1000,1.4,1.5).minBy(x => Math.abs(x * x - 2))
// => 1.41421...
```

Generate a stream from an array.

```javascript
const { stream } = require("elbe");
stream([1,2,3]).map(...).filter(...).limit(1).group(...);
```

The following entries exist on the object when requiring the library:

```javascript
const lib = require("elbe");
lib = {
    stream, // shortcut for InplaceStreamFactory.stream
    factory, // shortcut for InplaceStreamFactory
    monkeyPatch, // function that patches some Object prototypes
    InplaceStreamFactory: { // see interface 'StreamFactory'
      stream,
      times,
      generate,
      ...
    }
    TypesafeStreamFactory: { // see interface 'StreamFactory'
      from,
      times,
      generate,
      ...
    },
    TryFactory, // see interface 'ITryFactory'
    Collectors: { // see interface 'ICollectors'
        join,
        group,
        ...
    },
    Methods: { // contains all methods documented in 'Methods'
        filter, 
        group,
        map,
        ...
    }
}
```

There are three different ways of using the stream methods:

## Standalone functions

All methods are available as stand-alone functions taking an
iterable as their first argument.

```javascript
const { Collectors, Methods: {map, filter, collect} } = require("elbe");

const iterable = [1,2,3];

map(iterable, x => 2*x); // => Iterable[2,4,6]

filter(iterable, x => x > 2); // => Iterable[4,6]

collect(iterable, Collectors.join()); // => "4,6"
```

All factory methods for creating streams are also available:

```javascript
const { Methods: {times} } = require("elbe");
times(10).map(i => i + 1).toArray()
// => [1,2,3,4,5,6,7,8,9,10]
```

## Stream wrapper

For easier chaining, there are also two wrapper classes
available for the stand-alone functions.

The inplace stream comes with less overhead, but is not typesafe.
This is most likely irrelevant unless you are using TypeScript.

```javascript
const { stream } = require("elbe");

stream([1,2,3]).map(x => 2*x).filter(x => x > 2).concat([7,9]).join(",");
// => "4,6,7,9"
```

The typesafe streams creates a new wrapper instance when
chaining for type safety. The overhead should not be large.

```javascript
const stream = require("elbe").TypesafeStreamFactory.stream;

stream([1,2,3]).map(x => 2*x).filter(x=>x>2).concat([7,9]).join(",");
// => "4,6,7,9"
```

Once a stream was chained (consumed), it must not be used anymore,
or an error is thrown:

```javascript
const stream = require("elbe").TypesafeStreamFactory.stream;

const s = stream([1,2,3]);

s.map(x => x * x); // => Stream[1,4,9]

// Error: "Stream was already consumed."
s.filter(x => x > 2);
```

Similarly for inplace streams: 

```javascript
const stream = require("elbe").InplaceStreamFactory.stream;

const s = stream([1,2,3]);

s.map(x => x * x); // => Stream[2,4,6]

s.filter(x => x > 2); // => Stream[4,6]

s.join() // => "46"

s.join() // Error: "Stream was already consumed."
```

### Unlimited streams

Stream can be of unlimited (`infinite`) length, one common example are generators
such as random number generators:

```javascript
const { InplaceStreamFactory: factory } = require("elbe");
const unlimitedStream = factory.generate(Math.random);
```

Methods operating on streams try to read only as many items from the stream
as required. This means you can create chains of stream operations on unlimited
streams and not have it hang, as long as the terminal operation does not request
all items. For example:

```javascript
// Returns the first item
factory.generate(Math.random)
  .map(x=>10*x)
  .filter(x=>x>5)
  .first();

// Returns the first 20 items.
factory.generate(Math.random)
  .map(x=>10*x)
  .filter(x=>x>5)
  .limit(20)
  .toArray()

// Returns the first 20 items and leaves the stream open so
// that you can read more items from it later.
factory.generate(Math.random)
  .map(x=>10*x)
  .filter(x=>x>5)
  .splice(20)
```

A notable example that always needs to read the entire stream is `IStream#reverse`.
Filtering the stream for uniqueness with `IStream#unique` and `IStream#uniqueBy`
supports unlimited stream.s

### Note for typescript users

Some methods from `IStream` have the special return type `this`. They DO NOT
return the same object; but rather `this` is used to indicate that the returned
stream is of the same type as the stream on which the method was called. This allows
the typescript compiler to infer that a subclass of `IStream` remains as such even
when calling methods from the super type. To illustrate:

```javascript
// s is now of type IStream<number>
s = stream([1,2,3])

// s is now a ITryStream<number> with some additional methods
s = s.try(/*something dangerous*/)

// `limit` is a method from IStream<T>, and without the `this` return
// type, s would be downgraded to a normal stream, losing all additional
// methods from ITryStream<T>.
//
// s is still of type ITryStream<number>, but may be a different
// instance than before. For this to work with the typescript compile,
// the return type is required to be `this`.
s = s.limit(2)
```

## Monkey patching

I would not recommend it, but you can monkey-patch a `stream` method to some objects.
May be helpful for testing or prototyping.

```javascript
require("elbe").monkeypatch();

[1,2,3].stream().map(x => x + 4).toSet();
// => Set[5,6,7]

"foobar".stream().filter(x => x > "d").toArray();
// => ["f", "o", "o", "r"]

new Set([1,2,3]).stream();
// => Stream[1,2,3]

new Map(["foo", 3], ["bar", 9]).stream();
// => Stream[ ["foo", 3], ["bar", 9] ]

({foo: 3, bar: 9}).stream();
// => Stream[ {key: "foo", value: 3}], {key: "bar", value: 9} ]
```

# Catching errors

Use the `try` method to handle errors during stream operations.

```javascript
const { stream, TryFactory } = require("elbe");
stream([json1, json2, json3]).try(JSON.parse);

// The same effect could be achieved by mapping each item manually
stream([json1, json2, json3]).map(x => lib.TryFactory.of(() => JSON.parse(x)))
```

This returns a stream with `Try` objects encapsulating the error, if one occured.

To get the values of the successful operations:

```javascript
// Logs errors to the console, removes them from the stream, and
// returns successfully parsed JSON objects.
stream([json1, json2, json3]).try(JSON.parse).discardError().toArray()
```

To get the values of the successful and failed operations:

```javascript
const result = stream([json1, json2, json3]).try(JSON.parse).partition(x => x.success);
// do something with the errors
result.false.forEach(errorTry => { ... })
// do something with the succesful values
result.true.forEach(valueTry => { ... })

// Alternatively, call an error/success handler
const s = stream([json1, json2, json3]).try(JSON.parse)
s.then(json => {/* success handler*/}, error => {/*error handler*/})
```

To provide a default for failed operations:

```javascript
stream(json1, json2, json3).try(JSON.parse).orElse(undefined);
// JSON object or undefined.
```

# Changelog

### 0.2.1

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

# Build

Make sure you fetch all dependencies

```sh
npm install
```

Then run

```sh
npm run build
```

This may fail on Windows, who but a rabbit knows...

# Teh name

Many a barrel of water streams, but never rolls, down the [Elbe river](https://en.wikipedia.org/wiki/Elbe).
