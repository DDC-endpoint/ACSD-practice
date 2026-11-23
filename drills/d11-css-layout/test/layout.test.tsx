import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { render } from "@testing-library/react";
import Page from "../src/Page";

// jsdom does not compute layout, so we read the CSS as text and check the declarations.
// (Pass import.meta.url as a string: jsdom replaces the global URL class, which node:url rejects.)
const cssPath = resolve(dirname(fileURLToPath(import.meta.url)), "../src/layout.css");
const css = readFileSync(cssPath, "utf8").replace(/\/\*[\s\S]*?\*\//g, ""); // strip comments

interface Rule {
  selector: string;
  body: string;
}

/** Split the stylesheet into top-level text and @media blocks (balanced braces). */
function splitMedia(text: string): { topLevel: string; media: { query: string; body: string }[] } {
  const media: { query: string; body: string }[] = [];
  let topLevel = "";
  let i = 0;
  while (i < text.length) {
    const at = text.indexOf("@media", i);
    if (at === -1) {
      topLevel += text.slice(i);
      break;
    }
    topLevel += text.slice(i, at);
    const open = text.indexOf("{", at);
    if (open === -1) break;
    let depth = 1;
    let j = open + 1;
    while (j < text.length && depth > 0) {
      if (text[j] === "{") depth++;
      if (text[j] === "}") depth--;
      j++;
    }
    media.push({ query: text.slice(at + 6, open).trim(), body: text.slice(open + 1, j - 1) });
    i = j;
  }
  return { topLevel, media };
}

function parseRules(text: string): Rule[] {
  return [...text.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ selector: m[1].trim(), body: m[2] }));
}

/** Values of `prop` in every rule whose selector list includes `selector`. */
function valuesOf(rules: Rule[], selector: string, prop: string): string[] {
  const re = new RegExp(`(?:^|[;\\s{])${prop}\\s*:\\s*([^;]+)`, "gi");
  return rules
    .filter((r) => r.selector.split(",").map((s) => s.trim()).includes(selector))
    .flatMap((r) => [...r.body.matchAll(re)].map((m) => m[1].replace(/\s+/g, " ").trim()));
}

/** `"header header" "sidebar main"` -> [["header","header"],["sidebar","main"]] */
function areaRows(value: string): string[][] {
  return [...value.matchAll(/["']([^"']*)["']/g)].map((m) => m[1].trim().split(/\s+/).filter(Boolean));
}

const { topLevel, media } = splitMedia(css);
const rules = parseRules(topLevel);
const AREAS = ["header", "sidebar", "main", "footer"];

test("1. .page is a grid with grid-template-areas naming header, sidebar, main and footer", () => {
  expect(valuesOf(rules, ".page", "display")).toContain("grid");
  const areas = valuesOf(rules, ".page", "grid-template-areas");
  expect(areas.length).toBeGreaterThan(0);
  const rows = areaRows(areas[areas.length - 1]);
  expect(rows.length).toBeGreaterThanOrEqual(2);
  expect(new Set(rows.flat())).toEqual(new Set(AREAS));
  // every row is a quoted string with the same number of columns, and it's a 2+ column desktop layout
  expect(new Set(rows.map((r) => r.length)).size).toBe(1);
  expect(rows[0].length).toBeGreaterThanOrEqual(2);
});

test("2. each child is placed with grid-area", () => {
  for (const area of AREAS) {
    expect(valuesOf(rules, `.page-${area}`, "grid-area")).toContain(area);
  }
});

test("3. .cards uses repeat(auto-fit, minmax(200px, 1fr))", () => {
  expect(valuesOf(rules, ".cards", "display")).toContain("grid");
  const cols = valuesOf(rules, ".cards", "grid-template-columns").join(" ");
  expect(cols).toMatch(/repeat\(\s*auto-fit\s*,\s*minmax\(\s*200px\s*,\s*1fr\s*\)\s*\)/);
});

test("4. h1 uses font-size: clamp(1.5rem, 4vw, 3rem)", () => {
  const sizes = valuesOf(rules, "h1", "font-size").join(" ");
  expect(sizes).toMatch(/clamp\(\s*1\.5rem\s*,\s*4vw\s*,\s*3rem\s*\)/);
});

test("5. :focus-visible gets a visible outline, and focus outlines are not removed globally", () => {
  const focusRules = rules.filter((r) => r.selector.includes(":focus-visible") && !r.selector.includes(":not("));
  const outlines = focusRules.flatMap((r) =>
    [...r.body.matchAll(/(?:^|[;\s{])outline(?:-style)?\s*:\s*([^;]+)/gi)].map((m) => m[1].trim()),
  );
  expect(outlines.some((v) => /\b(solid|dashed|dotted|double|groove|ridge|auto)\b/i.test(v) && !/\bnone\b/i.test(v))).toBe(true);

  // `outline: none` / `outline: 0` is only OK on :focus:not(:focus-visible)
  const removed = parseRules(css).filter((r) => /(?:^|[;\s{])outline\s*:\s*(none|0)\b/i.test(r.body));
  for (const r of removed) expect(r.selector).toContain(":not(:focus-visible)");
});

test("6. @media (max-width: 600px) stacks the areas into one column", () => {
  const small = media.find((m) => /\(\s*max-width\s*:\s*600px\s*\)/.test(m.query));
  expect(small, "no @media (max-width: 600px) block").toBeDefined();
  const areas = valuesOf(parseRules(small!.body), ".page", "grid-template-areas");
  expect(areas.length).toBeGreaterThan(0);
  const rows = areaRows(areas[areas.length - 1]);
  expect(rows.every((r) => r.length === 1)).toBe(true);
  expect(new Set(rows.flat())).toEqual(new Set(AREAS));
});

test("7. every class Page.tsx uses has a rule in layout.css", () => {
  const { container } = render(<Page />);
  const classes = new Set([...container.querySelectorAll("[class]")].flatMap((el) => [...el.classList]));
  expect(classes.size).toBeGreaterThan(0);
  for (const name of classes) {
    expect(css, `.${name} is not styled`).toMatch(new RegExp(`\\.${name}(?![\\w-])[^{}]*\\{`));
  }
});
