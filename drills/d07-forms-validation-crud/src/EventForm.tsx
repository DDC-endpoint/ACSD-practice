import { useState, type ChangeEvent, type FormEvent } from "react";
import { validateEvent, type EventErrors } from "./validateEvent";
import type { EventDto, EventFormValues } from "./types/Event";

interface EventFormProps {
  onCreate: (data: EventDto) => void | Promise<void>;
}

export function EventForm({ onCreate }: EventFormProps) {
  const [values, setValues] = useState<EventFormValues>({ name: "", location: "", maxAttendees: "" });
  const [errors, setErrors] = useState<EventErrors>({});

  // One handler for every input: the input's name attribute says which field changed.
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    // TODO d07-5 (part 1): stop the page reload, validate `values`, store the errors
    //   with setErrors, and return early if there are any.
    //   Only when valid: await onCreate({ name, location, maxAttendees }) with the
    //   text trimmed and maxAttendees turned into a number.
  }

  // TODO d07-5 (part 2): replace the placeholder with a <form onSubmit={handleSubmit} noValidate>
  //   holding three CONTROLLED inputs (value={values.x} onChange={handleChange}, plus a name
  //   attribute that matches the field). Labels (the tests look for these exact texts):
  //     "Event name" (id/name "name"), "Location" (id/name "location"),
  //     "Maximum attendees" (id/name "maxAttendees", type="number").
  //   Under each input: {errors.x && <p role="alert">{errors.x}</p>}
  //   And a <button type="submit">Create event</button>.
  return <p>TODO d07-5</p>;
}
