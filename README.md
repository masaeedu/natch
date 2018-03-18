# Natch

## Summary

Simple, natural pattern matching in JS. Akin to Clojure multimethods.

## Usage

The module's default export is a `match` function. The first argument to `match` is a discriminator projection: it sorts your input into one of a number of cases. The remaining arguments to `match` are handlers corresponding to the cases returned by the discriminator; the handler for the appropriate case will be applied to the input value and the result returned.

Some examples:

```js
import match from "natch"


// ---- Recursive implementation of array maximum
const max = match(
  a => !a.length ? "0" : a.length === 1 ? "1" : "n",

  ["0", ()          => fail("No max of empty list")               ],
  ["1", ([x])       => x                                          ],
  ["n", ([x, ...y]) => { const m = max(y); return x > m ? x : m; }])

console.log(max([1, 2, 4, 500, 8])) // => 500


// ---- Area for various shapes
const hasProp = (o, p) => o.hasOwnProperty(p)
const area = match(
  x => hasProp(x, "size") ? "square" : hasProp(x, "radius") ? "circle" : "rectangle",

  ["square",    ({ size })          => Math.pow(size, 2)],
  ["circle",    ({ radius })        => Math.PI * Math.pow(radius, 2)],
  ["rectangle", ({ width, height }) => width * height])

console.log(
  area({ size: 10 }),
  area({ width: 10, height: 11 }),
  area({ radius: 1 / Math.sqrt(Math.PI) })) // => 100, 110, 1
```

You can have a default case:

```js
import { match, otherwise } from "natch"

const signInWords = match(
  Math.sign,
  [1, _ => "positive"],
  [-1, _ => "negative"],
  [otherwise, _ => "zero"])

console.log(signInWords(0)) // => "zero"
```

If no case matches the discriminator value, the default case will be used. If no default case is provided either, `match` will throw.

## Nested usage
This is not so much a "feature" of `match` as of JS in general, but you can of course use `match` anywhere within an invocation of `match` (e.g. as a case handler, or to partition the domain).

```js
import { match } from "natch"

const thisThatOrTheOther = match(
  x => x > 5,
  [true, _ => "this"],
  [false, match(
    x => x === 5,
    [false, _ => "that"],
    [true, _ => "other"])])

console.log(
  [10, -1, 5].map(thisThatOrTheOther)) // => "this", "that", "other"
```

Use this approach sparingly: every invocation of `match` results in the creation of a `Map` to hold the case handlers. In the example above, two `Map`s are created. Although the creation of the `Map`s is a one time cost, the lookup must be performed every time a value is applied to the function. For each of the input values `10`, `-1` and `5`, two discriminator projections are invoked and two lookups are performed to find the appropriate case handler in a `Map`.
