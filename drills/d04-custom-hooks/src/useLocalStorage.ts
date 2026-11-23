import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initial: T): [T, (value: T) => void] {
  // TODO d04-3: like useState, but the value survives a page reload.
  //   - useState with a LAZY initialiser: useState<T>(() => { ... })
  //       read localStorage.getItem(key); if it's not null return JSON.parse(stored) as T,
  //       otherwise return initial
  //   - useEffect that runs when [key, value] change and saves:
  //       localStorage.setItem(key, JSON.stringify(value))
  //   - return [value, setValue]
  throw new Error("TODO d04-3");
}
