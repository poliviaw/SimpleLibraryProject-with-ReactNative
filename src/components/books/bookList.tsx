import React from "react";
import { FlatList, Text, View } from "react-native";
import { Book } from "../../models/Books";
import { color } from "../../theme/color";
import BookCard from "../Books/bookCard";

type Props = {
  books: Book[];
  onPressBook: (book: Book) => void;
  onToggleStatus: (book: Book) => void;
};

export default function BookList({
  books,
  onPressBook,
  onToggleStatus,
}: Props) {
  return (
    <View style={{ gap: 10 }}>
      <View
        style={{
          flexDirection: "row",
          paddingVertical: 10,
          paddingHorizontal: 18,
          borderWidth: 1,
          borderColor: color.border,
          borderRadius: 12,
          backgroundColor: color.card,
          columnGap: 12,
        }}
      >
        <Text style={{ flex: 2, fontWeight: "800", color: color.muted }}>Judul</Text>
        <Text style={{ flex: 2, fontWeight: "800", color: color.muted }}>Penulis</Text>
        <Text
          style={{
            flex: 2,
            fontWeight: "800",
            color: color.muted,
            textAlign: "center",
          }}
        >
          Status
        </Text>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => (
          <BookCard
            book={item}
            onPressTitle={() => onPressBook(item)}
            onToggleStatus={() => onToggleStatus(item)}
          />
        )}
        ListEmptyComponent={
          <Text style={{ color: color.muted, marginTop: 10 }}>
            Belum ada buku yang terdaftar
          </Text>
        }
      />
    </View>
  );
}
