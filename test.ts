import { test } from "uvu";
// @ts-ignore cjs-esm conflict
import toMarkdownText from "mdast-util-to-markdown";
// @ts-ignore cjs-esm conflict
import fromMarkdownText from "mdast-util-from-markdown";
import { visit, Node } from "unist-util-visit";
import { compact } from "mdast-util-compact";
import { squeezeParagraphs } from "mdast-squeeze-paragraphs";

import fc from "fast-check";
import { commonmark } from "./index.js";

function countNodesByType(mdast: Node) {
  let count: { [type: string]: number } = {};
  visit(mdast, (node: Node) => {
    if (typeof count[node.type] === "number") {
      count[node.type] = count[node.type] + 1;
    } else {
      count[node.type] = 1;
    }
  });
  return count;
}

test("detect round trip issues", () => {
  fc.assert(
    fc.property(commonmark().Root, (_mdast) => {
      const mdast = fromMarkdownText(toMarkdownText(_mdast));
      const original = countNodesByType(
        compact(squeezeParagraphs(compact(mdast)))
      );
      const roundtrip = countNodesByType(
        compact(
          squeezeParagraphs(compact(fromMarkdownText(toMarkdownText(mdast))))
        )
      );
      return Object.entries(original).every(
        // check that node counts match
        ([node, count]) => count === roundtrip[node]
      );
    }),
    {
      numRuns: 100,
      reporter: ({ counterexample, ...details }) => {
        console.log(JSON.stringify(details, null, 4));
        console.log("counter example:");
        console.log(JSON.stringify(counterexample, (_, value) => value, 4));
      },
    }
  );
});

test.run();
