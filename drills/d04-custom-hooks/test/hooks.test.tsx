import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useToggle } from "../src/useToggle";
import { useCounter } from "../src/useCounter";
import { useLocalStorage } from "../src/useLocalStorage";
import { FaqItem } from "../src/FaqItem";

describe("d04-1 useToggle", () => {
  test("1. starts at the initial value (false by default)", () => {
    expect(renderHook(() => useToggle()).result.current[0]).toBe(false);
    expect(renderHook(() => useToggle(true)).result.current[0]).toBe(true);
  });

  test("2. toggle() flips the value; two calls in one act() flip it back", () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current[1]());
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1]();
      result.current[1]();
    });
    expect(result.current[0]).toBe(true); // needs setValue(v => !v), not setValue(!value)
  });
});

describe("d04-2 useCounter", () => {
  test("3. increment and decrement change count by one", () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
    act(() => result.current.increment());
    act(() => result.current.increment());
    expect(result.current.count).toBe(7);
    act(() => result.current.decrement());
    expect(result.current.count).toBe(6);
  });

  test("4. count never goes above max or below min", () => {
    const { result } = renderHook(() => useCounter(1, { min: 0, max: 2 }));
    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.increment();
    });
    expect(result.current.count).toBe(2);
    act(() => {
      result.current.decrement();
      result.current.decrement();
      result.current.decrement();
    });
    expect(result.current.count).toBe(0);
  });

  test("5. reset() goes back to the initial value", () => {
    const { result } = renderHook(() => useCounter(3, { max: 10 }));
    act(() => result.current.increment());
    act(() => result.current.reset());
    expect(result.current.count).toBe(3);
  });
});

describe("d04-3 useLocalStorage", () => {
  beforeEach(() => localStorage.clear());

  test("6. uses initial when nothing is stored, otherwise reads the stored JSON", () => {
    expect(renderHook(() => useLocalStorage("theme", "light")).result.current[0]).toBe("light");

    localStorage.setItem("fav", JSON.stringify([1, 2]));
    expect(renderHook(() => useLocalStorage<number[]>("fav", [])).result.current[0]).toEqual([1, 2]);
  });

  test("7. the setter updates the value and saves it as JSON", () => {
    const { result } = renderHook(() => useLocalStorage("theme", "light"));
    act(() => result.current[1]("dark"));
    expect(result.current[0]).toBe("dark");
    expect(localStorage.getItem("theme")).toBe(JSON.stringify("dark"));
  });
});

describe("d04-4 FaqItem uses useToggle", () => {
  test("8. each FaqItem shows/hides its own answer (state is not shared)", async () => {
    const user = userEvent.setup();
    render(
      <>
        <FaqItem question="What is a Hook?" answer="A function starting with use." />
        <FaqItem question="Is state shared?" answer="No, each call has its own." />
      </>,
    );
    expect(screen.queryByText("A function starting with use.")).not.toBeInTheDocument();

    const [first, second] = screen.getAllByRole("button", { name: "Show answer" });
    await user.click(first);
    expect(screen.getByText("A function starting with use.")).toBeInTheDocument();
    expect(screen.queryByText("No, each call has its own.")).not.toBeInTheDocument();
    expect(second).toHaveTextContent("Show answer");

    await user.click(screen.getByRole("button", { name: "Hide answer" }));
    expect(screen.queryByText("A function starting with use.")).not.toBeInTheDocument();
  });
});
