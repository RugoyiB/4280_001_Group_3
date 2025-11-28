import React, { useEffect, useContext } from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AuthProvider, AuthContext } from "./AuthContext";
import { PlayerProvider, PlayerContext } from "./PlayerContext";

import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import MusicPlayer from "./MusicPlayer";
import CameraControls from "./CameraControls";
import PlaylistManager from "./PlaylistManager";
import MouseControls from "./MouseControls";
import VoiceControls from "./VoiceControls";
import TouchControls from "./TouchControls";


const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user, loading } = useContext(AuthContext);
  const { loadUserTracks } = useContext(PlayerContext);

  useEffect(() => {
    if (user) loadUserTracks();
  }, [user]);

  if (loading) {
    return (
      <Text style={{ color: "#fff", textAlign: "center", marginTop: 50 }}>
        Loading...
      </Text>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={user ? "MusicPlayer" : "Login"}
      screenOptions={{
        headerStyle: { backgroundColor: "#111" },
        headerTintColor: "#fff",
      }}
    >
      {user ? (
        <>
          <Stack.Screen
            name="MusicPlayer"
            component={MusicPlayer}
            options={{ title: "Music Player" }}
          />
          <Stack.Screen
            name="CameraControls"
            component={CameraControls}
            options={{ title: "Camera Controls" }}
          />
          <Stack.Screen
            name="PlaylistManager"
            component={PlaylistManager}
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
          <Stack.Screen 
          name="TouchControls" 
          component={TouchControls} 
          options={{ title: "Touch Controls" }} 
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ title: "Login" }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: "Register" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <PlayerProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </PlayerProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
