import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, SafeAreaView, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../../navigator/MainNavigator";

import { color } from "../../theme/color";

type Props = NativeStackScreenProps<RootStackParamList, "Camera">;

export default function CameraScreen({ navigation, route }: Props) {
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice("back");
  const insets = useSafeAreaInsets();

  const { hasPermission, requestPermission } = useCameraPermission();

  const [isReady, setIsReady] = useState(false);
  const [taking, setTaking] = useState(false);

  useEffect(() => {
    (async () => {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert("Permission", "Izin kamera ditolak. Tidak bisa membuka kamera.");
        navigation.goBack();
      }
    })();
  }, [hasPermission, requestPermission, navigation]);

  const takePhoto = useCallback(async () => {
    if (!cameraRef.current || taking) return;

    try {
      setTaking(true);

      const photo = await cameraRef.current.takePhoto({
        flash: "off",
        enableShutterSound: true,
      });

      const uri = photo.path.startsWith("file://") ? photo.path : `file://${photo.path}`;

      // balik ke BookForm, kirim coverPic
      navigation.navigate("BookForm", {
        bookId: route.params?.bookId,
        coverPic: uri,
      });
    } catch (e) {
      Alert.alert("Error", "Gagal mengambil foto.");
    } finally {
      setTaking(false);
    }
  }, [navigation, route.params?.bookId, taking]);

  if (!device) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: color.bg, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: color.text }}>Kamera tidak ditemukan.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      {/* Preview */}
      <View style={{ flex: 1 }}>
        <Camera
          ref={cameraRef}
          style={{ flex: 1 }}
          device={device}
          isActive={true}
          photo={true}
          onInitialized={() => setIsReady(true)}
        />

        {/* Top bar */}
        <View style={{ position: "absolute", top: 16, left: 16, right: 16, flexDirection: "row", justifyContent: "space-between" }}>
          <Pressable onPress={() => navigation.goBack()} style={{ padding: 10 }}>
            <Text style={{ color: "white", fontWeight: "900" }}>← Back</Text>
          </Pressable>

          <Text style={{ color: "white", fontWeight: "900", alignSelf: "center" }}>
            Take a Photo
          </Text>

          <View style={{ width: 60 }} />
        </View>

        {/* Bottom button */}
        <View
          style={{
            position: "absolute",
            bottom: insets.bottom + 40,
            left: 0,
            right: 0,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable
            disabled={!isReady || taking}
            onPress={takePhoto}
            style={({ pressed }) => ({
              width: 74,
              height: 74,
              borderRadius: 37,
              borderWidth: 6,
              borderColor: "white",
              backgroundColor: pressed ? "rgba(0,255,255,5)" : "rgba(0,255,255,0.5)",
              opacity: !isReady || taking ? 0.5 : 1,
            })}
          />
          <Text style={{ color: "white", marginTop: 10, opacity: 0.9 }}>
            Tap to capture
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
