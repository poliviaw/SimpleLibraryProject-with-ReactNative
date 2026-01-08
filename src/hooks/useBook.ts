import { useCallback, useEffect, useState } from "react";
import { Book, BookStatus } from "../models/Books";
import * as bookService from "../services/BookService";

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await bookService.listBooks();
    setBooks(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setStatus = useCallback(async (id: string, status: BookStatus) => {
    await bookService.updateBookStatus(id, status);
    await refresh();
  }, [refresh]);

  return { books, loading, refresh, setStatus };
}
