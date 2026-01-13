import { Book, BookStatus } from "../../models/Books";
import { getJson, setJson } from "../../storage/db";

const KEY = "books:v1";

export async function listBooks(): Promise<Book[]> {
  return getJson<Book[]>(KEY, []);
}


export async function getBookById(id: string): Promise<Book | undefined> {
  const books = await listBooks();
  return books.find((b) => b.id === id);
}

export async function addBook(input: { title: string; author: string, coverPic?: string}): Promise<Book> {
  const books = await listBooks();
  const now = Date.now();

  const newBook: Book = {
    id: `b_${now}`, 
    title: input.title.trim(),
    author: input.author.trim(),
    status: "available",
    updatedAt: now,
    coverPic: input.coverPic,
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

export async function updateBookCover(id: string, coverPic?: string): Promise<void> {
  await updateBook(id, { coverPic });
}

export async function deleteBook(id: string): Promise<void> {
  const books = await listBooks();
  const next = books.filter((b) => b.id !== id);
  await setJson(KEY, next);
}
