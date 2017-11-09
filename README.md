# Natch

## Summary

Simple, explicit pattern matching in JS.

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