import React, { useState, useEffect, useContext } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { PlayerContext } from "./PlayerContext";

export default function MusicPlayer({ navigation }) {
  const { tracks } = useContext(PlayerContext);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);
  const [position, setPosition] = useState(0);

  // Safely get the current track
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

    const { sound: newSound } = await Audio.Sound.createAsync(source);
    setSound(newSound);
    await newSound.playAsync();
    setIsPlaying(true);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) setPosition(status.positionMillis);
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

          <View style={styles.progressBar}>
            <MaterialIcons name="timeline" size={24} color="#aaa" />
            <Text style={{ color: "#fff" }}>
              {Math.floor(position / 1000)}s
            </Text>
          </View>
        </>
      ) : (
        <Text style={{ color: "white" }}>No tracks available</Text>
      )}

      <Pressable
        style={styles.manageButton}
        onPress={() => navigation.navigate("PlaylistManager")}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Manage Playlist
        </Text>
      </Pressable>

      <Pressable
        style={styles.manageButton}
        onPress={() => navigation.navigate("CameraControls")}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          Camera Controls
        </Text>
      </Pressable>

      <Pressable
        style={styles.manageButton}
        onPress={() => navigation.navigate("MouseControls")}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Mouse Controls</Text>
      </Pressable>

      <Pressable
        style={styles.manageButton}
        onPress={() => navigation.navigate("VoiceControls")}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Voice Controls</Text>
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
  progressBar: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  manageButton: { marginTop: 30, padding: 10, backgroundColor: "#0af", borderRadius: 8 },
});
