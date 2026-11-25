import {
  addEvent,
  bookSeat,
  capacityOf,
  firstTwo,
  getField,
  organiserEmail,
  publicUser,
  removeEvent,
  renameEvent,
  summary,
} from "../src/events.js";

function makeEvent() {
  return { id: 1, title: "Hack Night", date: "2026-12-01", capacity: 50, booked: 10 };
}

describe("j02 objects and arrays", () => {
  test("1. bookSeat returns a NEW event with booked + 1 and leaves the original alone", () => {
    const event = makeEvent();
    const before = structuredClone(event);
    const result = bookSeat(event);
    expect(result.booked).toBe(11);
    expect(result).toEqual({ ...before, booked: 11 }); // everything else is copied across
    expect(event).toEqual(before); // the input is unchanged
    expect(result).not.toBe(event); // a new object (React needs this to re-render)
  });

  test("2. renameEvent returns a NEW event with the new title", () => {
    const event = makeEvent();
    const before = structuredClone(event);
    const result = renameEvent(event, "Code Club");
    expect(result).toEqual({ ...before, title: "Code Club" });
    expect(event).toEqual(before);
    expect(result).not.toBe(event);
  });

  test("3. addEvent returns a NEW array with the event on the end", () => {
    const list = [makeEvent()];
    const before = structuredClone(list);
    const extra = { id: 2, title: "Quiz", date: "2026-12-02", capacity: 20, booked: 0 };
    const result = addEvent(list, extra);
    expect(result).toHaveLength(2);
    expect(result[1]).toEqual(extra);
    expect(list).toEqual(before); // push would have changed this
    expect(result).not.toBe(list);
  });

  test("4. removeEvent returns a NEW array without that id", () => {
    const list = [makeEvent(), { id: 2, title: "Quiz", date: "2026-12-02", capacity: 20, booked: 0 }];
    const before = structuredClone(list);
    const result = removeEvent(list, 1);
    expect(result.map((e) => e.id)).toEqual([2]);
    expect(list).toEqual(before); // splice would have changed this
    expect(result).not.toBe(list);
    expect(removeEvent(list, 99)).toHaveLength(2); // unknown id: nothing removed
  });

  test("5. summary destructures its parameter and uses a template literal", () => {
    expect(summary({ title: "Hack Night", date: "2026-12-01", venue: "Room 4" })).toBe(
      "Hack Night on 2026-12-01 at Room 4",
    );
    expect(summary({ title: "Quiz", date: "2026-12-02" })).toBe("Quiz on 2026-12-02 at TBC"); // default
  });

  test("6. organiserEmail uses ?. so a missing organiser doesn't crash", () => {
    expect(organiserEmail({ organiser: { email: "sam@uni.ac.uk" } })).toBe("sam@uni.ac.uk");
    expect(organiserEmail({})).toBe("no contact"); // no organiser at all
    expect(organiserEmail({ organiser: {} })).toBe("no contact"); // organiser but no email
  });

  test("7. capacityOf uses ?? so 0 stays 0", () => {
    expect(capacityOf({ capacity: 50 })).toBe(50);
    expect(capacityOf({})).toBe(100); // missing -> fallback
    expect(capacityOf({ capacity: null })).toBe(100); // null -> fallback
    expect(capacityOf({ capacity: 0 })).toBe(0); // 0 is a real value; || would wrongly give 100
  });

  test("8. publicUser drops the password and doesn't touch the original", () => {
    const user = { id: 7, name: "Sam", email: "sam@uni.ac.uk", password: "hunter2" };
    const before = structuredClone(user);
    const result = publicUser(user);
    expect(result).toEqual({ id: 7, name: "Sam", email: "sam@uni.ac.uk" });
    expect("password" in result).toBe(false);
    expect(user).toEqual(before);
    expect(result).not.toBe(user);
  });

  test("9. firstTwo destructures an array", () => {
    expect(firstTwo(["a", "b", "c"])).toEqual({ first: "a", second: "b" });
    expect(firstTwo(["only"])).toEqual({ first: "only", second: undefined });
  });

  test("10. getField reads a property by a name held in a variable", () => {
    const event = makeEvent();
    expect(getField(event, "title")).toBe("Hack Night");
    expect(getField(event, "capacity")).toBe(50);
    expect(getField(event, "nope")).toBeUndefined();
  });
});
