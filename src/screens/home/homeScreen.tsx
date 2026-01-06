import React from "react";
import { SafeAreaView, ScrollView, Text, View, Pressable } from "react-native";
import { color } from "../../theme/color";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View style={{ gap: 12 }}>
          <Text style={{ color: color.card, fontSize: 30, fontWeight: "900" ,paddingTop: 30}}>
            Library Project
          </Text>
          <Text style={{ color: color.muted, lineHeight: 20 }}>
            Aplikasi sederhana untuk menyimpan dan mengelola koleksi buku.
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 16,
              backgroundColor: color.card,
              borderWidth: 1,
              borderColor: color.border,
            }}
          >
            <Text style={{ color: color.muted, fontSize: 12 }}>Total Books</Text>
            <Text style={{ color: color.text, fontSize: 20, fontWeight: "900" }}>
              0
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              padding: 14,
              borderRadius: 16,
              backgroundColor: color.card,
              borderWidth: 1,
              borderColor: color.border,
            }}
          >
            <Text style={{ color: color.muted, fontSize: 12 }}>Borrowed</Text>
            <Text style={{ color: color.text, fontSize: 20, fontWeight: "900" }}>
              -
            </Text>
          </View>
        </View>

        

        <Pressable
          style={{
            padding: 16,
            borderRadius: 18,
            backgroundColor: color.card,
            borderWidth: 1,
            borderColor: color.border,
          }}
        >
          <Text style={{ color: color.text, fontWeight: "900", fontSize: 18 }}>
            Browse Books
          </Text>
          <Text style={{ color: color.muted, marginTop: 6 }}>
            Lihat semua buku yang tersimpan.
          </Text>
          <Text style={{ color: color.primary, marginTop: 10, fontWeight: "700" }}>
            Open → 
          </Text>
        </Pressable>

        <Pressable
          style={{
            padding: 16,
            borderRadius: 18,
            backgroundColor: color.card,
            borderWidth: 1,
            borderColor: color.border,
          }}
        >
          <Text style={{ color: color.text, fontWeight: "900", fontSize: 18 }}>
            Add New Book
          </Text>
          <Text style={{ color: color.muted, marginTop: 6 }}>
            Tambahkan judul dan penulis buku.
          </Text>
          <Text style={{ color: color.primary, marginTop: 10, fontWeight: "700" }}>
            Create → 
          </Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}
