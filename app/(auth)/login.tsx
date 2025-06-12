import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import { globalStyles } from "../theme/globalStyles";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Vul je e-mail en wachtwoord in.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert("Fout", error.message);
    } else {
      router.replace("/(tabs)/home"); // Of je gewenste pagina
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Inloggen</Text>

      <Text style={globalStyles.textDark}>E-mailadres</Text>
      <TextInput
        style={globalStyles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="E-mailadres"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={globalStyles.textDark}>Wachtwoord</Text>
      <TextInput style={globalStyles.input} value={password} onChangeText={setPassword} placeholder="Wachtwoord" secureTextEntry />

      <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
        <Text style={globalStyles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <Text style={[globalStyles.text, { color: "#F4ED10", textAlign: "center", marginTop: 10 }]}>Nog geen account? Registreer!</Text>
      </TouchableOpacity>
    </View>
  );
}
