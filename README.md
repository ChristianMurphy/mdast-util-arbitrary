# mdast-util-arbitrary

[![CI](https://github.com/ChristianMurphy/mdast-util-arbitrary/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/ChristianMurphy/mdast-util-arbitrary/actions/workflows/main.yml)

Generate arbitrary, random, and valid [`mdast`](https://github.com/syntax-tree/mdast) with [`fast-check`](https://github.com/dubzzz/fast-check), useful for [property testing](https://en.wikipedia.org/wiki/Property_testing) `mdast` utils and `remark` plugins.

## Install

```bash
npm install --save-dev mdast-util-arbitrary
```

## Usage

```ts
import { assert, property } from "fast-check";
import { commonmark } from "mdast-util-arbitrary";

assert(
  property(commonmark.Root, (mdast) => {
    // do something with mdast
  })
);
```

## Example

Using [`uvu`](https://github.com/lukeed/uvu) to test [`mdast-util-to-markdown`](https://github.com/syntax-tree/mdast-util-to-markdown).

Checking three properties of `mdast-util-to-markdown`:

1. it does not throw an exception on valid markdown
2. it produces a string
3. it produces non-empty markdown

```ts
import { test } from "uvu";
import toString from "mdast-util-to-markdown";
import fc from "fast-check";
import { commonmark } from "./index.js";

test("arbitrary mdast can be stringified", () => {
  fc.assert(
    fc.property(commonmark.Root, (mdast) => {
      const markdown = toString(mdast);
      return typeof markdown === "string" && markdown.length > 1;
    })
  );
});

test.run();
```
