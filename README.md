# 4280_001_Group_3
# GESTURE-CONTROLLED MUSIC PLAYER

A React Native + Expo music player with multi-modal controls (Camera Gestures, Touch, Voice, Mouse), Firebase Authentication, Playlists, and Cloud Storage.

### OVERVIEW
- MusicPlayer is an interactive cross-platform mobile application built using React Native (Expo).
- It allows users to:
- ✔ Register & Login using Firebase Authentication
- ✔ Upload and stream music via Firebase Storage
- ✔ Automatically save tracks by user
- ✔ Control playback in five different ways:
- •	Gesture Control (Camera + MediaPipe Hands)
- •	Touch Control
- •	Bluetooth Mouse Gestures
- •	Voice Commands
- •	On-screen player controls
- ✔ Manage playlists and track metadata
- ✔ Real-time playback progress visualization

### FEATURES
- 🎧 Core Features
- •	Play / Pause / Previous / Next
- •	Animated progress bar
- •	Track metadata (title, artist)
- •	Auto-load user tracks on login
- •	Logout functionality

### Authentication
- •	Firebase Auth with persistent login (AsyncStorage)
- •	Login & Registration screens
- •	AuthContext manages global login state

### Cloud Integration
- •	Firebase Firestore for track management
- •	Firebase Storage for hosting MP3 files
- •	Persistent audio URLs

### Gesture Controls (CameraControls.js)
- Powered by Expo Camera + MediaPipe Hands:
- •	Thumbs Up → Play/Pause
- •	Swipe Right → Next track
- •	Swipe Left → Previous track
- •	Thumb-to-wrist → Stop

### Mouse Controls
- •	Single Click → Play/Pause
- •	Double Click → Next Track
- •	Long Press → Previous Track

### Voice Controls
- •	Commands like “play”, “pause”, “next”, “previous”

### Touch Controls
- •	Tap → Play/Pause
- •	Swipe Right → Next track
- •	Swipe Left → Previous track
- •	Long Press → Restart
- •	Pinch → Album View

### TECHNOLOGY USED
|Category|Technology|
|--------|----------|
|Framework|React Native (Expo)|
|Navigation|React Navigation|
|Authentication|Firebase Auth|
|Storage|Firebase Storage|
|Database|Firebase Firestore|
|Gesture Recognition|MediaPipe Hands|
|Audio Engine|Expo AV (Audio API)|
|State Management|Context API (Auth + Player)|
|Slider|React-native-community/slider|
|Voice API Key|ASSEMBLY_API_KEY (24f8a8b44ae44344b0db5c5781502a79), Converts Voice to Text.|
|Permissions|Expo Camera|


### PROJECT STRUCTURE
-/MusicPlayer
- ├── App.js
- ├── AuthContext.js
- ├── PlayerContext.js
- ├── firebaseConfig.js
- ├── MusicPlayer.js
- ├── CameraControls.js
- ├── MouseControls.js
- ├── VoiceControls.js
- ├── TouchControls.js
- ├── PlaylistManager.js
- ├── LoginScreen.js
- ├── RegisterScreen.js
- ├── metro.config.js
- ├── babel.config.js
- ├── assets/
-   └── README.md

### DEPENDENCIES
- Key libraries used:
- •	expo-av
- •	expo-camera
- •	@mediapipe/hands
- •	firebase
- •	react-native-gesture-handler
- •	@react-navigation/native
- •	@react-navigation/native-stack
- •	@expo/metro-config
- •	@react-native-community/slider
- •	@react-native-async-storage/async-storage

### POSSIBLE ENHANCEMENTS (FUTURE WORK)
- •	Playlist sharing between users
- •	Equalizer / Audio visualizer
- •	Offline playback with caching
- •	ML-based gesture detection
- •	Add track search & filtering
- •	Improve accuracy of MediaPipe gesture detection

