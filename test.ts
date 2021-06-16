import { test } from "uvu";
// @ts-ignore cjs-esm conflict
import toString from "mdast-util-to-markdown";
import fc from "fast-check";
import { commonmark } from "./index.js";

test("ensure arbitrary can be stringified", () => {
  fc.assert(
    fc.property(commonmark.Root, (mdast) => {
      const markdown = toString(mdast);
      return typeof markdown === "string" && markdown.length > 1;
    }),
    { numRuns: 100 }
  );
});

test.run();
