import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigator/MainNavigator";
import CameraView from "../../components/Camera";

type Props = NativeStackScreenProps<RootStackParamList, "Camera">;

export default function CameraScreen({ navigation, route }: Props) {

  const onBack = () => {
    navigation.goBack();
  };

  const onCapture = (uri: string) => {
    // balik ke BookForm sambil kirim foto
    navigation.replace("BookForm", {
      bookId: route.params?.bookId,
      coverPic: uri,
    });
  };

  return (
    <CameraView
      onBack={onBack}
      onCapture={onCapture}
    />
  );
}
