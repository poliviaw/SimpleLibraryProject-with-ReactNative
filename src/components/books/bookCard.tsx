import React from "react";
import { Pressable, Text, View } from "react-native";
import { Book } from "../../models/Books";
import { color } from "../../theme/color";

type Props = {
  book: Book;
  onPressTitle: () => void;
  onToggleStatus: () => void;
};

export default function BookCard({
  book,
  onPressTitle,
  onToggleStatus,
}: Props) {
  const isBorrowed = book.status === "borrowed";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderWidth: 2,
        borderColor: color.border,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.03)",
        columnGap: 12,
      }}
    >
      {/* Judul */}
      <View style={{ flex: 2 }}>
        <Pressable onPress={onPressTitle}>
          <Text style={{ color: color.text, fontWeight: "700" }} numberOfLines={1}>
            {book.title}
          </Text>
        </Pressable>
      </View>

      {/* Penulis */}
      <View style={{ flex: 1.5 }}>
        <Text style={{ color: color.muted }} numberOfLines={1}>
          {book.author}
        </Text>
      </View>

      {/* Status */}
      <View style={{ flex: 2, alignItems: "center" }}>
        <Pressable
          onPress={onToggleStatus}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 10,
            minWidth: 110,
            alignItems: "center",
            backgroundColor: isBorrowed
              ? "rgba(34,197,94,0.18)"
              : "rgba(79,124,255,0.14)",
            borderWidth: 1,
            borderColor: isBorrowed
              ? "rgba(34,197,94,0.40)"
              : "rgba(79,124,255,0.35)",
          }}
        >
          <Text style={{ color: color.text, fontWeight: "800", fontSize: 12 }}>
            {isBorrowed ? "Returned" : "Borrowed"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
