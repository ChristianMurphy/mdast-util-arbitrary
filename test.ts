import { test } from "uvu";
// @ts-ignore cjs-esm conflict
import toString from "mdast-util-to-markdown";
import fc from "fast-check";
import { commonmark } from "./index.js";

test("ensure arbitrary can be stringified", () => {
  fc.assert(
    fc.property(commonmark.Root, (mdast) => {
      toString(mdast);
      return true;
    })
  );
});

test.run();
