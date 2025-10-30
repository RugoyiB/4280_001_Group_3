import React, { useContext, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { PlayerContext } from "./PlayerContext";

export default function MouseControls({ navigation }) {
  const { togglePlay, nextTrack, prevTrack } = useContext(PlayerContext);
  const lastClickRef = useRef(0);
  const longPressTimer = useRef(null);
  const [feedback, setFeedback] = useState("🖱️ Ready for mouse gestures...");

  const handleMouseDown = () => {
    longPressTimer.current = setTimeout(() => {
      prevTrack();
      setFeedback("⏪ Long Press → Previous Track");
    }, 800);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    const now = Date.now();
    const delta = now - lastClickRef.current;

    if (delta < 250) {
      nextTrack();
      setFeedback("⏩ Double Click → Next Track");
    } else {
      togglePlay();
      setFeedback("⏯️ Single Click → Play/Pause");
    }

    lastClickRef.current = now;
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handleMouseDown}
      onPressOut={handleMouseUp}
    >
      <View style={styles.container}>
        <Text style={styles.title}>🎧 Bluetooth Mouse Controls</Text>
        <Text style={styles.feedback}>{feedback}</Text>
        <Text style={styles.hint}>
          • Single click → Play/Pause{"\n\n"}
          • Double click → Next track{"\n\n"}
          • Long press → Previous track
        </Text>

        <Text
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          🔙 Back
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { color: "#0af", fontSize: 24, fontWeight: "bold", marginBottom: 30 },
  feedback: { color: "#fff", fontSize: 18, marginBottom: 20 },
  hint: { color: "#aaa", textAlign: "center", lineHeight: 24, marginBottom: 50 },
  backButton: {
    color: "#f44",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
  },
});
