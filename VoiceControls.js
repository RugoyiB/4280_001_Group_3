import React, { useState, useContext } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as Speech from "expo-speech";
import { PlayerContext } from "./PlayerContext";

export default function VoiceControls({ navigation }) {
  const { togglePlay, nextTrack, prevTrack } = useContext(PlayerContext);
  const [listening, setListening] = useState(false);
  const [statusText, setStatusText] = useState(
    "🎙️ Tap to simulate a voice command: Play, Pause, Next, or Back."
  );

  const handleVoiceCommand = (command) => {
    const lowerCmd = command.toLowerCase();

    if (lowerCmd.includes("play")) {
      togglePlay();
      setStatusText("▶️ Command: Play");
      Speech.speak("Playing track");
    } else if (lowerCmd.includes("pause")) {
      togglePlay();
      setStatusText("⏸️ Command: Pause");
      Speech.speak("Paused");
    } else if (lowerCmd.includes("next")) {
      nextTrack();
      setStatusText("⏭️ Command: Next Track");
      Speech.speak("Next track");
    } else if (lowerCmd.includes("back") || lowerCmd.includes("previous")) {
      prevTrack();
      setStatusText("⏮️ Command: Previous Track");
      Speech.speak("Previous track");
    } else {
      setStatusText(`❓ Unrecognized command: "${command}"`);
      Speech.speak("I didn’t understand that command.");
    }
  };

  const simulateCommand = () => {
    const commands = ["play", "pause", "next", "back"];
    const randomCommand = commands[Math.floor(Math.random() * commands.length)];
    setListening(true);
    setStatusText(`🎤 Simulating: "${randomCommand}"`);
    setTimeout(() => {
      handleVoiceCommand(randomCommand);
      setListening(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎧 Voice Controls</Text>
      <Text style={styles.instructions}>{statusText}</Text>

      <Pressable
        style={[styles.button, listening && { backgroundColor: "#0cf" }]}
        onPress={simulateCommand}
        disabled={listening}
      >
        <Text style={styles.buttonText}>
          {listening ? "🎙️ Simulating..." : "🎤 Simulate Voice Command"}
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, { backgroundColor: "#555" }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>⬅️ Back</Text>
      </Pressable>

      <Text style={styles.note}>
        ⚙️ Simulation mode only — voice recognition is not available in Expo Go.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    color: "#0af",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  instructions: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#0af",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  note: {
    color: "#888",
    fontSize: 14,
    marginTop: 20,
    textAlign: "center",
  },
});
