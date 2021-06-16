import {
  letrec,
  record,
  constant,
  array as _array,
  oneof,
  unicodeString as _unicodeString,
  string as _string,
  webUrl,
  option as _option,
  Arbitrary,
  jsonObject,
  dictionary,
  constantFrom,
  boolean,
  nat,
} from "fast-check";
import { htmlTagNames } from "html-tag-names";

const string = () =>
  oneof(
    { withCrossShrink: true },
    _string({ minLength: 1 }),
    _unicodeString({ minLength: 1 })
  );
const array = <T>(arb: Arbitrary<T>) =>
  _array(arb, { minLength: 1, maxLength: 5 });
const option = <T>(arb: Arbitrary<T>) => _option(arb, { nil: undefined });

const referenceType = () =>
  oneof(constant("full"), constant("shortcut"), constant("collapsed"));
const data = () => option(dictionary(string(), jsonObject()));

export const commonmark = letrec((next) => ({
  Root: record({
    type: constant("root"),
    children: array(next("FlowContent")),
    data: data(),
  }),
  FlowContent: oneof(
    { depthFactor: 1, withCrossShrink: true },
    next("Content"),
    next("Blockquote"),
    next("Code"),
    next("Heading"),
    next("HTML"),
    next("List"),
    next("ThematicBreak")
  ),
  Content: oneof(
    { depthFactor: 1, withCrossShrink: true },
    next("Paragraph"),
    next("Definition")
  ),
  ListContent: next("ListItem"),
  PhrasingContent: oneof(
    // links cannot be nested
    { maxDepth: 1, withCrossShrink: true },
    next("StaticPhrasingContent")
  ),
  StaticPhrasingContent: oneof(
    { depthFactor: 1, withCrossShrink: true },
    // terminal nodes
    oneof(
      { depthFactor: 0, withCrossShrink: true },
      next("Text"),
      next("InlineCode"),
      next("Break"),
      next("Image"),
      next("ImageReference")
    ),
    // recursive nodes
    next("Strong"),
    next("Emphasis")
  ),
  Definition: record({
    type: constant("definition"),
    identifier: string(),
    label: option(string()),
    url: webUrl(),
    title: option(string()),
    data: data(),
  }),
  Paragraph: record({
    type: constant("paragraph"),
    children: array(next("PhrasingContent")),
    data: data(),
  }),
  Text: record({
    type: constant("text"),
    value: string(),
    data: data(),
  }),
  Strong: record({
    type: constant("strong"),
    children: array(next("StaticPhrasingContent")),
    data: data(),
  }),
  Emphasis: record({
    type: constant("emphasis"),
    children: array(next("StaticPhrasingContent")),
    data: data(),
  }),
  Break: record({
    type: constant("break"),
    data: data(),
  }),
  Image: record({
    type: constant("image"),
    url: webUrl(),
    title: option(string()),
    alt: option(string()),
    data: data(),
  }),
  InlineCode: record({
    type: constant("inlineCode"),
    value: string(),
    data: data(),
  }),
  ImageReference: record({
    type: constant("imageReference"),
    identifier: string(),
    label: option(string()),
    referenceType: referenceType(),
    alt: option(string()),
    data: data(),
  }),
  Link: record({
    type: constant("link"),
    url: webUrl(),
    title: option(string()),
    children: array(next("StaticPhrasingContent")),
    data: data(),
  }),
  LinkReference: record({
    type: constant("linkReference"),
    identifier: string(),
    label: option(string()),
    referenceType: referenceType(),
    children: array(next("StaticPhrasingContent")),
    data: data(),
  }),
  Blockquote: record({
    type: constant("blockquote"),
    children: array(next("FlowContent")),
    data: data(),
  }),
  Code: record({
    type: constant("code"),
    lang: option(string()),
    meta: option(string()),
    value: string(),
    data: data(),
  }),
  Heading: record({
    type: constant("heading"),
    depth: oneof(
      constant(1),
      constant(2),
      constant(3),
      constant(4),
      constant(5),
      constant(6)
    ),
    children: array(next("PhrasingContent")),
    data: data(),
  }),
  HTML: record({
    type: constant("html"),
    value: constantFrom(...htmlTagNames).chain((tag) =>
      oneof(
        constant(tag).map((tag) => `<${tag}>`),
        constant(tag).map((tag) => `</${tag}>`)
      )
    ),
    data: data(),
  }),
  List: record({
    type: constant("list"),
    ordered: option(boolean()),
    start: option(nat()),
    spread: option(boolean()),
    children: array(next("ListContent")),
    data: data(),
  }),
  ListItem: record({
    type: constant("listItem"),
    spread: option(boolean()),
    children: array(next("FlowContent")),
    data: data(),
  }),
  ThematicBreak: record({ type: constant("thematicBreak"), data: data() }),
}));
