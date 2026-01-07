// Nambah + hapus buku + edit buku
import React, { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, SafeAreaView, Text, TextInput, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigator/MainNavigator";
import { color } from "../../theme/color";
import * as bookService from "../../services/BookService";

type Props = NativeStackScreenProps<RootStackParamList, "BookForm">;

export default function BookForm({ navigation, route }: Props) {
  const bookId = route.params?.bookId;

  const isEdit = useMemo(() => !!bookId, [bookId]);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  // load data kalau edit
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!bookId) return;
      const book = await bookService.getBookById(bookId);
      if (!book) return;
      if (!mounted) return;
      setTitle(book.title);
      setAuthor(book.author);
    })();
    return () => {
      mounted = false;
    };
  }, [bookId]);

  const onSave = async () => {
    const t = title.trim();
    const a = author.trim();

    if (!t) return Alert.alert("Validation", "Judul buku wajib diisi.");
    if (!a) return Alert.alert("Validation", "Penulis wajib diisi.");

    try {
      setLoading(true);
      if (isEdit && bookId) {
        await bookService.updateBook(bookId, { title: t, author: a });
      } else {
        await bookService.addBook({ title: t, author: a });
      }
      setLoading(false);

      // balik ke list
      navigation.navigate("Books");
    } catch (e) {
      setLoading(false);
      Alert.alert("Error", "Gagal menyimpan buku");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.bg }}>
      <View style={{ padding: 16, gap: 14 ,paddingTop: 50}}>
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Pressable
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: color.primary, fontWeight: "900" }}>← Back</Text>
          </Pressable>

          <Text style={{ color: color.text, fontSize: 18, fontWeight: "900" }}>
            Add New Book
          </Text>

          <View style={{ width: 50 }} />
        </View>

        {/* Card */}
        <View
          style={{
            padding: 16,
            borderRadius: 18,
            backgroundColor: color.card,
            borderWidth: 1,
            borderColor: color.border,
            gap: 12,
          }}
        >
          <View style={{ gap: 6 }}>
            <Text style={{ color: color.muted, fontWeight: "800" }}>Judul</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Contoh: Clean Code"
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: color.border,
                color: color.text,
              }}
            />
          </View>

          <View style={{ gap: 6 }}>
            <Text style={{ color: color.muted, fontWeight: "800" }}>Penulis</Text>
            <TextInput
              value={author}
              onChangeText={setAuthor}
              placeholder="Contoh: Robert C. Martin"
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={{
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: color.border,
                color: color.text,
              }}
            />
          </View>

          <Pressable
            onPress={onSave}
            disabled={loading}
            style={({ pressed }) => ({
              marginTop: 6,
              paddingVertical: 12,
              borderRadius: 14,
              backgroundColor: color.primary,
              opacity: loading ? 0.6 : pressed ? 0.85 : 1,
              alignItems: "center",
            })}
          >
            <Text style={{ color: color.card , fontWeight: "900" }}>
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Book"}
            </Text>
          </Pressable>
        </View>


      </View>
    </SafeAreaView>
  );
}
