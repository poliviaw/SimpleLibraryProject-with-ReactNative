import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, SafeAreaView, Text, View } from "react-native";
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { color } from "../../theme/color";

type Props = {
  onBack: () => void;
  onCapture: (uri: string) => void;
};

export default function CameraView({ onBack, onCapture }: Props) {
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice("back");
  const insets = useSafeAreaInsets();

  const { requestPermission } = useCameraPermission();

  const [isReady, setIsReady] = useState(false);
  const [taking, setTaking] = useState(false);

  // request permission
  useEffect(() => {
    (async () => {
      const granted = await requestPermission();
      if (!granted) {
        Alert.alert("Permission", "Izin kamera ditolak.");
        onBack();
      }
    })();
  }, [requestPermission, onBack]);

  const takePhoto = useCallback(async () => {
    if (!cameraRef.current || taking) return;

    try {
      setTaking(true);

      const photo = await cameraRef.current.takePhoto({
        flash: "off",
        enableShutterSound: true,
      });

      const uri = photo.path.startsWith("file://")
        ? photo.path
        : `file://${photo.path}`;

      // kirim hasil foto ke screen
      onCapture(uri);

    } catch (e) {
      Alert.alert("Error", "Gagal mengambil foto.");
    } finally {
      setTaking(false);
    }
  }, [taking, onCapture]);

  if (!device) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: color.bg, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: color.text }}>Kamera tidak ditemukan.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
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
          <Pressable onPress={onBack} style={{ padding: 10 }}>
            <Text style={{ color: "white", fontWeight: "900" }}>← Back</Text>
          </Pressable>

          <Text style={{ color: "white", fontWeight: "900", alignSelf: "center" }}>
            Take a Photo
          </Text>

          <View style={{ width: 60 }} />
        </View>

        {/* Capture button */}
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
