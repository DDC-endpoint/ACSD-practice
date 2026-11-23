// What the form holds. Inputs give you strings, so maxAttendees may still be "50".
export interface EventFormValues {
  name: string;
  location: string;
  maxAttendees: string | number;
}

// What we send to the server (POST / PUT body): maxAttendees is a real number now.
export interface EventDto {
  name: string;
  location: string;
  maxAttendees: number;
}

// What the server sends back: the DTO plus the id the server assigned.
export interface EventRecord extends EventDto {
  id: number;
}
