# mdast-util-arbitrary

> Generate arbitrary mdast with fast check

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
    return true;
  })
);
```
