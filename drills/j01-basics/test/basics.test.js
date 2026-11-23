import {
  addBooking,
  countOpen,
  describeValue,
  forgetfulTitle,
  isBlank,
  openText,
  sameId,
  seatsLeft,
  statusLabel,
  titlesOf,
} from "../src/basics.js";

function makeEvent(overrides) {
  return { id: 3, title: "Hack Night", capacity: 40, booked: 10, category: "tech", isOpen: true, ...overrides };
}

describe("j01 basics", () => {
  test("1. seatsLeft is capacity minus booked, and a function with no return gives undefined", () => {
    expect(seatsLeft(makeEvent({ capacity: 40, booked: 10 }))).toBe(30);
    expect(seatsLeft(makeEvent({ capacity: 5, booked: 5 }))).toBe(0);
    expect(forgetfulTitle(makeEvent())).toBeUndefined(); // GIVEN: no return line
  });

  test("2. sameId uses === : the number 3 and the text \"3\" are different", () => {
    expect(sameId(3, 3)).toBe(true);
    expect(sameId("3", "3")).toBe(true);
    expect(sameId("3", 3)).toBe(false); // "3" == 3 would be true; === is false
    expect(sameId(3, 4)).toBe(false);
  });

  test("3. isBlank: missing, empty and spaces-only text are blank", () => {
    expect(isBlank("")).toBe(true);
    expect(isBlank("   ")).toBe(true);
    expect(isBlank(undefined)).toBe(true);
    expect(isBlank(null)).toBe(true);
    expect(isBlank("Hack Night")).toBe(false);
    expect(isBlank("0")).toBe(false); // the text "0" is truthy: it has a character in it
  });

  test("4. statusLabel: Full / Almost full / Open", () => {
    expect(statusLabel(makeEvent({ capacity: 20, booked: 20 }))).toBe("Full");
    expect(statusLabel(makeEvent({ capacity: 20, booked: 15 }))).toBe("Almost full"); // 5 left
    expect(statusLabel(makeEvent({ capacity: 20, booked: 19 }))).toBe("Almost full"); // 1 left
    expect(statusLabel(makeEvent({ capacity: 20, booked: 14 }))).toBe("Open"); // 6 left
  });

  test("5. openText uses the ternary", () => {
    expect(openText(makeEvent({ isOpen: true }))).toBe("Open for booking");
    expect(openText(makeEvent({ isOpen: false }))).toBe("Closed");
  });

  test("6. describeValue names the type, with null and arrays handled", () => {
    expect(describeValue("hi")).toBe("string");
    expect(describeValue(42)).toBe("number");
    expect(describeValue(true)).toBe("boolean");
    expect(describeValue(undefined)).toBe("undefined");
    expect(describeValue({ id: 1 })).toBe("object");
    expect(describeValue(null)).toBe("null"); // typeof null is "object": the quirk
    expect(describeValue([1, 2])).toBe("array"); // typeof [] is "object" too
  });

  test("7. countOpen counts the open events with for...of", () => {
    const events = [makeEvent({ isOpen: true }), makeEvent({ isOpen: false }), makeEvent({ isOpen: true })];
    expect(countOpen(events)).toBe(2);
    expect(countOpen([])).toBe(0);
  });

  test("8. titlesOf builds a new array of titles with a for loop", () => {
    const events = [makeEvent({ title: "Hack Night" }), makeEvent({ title: "Careers Fair" })];
    expect(titlesOf(events)).toEqual(["Hack Night", "Careers Fair"]);
    expect(titlesOf([])).toEqual([]);
  });

  test("9. addBooking changes the same object (const allows that) or refuses", () => {
    const event = makeEvent({ capacity: 10, booked: 6 });
    expect(addBooking(event, 3)).toBe(9);
    expect(event.booked).toBe(9); // the object itself changed
    expect(addBooking(event, 2)).toBe(-1); // only 1 seat left
    expect(event.booked).toBe(9); // unchanged
    expect(addBooking(event, 1)).toBe(10);
  });
});
