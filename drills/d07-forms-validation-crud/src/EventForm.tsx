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
    e.preventDefault(); // stop the browser reloading the page
    const found = validateEvent(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return; // invalid: don't submit

    await onCreate({
      name: values.name.trim(),
      location: values.location.trim(),
      maxAttendees: Number(values.maxAttendees),
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="name">Event name</label>
      <input id="name" name="name" value={values.name} onChange={handleChange} />
      {errors.name && <p role="alert">{errors.name}</p>}

      <label htmlFor="location">Location</label>
      <input id="location" name="location" value={values.location} onChange={handleChange} />
      {errors.location && <p role="alert">{errors.location}</p>}

      <label htmlFor="maxAttendees">Maximum attendees</label>
      <input
        id="maxAttendees"
        name="maxAttendees"
        type="number"
        value={values.maxAttendees}
        onChange={handleChange}
      />
      {errors.maxAttendees && <p role="alert">{errors.maxAttendees}</p>}

      <button type="submit">Create event</button>
    </form>
  );
}
