import React, { useState, useEffect, useContext } from "react";
import { View, Text, Pressable, StyleSheet, Animated, Dimensions } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { PlayerContext } from "./PlayerContext";
import { AuthContext } from "./AuthContext";
import TouchControls from "./TouchControls";

export default function MusicPlayer({ navigation }) {
  const { tracks } = useContext(PlayerContext);
  const { logout } = useContext(AuthContext);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1); // avoid division by zero

  const screenWidth = Dimensions.get("window").width;
  const progressWidth = (position / duration) * (screenWidth * 0.8);

  const currentTrack = tracks.length > 0 ? tracks[trackIndex] : null;

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  const playTrack = async (index = trackIndex) => {
    if (!tracks.length) return;
    if (sound) await sound.unloadAsync();

    const source =
      typeof tracks[index].url === "string"
        ? { uri: tracks[index].url }
        : tracks[index].url;

    const { sound: newSound, status } = await Audio.Sound.createAsync(source);
    setSound(newSound);
    setDuration(status.durationMillis || 1);
    await newSound.playAsync();
    setIsPlaying(true);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        setPosition(status.positionMillis);
        setDuration(status.durationMillis || 1);
      }
    });
  };

  const togglePlayPause = async () => {
    if (!sound) {
      await playTrack();
    } else if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const handleNext = async () => {
    if (!tracks.length) return;
    const nextIndex = (trackIndex + 1) % tracks.length;
    setTrackIndex(nextIndex);
    await playTrack(nextIndex);
  };

  const handlePrev = async () => {
    if (!tracks.length) return;
    const prevIndex = (trackIndex - 1 + tracks.length) % tracks.length;
    setTrackIndex(prevIndex);
    await playTrack(prevIndex);
  };

  const handleLogout = async () => {
    try {
      await logout();
      //navigation.replace("Login"); // Go back to login screen
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      {currentTrack ? (
        <>
          <Text style={styles.trackTitle}>{currentTrack.title}</Text>
          <Text style={styles.trackArtist}>{currentTrack.artist}</Text>

          <View style={styles.controls}>
            <Pressable onPress={handlePrev}>
              <Ionicons name="play-skip-back" size={50} color="#fff" />
            </Pressable>

            <Pressable onPress={togglePlayPause}>
              {isPlaying ? (
                <Ionicons name="pause-circle" size={70} color="#0af" />
              ) : (
                <Ionicons name="play-circle" size={70} color="#0af" />
              )}
            </Pressable>

            <Pressable onPress={handleNext}>
              <Ionicons name="play-skip-forward" size={50} color="#fff" />
            </Pressable>
          </View>

          {/*Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
            </View>
            <Text style={styles.progressTime}>
              {Math.floor(position / 1000)}s / {Math.floor(duration / 1000)}s
            </Text>
          </View>
        </>
      ) : (
        <Text style={{ color: "white" }}>No tracks available</Text>
      )}

      <Pressable style={styles.manageButton} onPress={() => navigation.navigate("PlaylistManager")}>
        <Text style={styles.manageText}>Manage Playlist</Text>
      </Pressable>

      <Pressable style={styles.manageButton} onPress={() => navigation.navigate("CameraControls")}>
        <Text style={styles.manageText}>Camera Controls</Text>
      </Pressable>

      <Pressable style={styles.manageButton} onPress={() => navigation.navigate("MouseControls")}>
        <Text style={styles.manageText}>Mouse Controls</Text>
      </Pressable>

      <Pressable style={styles.manageButton} onPress={() => navigation.navigate("VoiceControls")}>
        <Text style={styles.manageText}>Voice Controls</Text>
      </Pressable>

      <Pressable style={styles.manageButton} onPress={() => navigation.navigate("TouchControls")}>
        <Text style={styles.manageText}>Touch Controls</Text>
      </Pressable>

      {/* Logout Button */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  trackTitle: { fontSize: 22, fontWeight: "bold", color: "#fff", marginTop: 10 },
  trackArtist: { fontSize: 16, color: "#aaa" },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 30,
    width: "80%",
  },
  progressContainer: { marginTop: 20, width: "80%" },
  progressBackground: {
    height: 6,
    backgroundColor: "#444",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBar: { height: 6, backgroundColor: "#0af" },
  progressTime: { color: "#ccc", fontSize: 12, marginTop: 5, textAlign: "center" },
  manageButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#0af",
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  manageText: { color: "#fff", fontWeight: "bold" },
  logoutButton: {
    marginTop: 30,
    padding: 12,
    backgroundColor: "#f44",
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "bold" },
});
