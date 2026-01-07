import { Book, BookStatus } from "../../models/book";
import { getJson, setJson } from "../../storage/storage";

const KEY = "books:v1";

export async function listBooks(): Promise<Book[]> {
  return getJson<Book[]>(KEY, []);
}

export async function seedIfEmpty(): Promise<void> {
  const existing = await listBooks();
  if (existing.length > 0) return;

  const now = Date.now();
  const sample: Book[] = [
    { id: "b1", title: "Atomic Habits", author: "James Clear", status: "available", updatedAt: now },
    { id: "b2", title: "Clean Code", author: "Robert C. Martin", status: "borrowed", updatedAt: now },
    { id: "b3", title: "Deep Work", author: "Cal Newport", status: "available", updatedAt: now },
  ];
  await setJson(KEY, sample);
}


export async function getBookById(id: string): Promise<Book | undefined> {
  const books = await listBooks();
  return books.find((b) => b.id === id);
}

export async function addBook(input: { title: string; author: string }): Promise<Book> {
  const books = await listBooks();
  const now = Date.now();

  const newBook: Book = {
    id: `b_${now}`, // id sederhana
    title: input.title.trim(),
    author: input.author.trim(),
    status: "available",
    updatedAt: now,
  };

  await setJson(KEY, [newBook, ...books]);
  return newBook;
}

export async function updateBook(id: string, patch: Partial<Omit<Book, "id">>): Promise<void> {
  const books = await listBooks();
  const next = books.map((b) =>
    b.id === id ? { ...b, ...patch, updatedAt: Date.now() } : b
  );
  await setJson(KEY, next);
}

export async function updateBookStatus(id: string, status: BookStatus): Promise<void> {
  await updateBook(id, { status });
}
