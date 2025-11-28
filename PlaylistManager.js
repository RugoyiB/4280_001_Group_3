import React, { useState, useContext } from "react";
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from "react-native";
import { PlayerContext } from "./PlayerContext";

export default function PlaylistManager({ navigation }) {
  const { tracks = [], addTrackFromUrl, loadUserTracks, deleteTrack } = useContext(PlayerContext);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [url, setUrl] = useState("");

  const handleAddTrack = async () => {
    if (!title.trim() || !artist.trim() || !url.trim()) {
      return alert("Please fill all fields (Title, Artist, URL).");
    }
    await addTrackFromUrl(url, title, artist);
    setTitle("");
    setArtist("");
    setUrl("");
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
              onPress={() => deleteTrack(item.id, item.title)}
            >
              <Text style={{ color: "#fff" }}>Delete</Text>
            </Pressable>
          </View>
        )}
      />

      <TextInput
        placeholder="Track Title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        placeholder="Artist"
        placeholderTextColor="#888"
        value={artist}
        onChangeText={setArtist}
        style={styles.input}
      />

      <TextInput
        placeholder="MP3 URL (https://...)"
        placeholderTextColor="#888"
        value={url}
        onChangeText={setUrl}
        style={styles.input}
      />

      <Pressable style={styles.addButton} onPress={handleAddTrack}>
        <Text style={{ color: "#fff" }}>Add Track</Text>
      </Pressable>

      <Pressable style={[styles.addButton, { backgroundColor: "#555" }]} onPress={() => navigation.goBack()}>
        <Text style={{ color: "#fff" }}>Back to Player</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20 },
  header: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  trackItem: {
    flexDirection: "row",       // row layout
    justifyContent: "space-between", // space between text and button
    alignItems: "center",       // vertically center
    paddingVertical: 10
  },
  trackText: {
    color: "#fff",
    flexShrink: 1               // allow text to wrap if too long
  },
  input: { backgroundColor: "#fff", marginVertical: 5, padding: 10, borderRadius: 5 },
  addButton: { backgroundColor: "#0af", padding: 10, borderRadius: 8, alignItems: "center", marginTop: 10 },
  deleteButton: {
    backgroundColor: "#f44",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
});
