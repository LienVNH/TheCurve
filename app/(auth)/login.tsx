import React, { useState } from "react";
import { Alert, StyleSheet, TextInput, View, Button, Text } from "react-native";
import { supabase } from "../../lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert(error.message);
    if (!session) Alert.alert("Check je inbox voor bevestiging van je registratie!");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welkom terug</Text>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />

      <TextInput placeholder="Wachtwoord" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      <Button title="Login" onPress={signInWithEmail} disabled={loading} />
      <Button title="Registreren" onPress={signUpWithEmail} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 16,
    flex: 1,
    backgroundColor: "#FBFCE4", // uit je theme
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: "bold",
    color: "#1A1A1A", // uit je theme
  },
  input: {
    height: 40,
    borderColor: "#CED4DA",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
    backgroundColor: "#FFF",
  },
});
