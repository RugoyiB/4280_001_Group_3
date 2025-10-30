import React, { createContext, useState, useEffect } from "react";
import { Audio } from "expo-av";

// Demo Tracks (replace or expand as needed)
const DEMO_TRACKS = [
  {
    id: "t1",
    title: "I Surrender",
    artist: "Hillsong Worship",
    url: require("./assets/i_surrender.mp3"),
  },
  {
    id: "t2",
    title: "In Control",
    artist: "Hillsong Worship",
    url: require("./assets/in_control.mp3"),
  },
  {
    id: "t3",
    title: "Worthy is your Name",
    artist: "Elevation Worship",
    url: require("./assets/worthy_is_your_name.mp3"),
  },
  {
    id: "t4",
    title: "Promises",
    artist: "Marverick City Music",
    url: require("./assets/promises.mp3"),
  },
  {
    id: "t5",
    title: "Mighty-One",
    artist: "Marverick City Music",
    url: require("./assets/mighty-one.mp3"),
  },
];

export const PlayerContext = createContext({
  isPlaying: false,
  trackIndex: 0,
  tracks: [],
  setTracks: () => { },
  nextTrack: () => { },
  prevTrack: () => { },
  togglePlay: () => { },
});

export function PlayerProvider({ children }) {
  const [tracks, setTracks] = useState(DEMO_TRACKS);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  // Load and play the selected track
  const playTrack = async (index) => {
    try {
      // Stop and unload any previous sound
      if (sound) {
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        tracks[index].url,
        { shouldPlay: true }
      );

      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error loading track:", error);
    }
  };

  // Toggle between play and pause
  const togglePlay = async () => {
    try {
      if (!sound) {
        await playTrack(trackIndex);
        return;
      }

      const status = await sound.getStatusAsync();

      if (status.isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  };

  // Move to next track
  const nextTrack = async () => {
    const nextIndex = (trackIndex + 1) % tracks.length;
    setTrackIndex(nextIndex);
    await playTrack(nextIndex);
  };

  // Move to previous track
  const prevTrack = async () => {
    const prevIndex = (trackIndex - 1 + tracks.length) % tracks.length;
    setTrackIndex(prevIndex);
    await playTrack(prevIndex);
  };

  // Cleanup when the component unmounts
  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

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
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
