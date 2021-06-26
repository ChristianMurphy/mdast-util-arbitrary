# mdast-util-arbitrary

[![NPM Version](https://img.shields.io/npm/v/mdast-util-arbitrary)](https://www.npmjs.com/package/mdast-util-arbitrary)
[![CI](https://github.com/ChristianMurphy/mdast-util-arbitrary/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/ChristianMurphy/mdast-util-arbitrary/actions/workflows/main.yml)

Generate arbitrary, random, and valid [`mdast`](https://github.com/syntax-tree/mdast) with [`fast-check`](https://github.com/dubzzz/fast-check), useful for [property testing](https://medium.com/criteo-engineering/introduction-to-property-based-testing-f5236229d237) [`mdast` utils](https://github.com/syntax-tree/mdast#list-of-utilities) and [`remark` plugins](https://github.com/remarkjs/remark/blob/main/doc/plugins.md#plugins).

## Install

```bash
npm install --save-dev mdast-util-arbitrary
```

## Usage

```ts
import { assert, property } from "fast-check";
import { commonmark } from "mdast-util-arbitrary";

assert(
  property(commonmark().Root, (mdast) => {
    // do something with mdast
  })
);
```

## API

This package exports a commonmark function which returns a dictionary of node types which can be generated (usually `Root` should be used starting node type)

`commonmark(options?: Options) => {[nodeType: string]: Arbitrary}`

### Options

#### `Options.includeData`

Whether to generate arbitrary [`data`](https://github.com/syntax-tree/unist#node) attributes for nodes. Default `false`.

#### `Options.rootNodeMaxChildren`

Limit the maximum number of child nodes the `Root` node can have. Default `100`.

## Example

Using [`uvu`](https://github.com/lukeed/uvu) to test [`mdast-util-to-markdown`](https://github.com/syntax-tree/mdast-util-to-markdown).

Checking three properties of `mdast-util-to-markdown`:

1. it does not throw an exception on valid markdown
2. it produces a string
3. it produces non-empty markdown text

Generating 100 mdast random mdast trees to see if the properties hold true.

```ts
import { test } from "uvu";
import toString from "mdast-util-to-markdown";
import { assert, property } from "fast-check";
import { commonmark } from "mdast-util-arbitrary";

test("arbitrary mdast can be stringified", () => {
  assert(
    property(commonmark().Root, (mdast) => {
      const markdown = toString(mdast);
      return typeof markdown === "string" && markdown.length > 1;
    }),
    { numRuns: 100 }
  );
});

test.run();
```
