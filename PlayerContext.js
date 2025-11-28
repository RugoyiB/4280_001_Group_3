import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system/legacy";
import { Alert } from "react-native";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { AuthContext } from "./AuthContext";
import { getMetadata } from "firebase/storage";

export const PlayerContext = createContext({
  isPlaying: false,
  trackIndex: 0,
  tracks: [],
  setTracks: () => { },
  nextTrack: () => { },
  prevTrack: () => { },
  togglePlay: () => { },
  addTrackFromUrl: () => { },
  deleteTrack: () => { },
  loadUserTracks: () => { },
});

export function PlayerProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [tracks, setTracks] = useState([]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(null); // ✅ Using a ref for persistent sound object

  // 🔊 Load & play a specific track safely
  const playTrack = async (index) => {
    try {
      if (!tracks.length) return;

      // ✅ Stop and unload existing sound before playing new one
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(tracks[index].url, {
        shouldPlay: true,
      });

      soundRef.current = sound;
      setTrackIndex(index);
      setIsPlaying(true);

      // Auto-next when finished
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) nextTrack();
      });
    } catch (error) {
      console.error("Error loading track:", error);
      Alert.alert("Playback Error", "Unable to play this track.");
    }
  };

  // ▶️⏸️ Toggle play/pause
  const togglePlay = async () => {
    try {
      if (!soundRef.current) {
        await playTrack(trackIndex);
        return;
      }

      const status = await soundRef.current.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setIsPlaying(true);
        }
      } else {
        // reload if sound got unloaded
        await playTrack(trackIndex);
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  };


  // ⏭️ Next track
  const nextTrack = async () => {
    if (tracks.length === 0) return;
    const nextIndex = (trackIndex + 1) % tracks.length;
    await playTrack(nextIndex);
  };

  // ⏮️ Previous track
  const prevTrack = async () => {
    if (tracks.length === 0) return;
    const prevIndex = (trackIndex - 1 + tracks.length) % tracks.length;
    await playTrack(prevIndex);
  };

  // 🔁 Restart current track (for long press gesture)
  const restartTrack = async () => {
    if (tracks.length === 0) return;
    await playTrack(trackIndex);
  };

  // ☁️ Add track from URL and upload to Firebase Storage
  const addTrackFromUrl = async (url, title, artist = "Unknown") => {
    if (!user) return Alert.alert("Error", "User not logged in.");

    try {
      const localUri = `${FileSystem.documentDirectory}${title}.mp3`;
      await FileSystem.downloadAsync(url, localUri);

      const fileBlob = await fetch(localUri).then((res) => res.blob());
      const storage = getStorage();
      const trackRef = ref(storage, `users/${user.uid}/${title}.mp3`);
      await uploadBytes(trackRef, fileBlob, {
        contentType: "audio/mpeg",
        customMetadata: { artist }
      });

      const downloadUrl = await getDownloadURL(trackRef);
      const newTrack = {
        id: Date.now().toString(),
        title,
        artist,
        url: { uri: downloadUrl },
      };
      setTracks((prev) => [...prev, newTrack]);

      Alert.alert("Track Added", `"${title}" has been added to your playlist.`);
    } catch (error) {
      console.error("Error adding track:", error);
      Alert.alert("Error", "Failed to add track from URL.");
    }
  };

  // ❌ Delete a track from Firebase Storage and local state
  const deleteTrack = async (trackId, title) => {
    if (!user) return Alert.alert("Error", "User not logged in.");

    try {
      const storage = getStorage();
      const trackRef = ref(storage, `users/${user.uid}/${title}.mp3`);

      await deleteObject(trackRef);
      setTracks((prevTracks) =>
        prevTracks.filter((track) => track.id !== trackId)
      );

      Alert.alert("Track Deleted", `"${title}" has been removed from your playlist.`);
    } catch (error) {
      console.error("Error deleting track:", error);
      Alert.alert("Error", "Failed to delete track.");
    }
  };

  const setVolume = async (volume) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setVolumeAsync(volume); // volume between 0.0 and 1.0
      }
    } catch (error) {
      console.error("Error setting volume:", error);
    }
  };

  // ☁️ Load user’s uploaded tracks from Firebase Storage
  const loadUserTracks = async () => {
    if (!user) return;
    try {
      const storage = getStorage();
      const userFolderRef = ref(storage, `users/${user.uid}`);
      const list = await listAll(userFolderRef);

      const fetchedTracks = await Promise.all(
        list.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const metadata = await getMetadata(itemRef);
          return {
            id: itemRef.name,
            title: itemRef.name.replace(".mp3", ""),
            artist: metadata.customMetadata?.artist || "Unknown",
            url: { uri: url },
          };
        })
      );

      setTracks(fetchedTracks);
    } catch (error) {
      console.error("Error loading user tracks:", error);
    }
  };

  // 🧹 Cleanup sound on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        trackIndex,
        tracks,
        setTracks,
        nextTrack,
        prevTrack,
        togglePlay,
        playTrack,
        restartTrack,
        addTrackFromUrl,
        deleteTrack,
        loadUserTracks,
        setVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
