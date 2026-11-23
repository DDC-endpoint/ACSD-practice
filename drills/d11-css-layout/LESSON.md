---
id: d11
module: ACSD
kind: drill
title: CSS Grid areas, minmax, clamp and :focus-visible
difficulty: 1
timeMinutes: 20
mock: [A9, A16, A20, B12]
tasks:
  - { name: ".page: display grid + grid-template-areas (header/sidebar/main/footer)", tests: [1, 7] }
  - { name: "place the children with grid-area", tests: [2, 7] }
  - { name: ".cards: repeat(auto-fit, minmax(200px, 1fr))", tests: [3] }
  - { name: "h1: font-size clamp(1.5rem, 4vw, 3rem)", tests: [4] }
  - { name: ":focus-visible outline, no global outline removal", tests: [5] }
  - { name: "@media (max-width: 600px): one-column areas", tests: [6] }
---

# d11 · CSS Grid areas, minmax, clamp and :focus-visible

> **Exam link:** four quick marks. **A9** *"Which CSS property is particularly useful for creating layouts with named grid areas?"* (`grid-template-areas`). **A16** *"Which CSS function allows a property to have a preferred value while respecting minimum and maximum limits?"* (`clamp()`, with `calc()`, `minmax()` and `var()` as distractors). **A20** *"What is the purpose of the CSS pseudo-class :focus-visible?"* **B12** *"The CSS minmax() function can specify minimum and maximum sizes for grid tracks"* (True). The ICT asks you to pick the option, so you need to know what each function does and which one the question describes.

## The idea

### 1. `grid-template-areas`: draw the layout with names (A9)

Name the cells in quoted strings, **one string per row**. Then put each child in a named area with `grid-area`.

```css
.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-areas:
    "header  header"     /* row 1: header spans both columns */
    "sidebar main"       /* row 2 */
    "footer  footer";    /* row 3 */
}
.page-header { grid-area: header; }   /* no quotes here: it's a name, not a string */
```

Rules that catch people out:
- Every string must have the **same number of cells** as the other rows.
- Repeat a name to make it **span** cells. Each area must form a rectangle.
- Use `.` for an **empty cell**: `"header header" ". main"`.
- Quotes go around the rows in `grid-template-areas`, never around the name in `grid-area`.

([MDN: grid-template-areas](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas))

### 2. `minmax()` sizes grid tracks (B12)

