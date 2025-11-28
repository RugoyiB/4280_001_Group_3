import React, { useEffect, useRef, useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { Hands } from "@mediapipe/hands";
import { PlayerContext } from "./PlayerContext";

export default function CameraControls() {
  const { playTrack, togglePlay, nextTrack, prevTrack, stopTrack } =
    useContext(PlayerContext);

  const [hasPermission, setHasPermission] = useState(null);
  const handsRef = useRef(null);
  const processingRef = useRef(false);

  useEffect(() => {
    (async () => {
      // FIXED PERMISSIONS
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      if (status !== "granted") return;

      // Initialize MediaPipe Hands
      const hands = new Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      hands.onResults(handleHandResults);
      handsRef.current = hands;
    })();
  }, []);

  // When MediaPipe detects hand landmarks
  const handleHandResults = (results) => {
    if (!results.multiHandLandmarks?.length) return;

    const hand = results.multiHandLandmarks[0];
    const thumb = hand[4];
    const index = hand[8];
    const wrist = hand[0];

    // Pinch → Play/Pause
    const pinchDist = Math.hypot(thumb.x - index.x, thumb.y - index.y);
    if (pinchDist < 0.03) {
      togglePlay();
      return;
    }

    // Swipe Right → Next Song
    if (index.x - wrist.x > 0.20) {
      nextTrack();
      return;
    }

    // Swipe Left → Previous Song
    if (wrist.x - index.x > 0.20) {
      prevTrack();
      return;
    }

    // Thumb touching wrist → Stop
    const fistDist = Math.hypot(thumb.x - wrist.x, thumb.y - wrist.y);
    if (fistDist < 0.04) {
      stopTrack();
      return;
    }
  };

  // Convert camera frame → ImageBitmap → MediaPipe Hands
  const processFrame = async (frame) => {
    if (!handsRef.current || processingRef.current) return;

    processingRef.current = true;

    try {
      const bitmap = await frame.toImageBitmap();
      await handsRef.current.send({ image: bitmap });
      bitmap.close();
    } catch (e) {
      console.log("Frame processing error:", e);
    }

    processingRef.current = false;
  };

  if (hasPermission === null)
    return <Text style={styles.permission}>Requesting camera permission...</Text>;

  if (hasPermission === false)
    return <Text style={styles.permission}>Camera access denied</Text>;

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="front"
        onFrame={processFrame}
        frameProcessorFps={7}
      />

      <Text style={styles.overlay}>Gesture Controls Active</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  permission: {
    flex: 1,
    color: "#fff",
    textAlign: "center",
    marginTop: 80,
  },
  overlay: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    color: "#fff",
    fontSize: 18,
  },
});
