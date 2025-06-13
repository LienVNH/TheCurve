import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import { globalStyles } from "../../theme/globalStyles";
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
      router.replace("/(tabs)/home");
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) Alert.alert("Fout", error.message);
  };

  const handleFacebookLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "facebook" });
    if (error) Alert.alert("Fout", error.message);
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleL}>Inloggen</Text>

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

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={[globalStyles.textDark, { color: "primary", textAlign: "center", marginTop: 10 }]}>Nog geen account? Registreer!</Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.button} onPress={handleGoogleLogin}>
        <Text style={globalStyles.buttonText}>Log in met Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.button} onPress={handleFacebookLogin}>
        <Text style={globalStyles.buttonText}>Log in met Facebook</Text>
      </TouchableOpacity>
    </View>
  );
}
