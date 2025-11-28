import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert, ActivityIndicator } from "react-native";
import { AuthContext } from "./AuthContext";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Missing Information", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await register(email.trim(), password);
      Alert.alert("✅ Registration Successful", "Your account has been created successfully!");
      navigation.navigate("Login");
    } catch (error) {
      let message = error.message;
      if (error.code === "auth/email-already-in-use") {
        message = "This email is already in use.";
      } else if (error.code === "auth/invalid-email") {
        message = "The email address is invalid.";
      } else if (error.code === "auth/weak-password") {
        message = "Password should be at least 6 characters.";
      }
      Alert.alert("Registration Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" />
      ) : (
        <Button title="Register" onPress={handleRegister} color="#1DB954" />
      )}

      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Already have an account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#000" },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
    color: "#fff",
    backgroundColor: "#111",
  },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20, color: "#1DB954", fontWeight: "bold" },
  link: { color: "#1DB954", textAlign: "center", marginTop: 10 },
});
