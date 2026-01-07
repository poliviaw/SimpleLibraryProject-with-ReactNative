import React from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBooks } from "../../hooks/useBook";
import { Book } from "../../models/book";
import { color } from "../../theme/color";

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
      }}
    >
      <Text style={{ flex: 2, color: color.muted, fontWeight: "800"}}>Judul</Text>
      <Text style={{ flex: 2, color: color.muted, fontWeight: "800"}}>Penulis</Text>
      <Text style={{ flex: 2, color: color.muted, fontWeight: "800"}}>Status</Text>
      <Text style={{ flex: 1, color: color.muted, fontWeight: "800"}}>Edit</Text>
    </View>
  );
}

function BookRow({
  item,
  onToggleStatus,
  onReturned,
}: {
  item: Book;
  onToggleStatus: () => void;
  onReturned: () => void;
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
      }}
    >
      <Text style={{ flex: 2, color: color.text, fontWeight: "700" }} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={{ flex: 2, color: color.muted }} numberOfLines={1}>
        {item.author}
      </Text>

      <View style={{ flex: 2, alignItems: "center" }}>
        <StatusBadge status={item.status} onPress={onToggleStatus} />
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
  const { books, loading, setStatus } = useBooks();
  const navigation = useNavigation();

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
          contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
          renderItem={({ item }) => (
            <BookRow
              item={item}
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
