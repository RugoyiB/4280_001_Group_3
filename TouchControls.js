import React, { useRef, useContext, useState } from "react";
import { View, Text, StyleSheet, Animated, PanResponder } from "react-native";
import { PlayerContext } from "./PlayerContext";
import Slider from "@react-native-community/slider";

export default function TouchControls({ navigation }) {
  const { togglePlay, nextTrack, prevTrack, setVolume } = useContext(PlayerContext);
  const currentVolume = useRef(0.5);
  const [volume, setVolumeState] = useState(0.5);
  const scale = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        togglePlay();
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx, dy } = gestureState;

        // Swipe left/right → change track
        if (Math.abs(dx) > 100 && Math.abs(dy) < 50) {
          dx > 0 ? nextTrack() : prevTrack();
        }

        // Swipe up/down → volume
        if (Math.abs(dy) > 100 && Math.abs(dx) < 50) {
          if (dy < 0) {
            currentVolume.current = Math.min(1.0, currentVolume.current + 0.1);
          } else {
            currentVolume.current = Math.max(0.0, currentVolume.current - 0.1);
          }
          setVolumeState(currentVolume.current);
          setVolume(currentVolume.current); // actually change audio
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎵 Touch Gesture Controls</Text>

      <View style={styles.controlsRow}>
        {/* Gesture Pad */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.gestureArea, { transform: [{ scale }] }]}
        >
          <Text style={styles.gestureText}>Swipe, Tap, or Pinch</Text>
        </Animated.View>

        <View style={styles.volumeContainer}>
          <Text style={styles.volumeLabel}>{Math.round(volume * 100)}%</Text>
          <Slider
            style={styles.volumeSlider}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            value={volume}
            minimumTrackTintColor="#0af"
            maximumTrackTintColor="#555"
            thumbTintColor="#fff"
            onValueChange={(val) => {
              setVolumeState(val);     // update UI
              currentVolume.current = val;
              setVolume(val);          // update audio
            }}
          />
        </View>
      </View>

      <Text style={styles.hint}>
        • Swipe Left/Right → Change Track{"\n"}
        • Swipe Up/Down → Volume{"\n"}
        • Tap → Play/Pause{"\n"}
        • Long Press → Restart{"\n"}
        • Pinch → Album View
      </Text>

      <Text style={styles.backButton} onPress={() => navigation.goBack()}>
        🔙 Back
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  title: {
    color: "#0af",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    margin: 0,
  },
  gestureArea: {
    width: 250,
    height: 250,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginRight: 0,
    marginLeft: 20,
  },
  gestureText: { color: "#fff", fontSize: 18 },
  volumeContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 0,
    margin: 0,
  },
  volumeLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  volumeSlider: {
    width: 280,
    height: 40,
    marginLeft: -85,
    marginRight: -90,
    transform: [{ rotate: "-90deg" }]
  }, // rotated horizontal slider 
  hint: { color: "#aaa", marginTop: 30, textAlign: "center", lineHeight: 24 },
  backButton: { color: "#f44", fontWeight: "bold", fontSize: 18, marginTop: 40 },
});

