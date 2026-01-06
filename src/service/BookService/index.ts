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

export async function updateBookStatus(id: string, status: BookStatus): Promise<void> {
  const books = await listBooks();
  const next = books.map((b) =>
    b.id === id ? { ...b, status, updatedAt: Date.now() } : b
  );
  await setJson(KEY, next);
}
