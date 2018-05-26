Iterators are great, and work well with Sets and Maps, eg. `(new Map()).entries()`.
Until I realized you can't really do much with iterators, and having to do manual
iterations all the time is a pain. Methods and their names inspired by JavaScript,
Java stream API and ruby's enumerables. Minified, transpiled code without browser
polyfills etc. is 20 KB, and around ~7 KB gzipped.

Let's compare how parsing a set of JSON strings feels like with this library and vanilla JS:

```javascript
const input = new Set(["9","9a"])
const { stream } = require("elbe");

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

- testing the API in practice, making it easier to use

# Versioning

This is currently in version `0.x.y`. Increase in patch version (y) indicates
backwards-compatible change, change in minor version non-compatible changes.

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

[See the changelog.](https://github.com/blutorange/js-elbe/blob/master/CHANGELOG.md)

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
