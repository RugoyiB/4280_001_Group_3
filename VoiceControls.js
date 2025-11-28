import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import { PlayerContext } from "./PlayerContext";

const ASSEMBLY_API_KEY = "24f8a8b44ae44344b0db5c5781502a79"; // 🔑 Assembly API Key

export default function VoiceControls() {
  const {
    tracks,
    trackIndex,
    isPlaying,
    togglePlay,
    nextTrack,
    prevTrack,
    playTrack
  } = useContext(PlayerContext);

  const [status, setStatus] = useState("Press 🎙️ to give a command");
  const [isLoading, setIsLoading] = useState(false);
  const recordingRef = useRef(null);

  // Request microphone permission
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access microphone is required!");
      }
    })();
  }, []);

  // 🎙️ Record, Upload & Transcribe Voice Command
  const recordCommand = async () => {
    try {
      setIsLoading(true);
      setStatus("🎤 Listening...");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;

      setTimeout(async () => {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setStatus("⏳ Processing command...");
        await sendToAssembly(uri);
      }, 4000);
    } catch (err) {
      console.error(err);
      setStatus("⚠️ Recording failed");
      setIsLoading(false);
    }
  };

  const sendToAssembly = async (uri) => {
    try {
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();
      const audioData = new Uint8Array(arrayBuffer);

      const uploadRes = await axios.post(
        "https://api.assemblyai.com/v2/upload",
        audioData,
        {
          headers: {
            authorization: ASSEMBLY_API_KEY,
            "content-type": "application/octet-stream",
          },
        }
      );

      const transcriptRes = await axios.post(
        "https://api.assemblyai.com/v2/transcript",
        {
          audio_url: uploadRes.data.upload_url,
          language_code: "en_us",
          punctuate: true,
        },
        { headers: { authorization: ASSEMBLY_API_KEY } }
      );

      let statusRes;
      do {
        await new Promise((r) => setTimeout(r, 2000));
        statusRes = await axios.get(
          `https://api.assemblyai.com/v2/transcript/${transcriptRes.data.id}`,
          { headers: { authorization: ASSEMBLY_API_KEY } }
        );
      } while (statusRes.data.status !== "completed");

      const text = statusRes.data.text.toLowerCase();
      setStatus(`🗣️ Heard: "${text}"`);
      await handleCommand(text);
    } catch (err) {
      console.error("Transcription Error:", err.response?.data || err.message);
      setStatus("❌ Error processing command");
    } finally {
      setIsLoading(false);
    }
  };

  // 🎧 Voice Command Handler using PlayerContext
  const handleCommand = async (command) => {
    if (command.includes("play")) {
      if (!isPlaying) await togglePlay();
    } else if (command.includes("pause")) {
      if (isPlaying) await togglePlay();
    } else if (command.includes("next")) {
      await nextTrack();
    } else if (command.includes("previous") || command.includes("back")) {
      await prevTrack();
    } else if (command.includes("stop")) {
      if (isPlaying) await togglePlay();
      // if (tracks.length > 0) await playTrack(trackIndex);
    } else {
      setStatus("🤔 Command not recognized. Try: play, pause, next, previous");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#121212",
        padding: 20,
      }}
    >
      <Text style={{ color: "white", fontSize: 22, marginBottom: 20 }}>
        🎧 Voice-Controlled Music Player
      </Text>

      <TouchableOpacity
        onPress={recordCommand}
        style={{
          backgroundColor: "#1DB954",
          padding: 15,
          borderRadius: 50,
          marginBottom: 20,
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "white", fontSize: 18 }}>🎙️ Speak Command</Text>
        )}
      </TouchableOpacity>

      <Text style={{ color: "#ccc", fontSize: 16, textAlign: "center" }}>
        {status}
      </Text>

      <Text
        style={{
          color: "#1DB954",
          marginTop: 20,
          fontSize: 14,
        }}
      >
        Commands: Play / Pause / Next / Previous / Stop
      </Text>

      <Text style={{ color: "#fff", marginTop: 10, fontSize: 16 }}>
        Now Playing: {tracks[trackIndex]?.title || "None"}
      </Text>
    </View>
  );
}
