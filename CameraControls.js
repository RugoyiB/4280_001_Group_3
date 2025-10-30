import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { PlayerContext } from "./PlayerContext";

export default function CameraControls({ navigation }) {
  const {
    tracks,
    trackIndex,
    isPlaying,
    nextTrack,
    prevTrack,
    togglePlay,
  } = useContext(PlayerContext);

  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(true);
  const [gestureFeedback, setGestureFeedback] = useState("");
  const fadeAnim = useState(new Animated.Value(0))[0];

  if (!permission) return <Text>Requesting camera permission...</Text>;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={{ color: "#fff", marginBottom: 10 }}>
          Camera access is required
        </Text>
        <Pressable style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Allow Camera</Text>
        </Pressable>
      </View>
    );
  }

  const currentTrack = tracks.length > 0 ? tracks[trackIndex] : null;

  // ---------- FEEDBACK HELPER ----------
  const showFeedback = (message) => {
    setGestureFeedback(message);
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  // ---------- GESTURE MAPPINGS ----------
  // 👋 Hand wave left/right → Swipe left/right
  const swipeLeft = Gesture.Fling()
    .direction(Gesture.DIRECTION_LEFT)
    .onEnd(() => {
      nextTrack();
      showFeedback("⏭️ Next Track (Swipe Left)");
    });

  const swipeRight = Gesture.Fling()
    .direction(Gesture.DIRECTION_RIGHT)
    .onEnd(() => {
      prevTrack();
      showFeedback("⏮️ Previous Track (Swipe Right)");
    });

  // 👍 Thumbs up → Single tap to play/pause
  const tap = Gesture.Tap().onEnd(() => {
    togglePlay();
    showFeedback(isPlaying ? "⏸️ Pause (Tap)" : "▶️ Play (Tap)");
  });

  // 🖐️ Open palm → Long press to activate/deactivate camera
  const longPress = Gesture.LongPress().onEnd(() => {
    setCameraActive((prev) => !prev);
    showFeedback(
      cameraActive
        ? "📴 Camera Deactivated (Long Press)"
        : "📷 Camera Activated (Long Press)"
    );
  });

  // ✌️ Number of fingers → Two-finger tap to go back
  // const twoFingerTap = Gesture.Tap()
  //   .numberOfTaps(1)
  //   .numberOfPointers(2)
  //   .onEnd(() => {
  //     showFeedback("↩️ Exit (Two-Finger Tap)");
  //     navigation.goBack();
  //   });
  const longPressExit = Gesture.LongPress()
    .onStart(() => {
      showFeedback("↩️ Exit (Long Press)");
      navigation.goBack();
    });
  // Combine all gestures
  const composedGestures = Gesture.Simultaneous(
    swipeLeft,
    swipeRight,
    tap,
    longPress,
    longPressExit
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <GestureDetector gesture={composedGestures}>
          {cameraActive ? (
            <CameraView style={styles.camera} facing="front" />
          ) : (
            <View style={[styles.camera, styles.cameraInactive]}>
              <Text style={{ color: "#fff" }}>Camera Off</Text>
            </View>
          )}
        </GestureDetector>

        {/* On-screen feedback */}
        <Animated.View style={[styles.feedbackContainer, { opacity: fadeAnim }]}>
          <Text style={styles.feedbackText}>{gestureFeedback}</Text>
        </Animated.View>

        {/* Manual controls */}
        <View style={styles.controls}>
          <Pressable style={styles.btn} onPress={prevTrack}>
            <Text style={styles.btnText}>Prev</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={togglePlay}>
            <Text style={styles.btnText}>{isPlaying ? "Pause" : "Play"}</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={nextTrack}>
            <Text style={styles.btnText}>Next</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, { backgroundColor: "red" }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnText}>Close</Text>
          </Pressable>
        </View>

        {/* Track info */}
        <View style={styles.trackInfo}>
          {currentTrack ? (
            <>
              <Text style={styles.trackTitle}>{currentTrack.title}</Text>
              <Text style={styles.trackArtist}>{currentTrack.artist}</Text>
            </>
          ) : (
            <Text style={{ color: "#fff" }}>No track loaded</Text>
          )}
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  cameraInactive: {
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  controls: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  btn: {
    backgroundColor: "blue",
    padding: 12,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  trackInfo: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    alignItems: "center",
  },
  trackTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  trackArtist: { color: "#aaa", fontSize: 14 },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  feedbackContainer: {
    position: "absolute",
    alignSelf: "center",
    top: "45%",
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 12,
    borderRadius: 8,
  },
  feedbackText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
