import { useState } from "react";

export function useToggle(initial = false): [boolean, () => void] {
  const [value, setValue] = useState(initial);

  function toggle() {
    setValue((v) => !v);
  }

  return [value, toggle];
}
