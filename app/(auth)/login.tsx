import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";
import { View, TextInput, Button, Text, Alert, StyleSheet } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false); 
  const router = useRouter();

  async function handleLogin() {
    setLoading(true);
    if (!email || !password) {
      Alert.alert("Vul je e-mail en wachtwoord in.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert("Fout", error.message);
    
  }

  async function handleRegister() {
    setLoading(true);
    if (!email || !password) {
      Alert.alert("Vul je e-mail en wachtwoord in.");
      setLoading(false);
      return;
    }
    const { error, data } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert("Fout", error.message);
    } else {
      Alert.alert("Registratie gelukt!", "Check je inbox voor bevestiging.");
      setIsRegister(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegister ? "Account aanmaken" : "Welkom terug"}</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Wachtwoord" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      <Button title={isRegister ? "Registreren" : "Login"} onPress={isRegister ? handleRegister : handleLogin} disabled={loading} />

      <Text style={{ marginTop: 20, textAlign: "center", color: "#2E7D32" }} onPress={() => setIsRegister(r => !r)}>
        {isRegister ? "Heb je al een account? Inloggen" : "Nog geen account? Registreren"}
      </Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

    marginTop: 40,
    padding: 16,
    flex: 1,
    backgroundColor: "#234503",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
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
