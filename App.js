import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PlayerProvider } from "./PlayerContext";
import MusicPlayer from "./MusicPlayer";
import CameraControls from "./CameraControls";
import PlaylistManager from "./PlaylistManager"; 
import MouseControls from "./MouseControls";
import VoiceControls from "./VoiceControls";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PlayerProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="MusicPlayer"
            screenOptions={{
              headerStyle: { backgroundColor: "#111" },
              headerTintColor: "#fff",
            }}
          >
            <Stack.Screen
              name="MusicPlayer"
              component={MusicPlayer} // Must be a component, not an object
              options={{ title: "Music Player" }}
            />
            <Stack.Screen
              name="CameraControls"
              component={CameraControls} // Must be a component
              options={{ title: "Camera Controls" }}
            />
            <Stack.Screen
              name="PlaylistManager"
              component={PlaylistManager} // If you have a playlist manager
              options={{ title: "Playlist Manager" }}
            />
            <Stack.Screen
              name="MouseControls"
              component={MouseControls}
              options={{ title: "Mouse Controls" }}
            />
            <Stack.Screen
              name="VoiceControls"
              component={VoiceControls}
              options={{ title: "Voice Controls" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PlayerProvider>
    </GestureHandlerRootView>
  );
}
