export type BookStatus = "available" | "borrowed";

export type Book = {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  updatedAt: number;
};
