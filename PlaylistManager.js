import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
} from "react-native";
import { PlayerContext } from "./PlayerContext";

export default function PlaylistManager({ navigation }) {
  const { tracks = [], setTracks = () => { } } = useContext(PlayerContext);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [url, setUrl] = useState("");

  const addTrack = () => {
    if (title.trim() && artist.trim() && url.trim()) {
      try {
        const newTrack = {
          id: Date.now().toString(),
          title,
          artist,
          // Expo Go supports local assets or HTTP URLs for expo-av
          url: url.startsWith("http") ? { uri: url } : url,
          duration: 0,
        };
        setTracks([...tracks, newTrack]);
        setTitle("");
        setArtist("");
        setUrl("");
      } catch (error) {
        console.error("Add track failed:", error);
      }
    } else {
      alert("Please fill all fields before adding a track.");
    }
  };

  const deleteTrack = (id) => {
    setTracks(tracks.filter((t) => t.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Playlist Manager</Text>

      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.trackItem}>
            <Text style={styles.trackText}>
              {item.title} - {item.artist}
            </Text>
            <Pressable
              style={styles.deleteButton}
              onPress={() => deleteTrack(item.id)}
            >
              <Text style={{ color: "#fff" }}>Delete</Text>
            </Pressable>
          </View>
        )}
      />

      <TextInput
        placeholder="Track Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Artist"
        value={artist}
        onChangeText={setArtist}
        style={styles.input}
      />
      <TextInput
        placeholder="MP3 URL (https://...)"
        value={url}
        onChangeText={setUrl}
        style={styles.input}
      />

      <Pressable style={styles.addButton} onPress={addTrack}>
        <Text style={{ color: "#fff" }}>Add Track</Text>
      </Pressable>

      <Pressable
        style={[styles.addButton, { backgroundColor: "#555" }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ color: "#fff" }}>Back to Player</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  trackItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  trackText: { color: "#fff" },
  deleteButton: { backgroundColor: "red", padding: 5, borderRadius: 5 },
  input: {
    backgroundColor: "#fff",
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#0af",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
});
