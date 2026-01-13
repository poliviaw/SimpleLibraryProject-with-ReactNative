
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../../screens/HomeScreen";
import BookScreen from "../../screens/BookScreen";
import BookForm from "../../screens/BookScreen/form";
import CameraScreen from "../../screens/CameraScreen";

export type RootStackParamList = {
  Home: undefined;
  Books: undefined;
  BookForm: { bookId?: string; coverPic?: string} | undefined;
  Camera: { returnTo: "BookForm"; bookId?: string }
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Books" component={BookScreen} />
        <Stack.Screen name="BookForm" component={BookForm} />
        <Stack.Screen name="Camera" component={CameraScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
