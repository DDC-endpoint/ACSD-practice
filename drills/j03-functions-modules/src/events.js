// j03 · events.js: uses the helpers from format.js, and passes functions around.

// TODO j03-4: write the import line for format.js. You need two things from it:
//   the DEFAULT export formatEvent (no curly brackets) and the NAMED export toSummary (curly brackets).
//   Shape:  import defaultThing, { namedThing } from "./file.js";
//   (The path starts with ./ and ends with .js.)
import formatEvent, { toSummary } from "./format.js";

// TODO j03-5: write myFilter(list, test) BY HAND with a loop (no .filter!).
//   Call test(item) for every item. Keep the item if test gives back true. Return the new array.
export function myFilter(list, test) {
  const kept = [];
  for (const item of list) {
    if (test(item)) kept.push(item);
  }
  return kept;
}

// TODO j03-5: write applyToAll(list, fn) BY HAND with a loop (no .map!).
//   Call fn(item) for every item and put each result in a new array. Same length as list.
export function applyToAll(list, fn) {
  const results = [];
  for (const item of list) {
    results.push(fn(item));
  }
  return results;
}

// TODO j03-6: a function that RETURNS a function.
//   capacityOver(100) gives back a function that takes an event and says
//   whether event.capacity is bigger than 100.
export function capacityOver(n) {
  return (event) => event.capacity > n;
}

// GIVEN: shows your pieces working together. Needs the import from TODO j03-4.
export function summariseOpen(events) {
  const open = myFilter(events, (e) => e.isOpen);
  return applyToAll(open, formatEvent);
}

// GIVEN: lists of summaries { id, label } for every event. Needs toSummary from TODO j03-4.
export function summariseAll(events) {
  return applyToAll(events, toSummary);
}
