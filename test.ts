import { test } from "uvu";
// @ts-ignore cjs-esm conflict
import toString from "mdast-util-to-markdown";
import fc from "fast-check";
import { commonmark } from "./index.js";

test("no options", () => {
  fc.assert(
    fc.property(commonmark().Root, (mdast) => {
      const markdown = toString(mdast);
      return typeof markdown === "string" && markdown.length > 1;
    }),
    { numRuns: 10 }
  );
});

test("rootNodeMaxChildren", () => {
  fc.assert(
    fc.property(commonmark({ rootNodeMaxChildren: 10 }).Root, (mdast) => {
      const markdown = toString(mdast);
      return typeof markdown === "string" && markdown.length > 1;
    }),
    { numRuns: 10 }
  );
});

test("includeData", () => {
  fc.assert(
    fc.property(commonmark({ includeData: true }).Root, (mdast) => {
      const markdown = toString(mdast);
      return typeof markdown === "string" && markdown.length > 1;
    }),
    { numRuns: 10 }
  );
});

test.run();