`minmax(min, max)` is used **inside grid track sizes** (`grid-template-columns`/`rows`). The track is never smaller than `min` and never bigger than `max`. So B12 is **True**.

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
```

Read it as: "make as many columns as fit (`auto-fit`), each at least `200px`, then share the leftover space equally (`1fr`)". The cards wrap onto new rows by themselves, with no media query. `auto-fill` is similar but keeps empty tracks when there are few items, while `auto-fit` collapses them so the items stretch. ([MDN: minmax()](https://developer.mozilla.org/en-US/docs/Web/CSS/minmax))

### 3. `clamp(min, preferred, max)` (A16)

```css
h1 { font-size: clamp(1.5rem, 4vw, 3rem); }
```

The browser uses the **preferred** value (`4vw`, 4% of the viewport width) but never goes below `1.5rem` or above `3rem`. One line gives a fluid heading. ([MDN: clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp))

The A16 distractors:

| Function | What it does | Why it's not the A16 answer |
|---|---|---|
| `clamp(min, val, max)` | a preferred value kept between two limits | **this is it**: works on any property |
| `minmax(min, max)` | a grid **track** size range | only in grid templates, and it has no preferred value |
| `calc(...)` | does maths: `calc(100% - 2rem)` | no limits at all |
| `var(--x)` | reads a custom property | just a variable |

### 4. `:focus-visible` vs `:focus` (A20)

- `:focus` matches **whenever** an element has focus, including after a mouse click on a button.
- `:focus-visible` matches only when the browser decides a focus ring is **useful**, mainly keyboard (Tab) navigation.

So keyboard users get a clear ring, and mouse users don't see a ring flash on every click.

```css
:focus-visible { outline: 3px solid #1a5fb4; outline-offset: 2px; }
```

Never write `*:focus { outline: none; }`. That removes the only sign of where a keyboard user is on the page, which is an accessibility failure. ([MDN: :focus-visible](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible))

### 5. One media query to stack the areas

Inside the media query, re-declare the template with **one name per row**:

```css
@media (max-width: 600px) {
  .page {
    grid-template-columns: 1fr;
    grid-template-areas: "header" "main" "sidebar" "footer";
  }
}
```

The children keep their `grid-area`. Only the template changes, so the layout re-arranges without touching the HTML.

## Worked example

A different page: a **recipe** card with a photo, title, ingredients and steps.

```css
.recipe {
  display: grid;
  grid-template-columns: minmax(150px, 1fr) 2fr;    /* left column: at least 150px */
  grid-template-areas:
    "photo  title"
    "photo  steps"
    "ingr   steps";
  gap: 1rem;
}
.recipe-photo { grid-area: photo; }
.recipe-title { grid-area: title; font-size: clamp(1.25rem, 3vw, 2rem); }
.recipe-ingr  { grid-area: ingr; }
.recipe-steps { grid-area: steps; }

.recipe a:focus-visible { outline: 2px dashed currentColor; }

@media (max-width: 600px) {
  .recipe {
    grid-template-columns: 1fr;
    grid-template-areas: "title" "photo" "ingr" "steps";
  }
}
```

- `photo` appears in two rows of the same column, so the photo spans two rows. `steps` does the same in the other column.
- `minmax(150px, 1fr)` is a **track** size: the left column never shrinks below 150px.
- `clamp` keeps the title readable on a phone and stops it getting huge on a wide monitor.
- On small screens each string has one name, so everything stacks, and the title moves above the photo.

## Your task

1. Open `src/Page.tsx` and read the class names (nothing to change there). Then open `src/layout.css`: `body` and `.card` are given. Write **TODO d11-1** to **d11-6**:
   - **d11-1** `.page`: `display: grid` + `grid-template-areas` (header on top, sidebar + main, footer at the bottom).
   - **d11-2** `grid-area` on `.page-header`, `.page-sidebar`, `.page-main`, `.page-footer`.
   - **d11-3** `.cards`: `repeat(auto-fit, minmax(200px, 1fr))`.
   - **d11-4** `h1`: `clamp(1.5rem, 4vw, 3rem)`.
   - **d11-5** a visible outline on `:focus-visible`.
   - **d11-6** `@media (max-width: 600px)`: one column, one area per row.
2. Run `npm test -- d11` until all 7 are green. The tests read your CSS as text (jsdom can't do layout), so spacing and quote style don't matter.
3. Then: **write it from memory.** The ICT has no editor, autocomplete or tests. Close the file and write on paper: a 3-row `grid-template-areas`, the `repeat(auto-fit, minmax(...))` line and the `clamp(...)` line. Then say out loud which of `calc`/`minmax`/`clamp`/`var` A16 wants, and why.

## Hints

<details><summary>Hint 1: where do I start?</summary>

Write `.page { display: grid; }` first, then add `grid-template-areas` with three quoted strings, each holding two names. Add `grid-template-columns: 200px 1fr;` so the two columns have sizes.
</details>

<details><summary>Hint 2: test 1 says the rows have different lengths</summary>

`"header" "sidebar main" "footer"` is invalid: rows 1 and 3 have 1 cell and row 2 has 2. Repeat the name to span: `"header header"`, `"footer footer"`.
</details>

<details><summary>Hint 3: test 2 fails even though the layout looks right</summary>

`grid-area: "header";` with quotes is wrong (the browser ignores it). It's `grid-area: header;`. Quotes only go in `grid-template-areas`.
</details>

<details><summary>Hint 4: test 6 can't find the media query</summary>

Write it exactly as `@media (max-width: 600px) { .page { ... } }`, with the `.page` rule **inside** the braces. Each area string holds a single name: `"header" "main" "sidebar" "footer"`.
</details>

<details><summary>Hint 5: test 7 says a class is not styled</summary>

Every class in `Page.tsx` needs a rule. `.page-header` etc. come from d11-2, and `.cards` from d11-3. Check the spelling against the TSX.
</details>

## Viva questions

Answer out loud, the way you'd write it in a Section C/D text box, then open the answer.

<details><summary>Which CSS property creates a layout with named grid areas? How do you place an element in one? (A9)</summary>

`grid-template-areas` on the grid container, with one quoted string per row naming each cell, for example `"header header" "sidebar main"`. Each child then uses `grid-area: header;` (no quotes) to go into that area. A `.` marks an empty cell.
</details>

<details><summary>Which CSS function gives a preferred value while respecting a minimum and a maximum? (A16)</summary>

`clamp(min, preferred, max)`, for example `font-size: clamp(1.5rem, 4vw, 3rem)`. The trap is `minmax()`: it only sets a size range for grid tracks and has no preferred value. `calc()` only does arithmetic, and `var()` reads a custom property.
</details>

<details><summary>True or False: minmax() can specify minimum and maximum sizes for grid tracks. (B12)</summary>

True. `minmax(200px, 1fr)` in `grid-template-columns` makes each column at least 200px and at most one share of the free space. With `repeat(auto-fit, ...)` that gives a responsive card grid without media queries.
</details>

<details><summary>What is the purpose of :focus-visible, and how is it different from :focus? (A20)</summary>

`:focus-visible` styles an element that has focus only when a visible focus indicator is appropriate, mainly keyboard navigation. `:focus` matches every time the element is focused, including mouse clicks. So keyboard users get a clear ring and mouse users don't see one on every click. You should never remove outlines globally with `outline: none`.
</details>

<details><summary>How do you make a grid-template-areas layout one column on a phone?</summary>

Add `@media (max-width: 600px) { .page { grid-template-columns: 1fr; grid-template-areas: "header" "main" "sidebar" "footer"; } }`. The children keep their `grid-area` names, so only the template is re-declared, and the HTML doesn't change.
</details>
