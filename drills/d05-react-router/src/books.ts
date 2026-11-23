// Given: the data for the library app. Not the skill being drilled.
export interface Book {
  id: number;
  title: string;
  author: string;
}

export const BOOKS: Book[] = [
  { id: 1, title: "Dune", author: "Frank Herbert" },
  { id: 2, title: "Emma", author: "Jane Austen" },
  { id: 3, title: "Persuasion", author: "Jane Austen" },
  { id: 4, title: "Ivanhoe", author: "Walter Scott" },
];
