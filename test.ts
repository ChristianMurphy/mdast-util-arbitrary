import { test } from "uvu";
// @ts-ignore cjs-esm conflict
import toMarkdownText from "mdast-util-to-markdown";
// @ts-ignore cjs-esm conflict
import remark from "remark";
// @ts-ignore no typings
import lintRecommended from "remark-preset-lint-recommended";
// @ts-ignore no typings
import lintStyleguide from "remark-preset-lint-markdown-style-guide";
// @ts-ignore no typings
import lintConsistent from "remark-preset-lint-consistent";

import fc from "fast-check";
import { commonmark } from "./index.js";

test("no options with mdast-util-to-markdown", () => {
  fc.assert(
    fc.property(commonmark().Root, (mdast) => {
      const markdown = toMarkdownText(mdast);
      return typeof markdown === "string" && markdown.length > 1;
    }),
    { numRuns: 10 }
  );
});

test("rootNodeMaxChildren with mdast-util-to-markdown", () => {
  fc.assert(
    fc.property(commonmark({ rootNodeMaxChildren: 10 }).Root, (mdast) => {
      const markdown = toMarkdownText(mdast);
      return typeof markdown === "string" && markdown.length > 1;
    }),
    { numRuns: 10 }
  );
});

test("includeData with mdast-util-to-markdown", () => {
  fc.assert(
    fc.property(commonmark({ includeData: true }).Root, (mdast) => {
      const markdown = toMarkdownText(mdast);
      return typeof markdown === "string" && markdown.length > 1;
    }),
    { numRuns: 10 }
  );
});

test("commonmark with remark-preset-lint-recommended", () => {
  fc.assert(
    fc.property(commonmark().Root, (mdast) => {
      remark().use(lintRecommended).runSync(mdast);
      return true;
    }),
    { numRuns: 10 }
  );
});

test("commonmark with remark-preset-lint-markdown-style-guide", () => {
  fc.assert(
    fc.property(commonmark().Root, (mdast) => {
      remark().use(lintStyleguide).runSync(mdast);
      return true;
    }),
    { numRuns: 10 }
  );
});

test("commonmark with remark-preset-lint-consistent", () => {
  fc.assert(
    fc.property(commonmark().Root, (mdast) => {
      remark().use(lintConsistent).runSync(mdast);
      return true;
    }),
    { numRuns: 10 }
  );
});

test.run();
