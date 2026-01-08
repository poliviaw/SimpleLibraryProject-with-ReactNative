import React from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBooks } from "../../hooks/useBook";
import { Book } from "../../models/book";
import { color } from "../../theme/color";
import * as BookService from "../../services/BookService";

function StatusBadge({
  status,
  onPress,
}: {
  status: Book["status"];
  onPress: () => void;
}) {
  const isBorrowed = status === "borrowed";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: isBorrowed ? "rgba(239,68,68,0.45)" : "rgba(34,197,94,0.45)",
        backgroundColor: isBorrowed ? "rgba(239,68,68,0.18)" : "rgba(34,197,94,0.18)",
        opacity: pressed ? 0.85 : 1,
        alignSelf: "flex-start",
      })}
    >
      <Text style={{ color: color.text, fontWeight: "800", fontSize: 12 }}>
        {isBorrowed ? "Dipinjam" : "Available"}
      </Text>
    </Pressable>
  );
}

function RowHeader() {
  return (
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
      <Text style={{ flex: 2, color: color.muted, fontWeight: "800"}}>Judul</Text>
      <Text style={{ flex: 2, color: color.muted, fontWeight: "800"}}>Penulis</Text>
      <Text style={{ flex: 2, color: color.muted, fontWeight: "800", textAlign: "center"}}>Status</Text>
      {/* <Text style={{ flex: 1, color: color.muted, fontWeight: "800"}}>Aksi</Text> */}
    </View>
  );
}

function BookRow({
  item,
  onReturned,
  onOpenMenu,
}: {
  item: Book;
  onToggleStatus: () => void;
  onReturned: () => void;
  onOpenMenu: () => void;
}) {
  const isBorrowed = item.status === "borrowed";

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
        columnGap: 15,
      }}
    >
      <View style={{ flex: 2 }}>
        <Pressable
          onPress={onOpenMenu}
          hitSlop={10}
          style={({ pressed }) => ({opacity: pressed ? 0.75 : 1 })}
        >
          <Text style={{color: color.text, fontWeight: "700" }} numberOfLines={1}>
            {item.title}
          </Text>
        </Pressable>
      </View>

      <View style={{ flex: 1.5 }}>
        <Text style={{color: color.muted }} numberOfLines={1}>
          {item.author}
        </Text>
      </View>


      <View style={{ flex: 2, alignItems: "center" }}>
        <Pressable
          onPress={onReturned}
          style={({ pressed }) => ({
            paddingHorizontal: 12,
            paddingVertical: 12,
            borderRadius: 10,
            backgroundColor: isBorrowed ? "rgba(34,197,94,0.18)" : "rgba(79,124,255,0.14)",
            borderWidth: 1,
            borderColor: isBorrowed ? "rgba(34,197,94,0.40)" : "rgba(79,124,255,0.35)",
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ color: color.text, fontWeight: "800", fontSize: 12 }}>
            {isBorrowed ? "Returned" : "Borrowed"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function BookScreen() {
  const { books, loading, setStatus, refresh } = useBooks();
  const navigation = useNavigation<any>();

  const openMenu = (book: Book) => {
    Alert.alert(
      "Pilih aksi",
      book.title,
      [
        {
          text: "Edit",
          onPress: () => navigation.navigate("BookForm", { bookId: book.id }),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Hapus buku?",
              `Yakin mau hapus "${book.title}"?`,
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                    await BookService.deleteBook(book.id);
                    await refresh();
                  },
                },
              ]
            );
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: color.bg, padding: 16, gap: 12 ,paddingTop:40}}>
      <Pressable
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: color.primary, fontWeight: "900" }}>← Back</Text>
      </Pressable>
      <Text style={{ color: color.text, fontSize: 22, fontWeight: "900" }}>
        Browse Books
      </Text>

      <RowHeader />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookRow
              item={item}
              onOpenMenu={() => openMenu(item)}
              onToggleStatus={() =>
                setStatus(item.id, item.status === "borrowed" ? "available" : "borrowed")
              }
              onReturned={() =>
                setStatus(item.id, item.status === "borrowed" ? "available" : "borrowed")
              }
            />
          )}
          ListEmptyComponent={
            <Text style={{ color: color.muted, marginTop: 10 }}>
              Belum ada buku yang terdaftar.
            </Text>
          }
        />
      )}
    </View>
  );
}
