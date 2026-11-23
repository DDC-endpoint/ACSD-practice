import { useState } from "react";

export interface CounterOptions {
  min?: number;
  max?: number;
}

export interface Counter {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export function useCounter(initial = 0, { min = -Infinity, max = Infinity }: CounterOptions = {}): Counter {
  // TODO d04-2: hold `count` in useState(initial) and return { count, increment, decrement, reset }.
  //   - increment adds 1 but never goes above max   (hint: Math.min)
  //   - decrement takes 1 but never goes below min  (hint: Math.max)
  //   - reset sets count back to initial
  //   Use functional updates, e.g. setCount(c => Math.min(c + 1, max))
  throw new Error("TODO d04-2");
}
