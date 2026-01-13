// Nambah + hapus buku + edit buku
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
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
  const [coverPic, setCoverPic] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Kalau nanti CameraScreen ngirim balik cover via params: { coverPic: "file://..." }
  useEffect(() => {
    const uri = route.params?.coverPic;
    if (uri) setCoverPic(uri);
  }, [route.params]);

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
      setCoverPic(book.coverPic); 
    })();

    return () => {
      mounted = false;
    };
  }, [bookId]);

  const onPickCover = () => {
     navigation.navigate("Camera", { returnTo: "BookForm", bookId });
  };

  const onRemoveCover = () => {
    setCoverPic(undefined);
  };

  const onSave = async () => {
    const t = title.trim();
    const a = author.trim();

    if (!t) return Alert.alert("Validation", "Judul buku wajib diisi.");
    if (!a) return Alert.alert("Validation", "Penulis wajib diisi.");

    try {
      setLoading(true);

      if (isEdit && bookId) {
        await bookService.updateBook(bookId, {
          title: t,
          author: a,
          coverPic, // ✅ update cover juga
        });
      } else {
        await bookService.addBook({
          title: t,
          author: a,
          coverPic: coverPic ?? "",
        });
      }

      setLoading(false);
      navigation.navigate("Books");
    } catch (e) {
      setLoading(false);
      Alert.alert("Error", "Gagal menyimpan buku");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.bg }}>
      <View style={{ padding: 16, gap: 14, paddingTop: 50 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={{ color: color.primary, fontWeight: "900" }}>← Back</Text>
          </Pressable>

          <Text style={{ color: color.text, fontSize: 18, fontWeight: "900" }}>
            {isEdit ? "Edit Book" : "Add New Book"}
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
          {/* ✅ Cover Section */}
          <View style={{ gap: 8 }}>
            <Text style={{ color: color.muted, fontWeight: "800" }}>Cover</Text>

            {coverPic ? (
              <View style={{ gap: 10 }}>
                <Image
                  source={{ uri: coverPic }}
                  style={{
                    width: "100%",
                    height: 160,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: color.border,
                    backgroundColor: "rgba(255,255,255,0.06)",
                  }}
                  resizeMode="cover"
                />

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Pressable
                    onPress={onPickCover}
                    style={({ pressed }) => ({
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: color.border,
                      backgroundColor: "rgba(255,255,255,0.06)",
                      opacity: pressed ? 0.85 : 1,
                      alignItems: "center",
                    })}
                  >
                    <Text style={{ color: color.text, fontWeight: "900" }}>
                      Retake
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={onRemoveCover}
                    style={({ pressed }) => ({
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: "rgba(239,68,68,0.55)",
                      backgroundColor: "rgba(239,68,68,0.15)",
                      opacity: pressed ? 0.85 : 1,
                      alignItems: "center",
                    })}
                  >
                    <Text style={{ color: color.text, fontWeight: "900" }}>
                      Remove
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                onPress={onPickCover}
                style={({ pressed }) => ({
                  paddingVertical: 12,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: color.border,
                  backgroundColor: "rgba(255,255,255,0.06)",
                  opacity: pressed ? 0.85 : 1,
                  alignItems: "center",
                })}
              >
                <Text style={{ color: color.text, fontWeight: "900" }}>
                  Add Cover Photo
                </Text>
                <Text style={{ color: color.muted, marginTop: 4 }}>
                  (Nanti buka kamera)
                </Text>
              </Pressable>
            )}
          </View>

          {/* Title */}
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

          {/* Author */}
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

          {/* Save */}
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
            <Text style={{ color: color.card, fontWeight: "900" }}>
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Create Book"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
