import React from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBooks } from "../../hooks/useBook";
import { Book } from "../../models/Books";
import { color } from "../../theme/color";
import * as BookService from "../../services/BookService";

import BookList from "../../components/Books";

export default function BookScreen() {
  const { books, loading, setStatus, refresh } = useBooks();
  const navigation = useNavigation<any>();

  const openMenu = (book: Book) => {
    Alert.alert("Pilih aksi", book.title, [
      {
        text: "Edit",
        onPress: () => navigation.navigate("BookForm", { bookId: book.id }),
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Alert.alert("Hapus buku?", `Yakin mau hapus "${book.title}"?`, [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                await BookService.deleteBook(book.id);
                await refresh();
              },
            },
          ]);
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const toggleStatus = async (book: Book) => {
    const next = book.status === "borrowed" ? "available" : "borrowed";
    await setStatus(book.id, next);
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.bg, padding: 16, gap: 12, paddingTop: 40 }}>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={{ color: color.primary, fontWeight: "900" }}>← Back</Text>
      </Pressable>

      <Text style={{ color: color.text, fontSize: 22, fontWeight: "900" }}>
        Browse Books
      </Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <BookList
          books={books}
          onPressBook={(book) => openMenu(book)}       // tap -> menu edit/delete
          onToggleStatus={(book) => toggleStatus(book)} 
        />
      )}
    </View>
  );
}
