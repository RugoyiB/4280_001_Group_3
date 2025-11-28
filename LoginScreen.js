import React, { useState, useContext } from "react";
import { View, TextInput, Button, StyleSheet, Text, ActivityIndicator } from "react-native";
import { AuthContext } from "./AuthContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    setLoading(true);
    await login(email.trim(), password);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎧 Login</Text>

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
        <Button title="Login" onPress={handleLogin} color="#2e1eb6ff" />
      )}

      <Text
        style={styles.link}
        onPress={() => navigation.navigate("Register")}
      >
        Don’t have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#444",
    marginBottom: 12,
    padding: 10,
    borderRadius: 5,
  },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20, fontWeight: "bold" },
  link: { color: "blue", textAlign: "center", marginTop: 10 },
});
