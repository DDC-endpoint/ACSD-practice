import { Profiler } from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useThemeStore } from "../src/useThemeStore";
import { selectItemCount, useCartStore } from "../src/useCartStore";
import { ThemeToggle } from "../src/ThemeToggle";
import { CartBadge } from "../src/CartBadge";

// Zustand stores are module-level singletons, so state would leak between tests.
// Save the starting state once and put it back (replace = true) before every test.
const initialTheme = useThemeStore.getState();
const initialCart = useCartStore.getState();

beforeEach(() => {
  useThemeStore.setState(initialTheme, true);
  useCartStore.setState(initialCart, true);
});

const kettle = { id: 1, name: "Kettle", price: 20 };
const toaster = { id: 2, name: "Toaster", price: 30 };

test("1. toggleTheme flips light <-> dark, setTheme sets a value", () => {
  expect(useThemeStore.getState().theme).toBe("light");

  useThemeStore.getState().toggleTheme();
  expect(useThemeStore.getState().theme).toBe("dark");

  useThemeStore.getState().toggleTheme();
  expect(useThemeStore.getState().theme).toBe("light");

  useThemeStore.getState().setTheme("dark");
  expect(useThemeStore.getState().theme).toBe("dark");
});

test("2. clicking ThemeToggle updates every component that reads the theme (no Provider)", async () => {
  const user = userEvent.setup();
  render(
    <>
      <ThemeToggle />
      <ThemeToggle />
    </>,
  );

  expect(screen.getAllByRole("button", { name: "Theme: light" })).toHaveLength(2);

  await user.click(screen.getAllByRole("button")[0]);

  expect(screen.getAllByRole("button", { name: "Theme: dark" })).toHaveLength(2);
  expect(useThemeStore.getState().theme).toBe("dark");
});

test("3. ThemeToggle re-renders when the store changes from outside", () => {
  render(<ThemeToggle />);

  act(() => useThemeStore.getState().setTheme("dark"));

  expect(screen.getByRole("button")).toHaveTextContent("Theme: dark");
});

test("4. selector: ThemeToggle does NOT re-render when an unrelated slice (menuOpen) changes", () => {
  const onRender = vi.fn();
  render(
    <Profiler id="toggle" onRender={onRender}>
      <ThemeToggle />
    </Profiler>,
  );
  const rendersAfterMount = onRender.mock.calls.length;

  // Change a different slice of the same store. A component using
  // useThemeStore() with no selector would re-render here.
  act(() => useThemeStore.setState({ menuOpen: true }));
  expect(onRender.mock.calls.length).toBe(rendersAfterMount);

  // Changing the slice it DOES select re-renders it.
  act(() => useThemeStore.getState().toggleTheme());
  expect(onRender.mock.calls.length).toBe(rendersAfterMount + 1);
  expect(screen.getByRole("button")).toHaveTextContent("Theme: dark");
});

test("5. addItem adds a new item with quantity 1, and bumps the quantity of an existing one", () => {
  const { addItem } = useCartStore.getState();

  addItem(kettle);
  expect(useCartStore.getState().items).toEqual([{ ...kettle, quantity: 1 }]);

  addItem(kettle);
  addItem(toaster);
  expect(useCartStore.getState().items).toEqual([
    { ...kettle, quantity: 2 },
    { ...toaster, quantity: 1 },
  ]);
});

test("6. removeItem removes by id, clear empties the cart", () => {
  const { addItem, removeItem, clear } = useCartStore.getState();
  addItem(kettle);
  addItem(toaster);

  removeItem(1);
  expect(useCartStore.getState().items).toEqual([{ ...toaster, quantity: 1 }]);

  addItem(kettle);
  clear();
  expect(useCartStore.getState().items).toEqual([]);
});

test("7. selectItemCount adds up quantities, and CartBadge shows it live", () => {
  render(<CartBadge />);
  const badge = screen.getByLabelText("Items in cart");
  expect(badge).toHaveTextContent("0");

  act(() => {
    useCartStore.getState().addItem(kettle);
    useCartStore.getState().addItem(kettle);
    useCartStore.getState().addItem(toaster);
  });

  expect(selectItemCount(useCartStore.getState())).toBe(3);
  expect(badge).toHaveTextContent("3");
});
