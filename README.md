Iterators are great, and works well with Sets and Maps, eg. `(new Map()).entries()`.
Until I realized you can't really do much with iterators, and having to do manual iterations
all the time is a pain. Methods and their names inspired by JavaScript, Java stream API
and ruby's enumerables. Minified, transpiled code without browser polyfills etc. is 20 KB.

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

# Changelog

## 0.1.2
- The IStream#fork method now works with streams of unlimited length. This is achieved by querying and buffering the original stream only when needed.

## 0.1.3
- The IStream#index method now returns a stream of objects {index, value}. Previously it returned a stream of array [index, value]. Named keys are easier to work with than integer keys. Performance wise, arrays are only objects, and objects with fixed keys can be optimized.

## 0.1.4
- The IStreamFactory.fromObject now return a stream of objects {key, value} instead of [key, value].
- Fixed typing for IStream#toMap and added type parameter to IStream#uniqueBy, IStream#minBy and IStream#maxBy

# Docs

[All methods with documentation](https://blutorange.github.io/js-elbe/), see also the directory `docs`.

```javascript
const lib = require("elbe");
```

This returns an object with the following entries:

* [Collectors](https://blutorange.github.io/js-elbe/globals.html#collectors)
* [InplaceStreamFactory](https://blutorange.github.io/js-elbe/globals.html#inplacestreamfactory)
* [Methods](https://blutorange.github.io/js-elbe/globals.html#chunk)
* [monkeyPatch](https://blutorange.github.io/js-elbe/globals.html#monkeypatch)
* [stream](https://blutorange.github.io/js-elbe/globals.html#stream)
* [TryFactory](https://blutorange.github.io/js-elbe/globals.html#tryfactory)
* [TypesafeStreamFactory](https://blutorange.github.io/js-elbe/globals.html#typesafestreamfactory)

# Install

You know the drill.

```sh
npm install --save elbe
```

Or use the standalone in `dist/elbe.js`. With node it simply exports itself, within a browser it registers globally as `window.Elbe`.

# Usage

Generates a stream of 100 numbers between 0 and 2.

```javascript
const factory = require("elbe").InplaceStreamFactory;
factory.times(1000,1.4,1.5).minBy(x => Math.abs(x * x - 2))
// => 1.41421...
```

Generates a stream from an array.

```javascript
const { stream } = require("elbe");
stream([1,2,3]).map(...).filter(...).limit(1).group(...);
```

The following entries exist on the `lib` object when requiring the library:

```javascript
lib = {
    stream, // shortcut for InplaceStream.from
    monkeyPatch, // function that patches some Object prototypes
    InplaceStreamFactory: { // see interface 'StreamFactory'
      from,
      times,
      ...
    }
    TypesafeStreamFactory: { // see interface 'StreamFactory'
      from,
      times,
      ...
    },
    TryFactory, // see interface 'ITryFactory'
    Collectors: { // all methods documented in 'Collectors'
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

## Stream wrapper

For easier chaining, there are also two wrapper classes
available for the stand-alone functions.

The inplace stream comes with less overhead, but is not typesafe.
This is most likely irrelevant unless you are using TypeScript.

```javascript
const { stream } = require("elbe");

stream([1,2,3]).map(x=>2*x).filter(x=>x>2).concat([7,9]).join(",");
// => "4,6,7,9"
```

The typesafe streams creates a new wrapper instance when
chaining for type safety. The overhead should not be large.

```javascript
const stream = require("elbe").TypesafeStreamFactory.stream;

stream([1,2,3]).map(x=>2*x).filter(x=>x>2).concat([7,9]).join(",");
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

## Monkey patching

I would not recommend it, but you can monkey-patch a `stream` method to some objects.
May be helpful for testing or prototyping.

```javascript
require("elbe").monkeypatch();

[1,2,3].stream().map(x => x + 4).toSet();
// => Set[2,4,6]

"foobar".stream().filter(x => x > "d").toArray();
// => ["f", "o", "o", "r"]

new Set([1,2,3]).stream();
// => Stream[1,2,3]

new Map(["foo", 3], ["bar", 9]).stream();
// => Stream[ ["foo", 3], ["bar", 9] ]

({foo: 3, bar: 9}).stream();
// => Stream[ ["foo", 3], ["bar", 9] ]
```

# Catching errors

Use the `try` method to handle errors during stream operations.

```javascript
stream(json1, json2, json3).try(JSON.parse);

// same as the above
stream(json1, json2, json3).map(x => lib.TryFactory.of(() => JSON.parse(x)))
```

This returns a stream with `Try` objects encapsulating the error, if one occured.

To get the values of the successful operations:

```javascript
// Logs errors to the console, removes them from the stream, and
// returns successfully parsed JSON objects.
stream(json1, json2, json3).try(JSON.parse).discardError().toArray()
```

To get the values of the successful and failed operations:

```javascript
const result = stream(json1, json2, json3).try(JSON.parse).partition(x => x.success);

result.false.forEach(error => { ... }) // do something with the errors

result.true.forEach(value => { ... }) // do something with the succesful values
```

To provide a default for failed operations:

```javascript
stream(json1, json2, json3).try(JSON.parse).map(x => x.orElse(undefined)); // JSON object or undefined.
```

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
