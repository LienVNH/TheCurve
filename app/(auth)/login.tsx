import React, { useState, useEffect, useRef } from "react";
import { Alert, StyleSheet, View, Animated, Image, AppState, TextInput, Text, TouchableOpacity } from "react-native";
import { supabase } from "../../lib/supabase";
import { globalStyles } from "../../theme/globalStyles";
import { useRouter } from "expo-router"; // ✅ Import router

// Supabase: auto-refresh tokens
AppState.addEventListener("change", state => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const router = useRouter(); // ✅ Init router

  useEffect(() => {
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  async function signInWithEmail() {
    setLoading(true);

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.warn("Supabase login error ➜", error);
      Alert.alert(error.message);
    } else {
      console.log("Login succesvol:", data?.user);
      router.push("/account"); 
    }

    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) Alert.alert(error.message);
    if (!session) Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View style={[globalStyles.container, { flex: 1, justifyContent: "center" }]}>
      {/* Logo */}
      <Animated.View style={{ alignItems: "center", opacity: logoOpacity }}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
      </Animated.View>

      {/* E-mail */}
      <Text style={globalStyles.textDark}>E-mailadres</Text>
      <TextInput
        style={globalStyles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="email@address.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Wachtwoord */}
      <Text style={globalStyles.textDark}>Wachtwoord</Text>
      <TextInput
        style={globalStyles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Wachtwoord"
        secureTextEntry
        autoCapitalize="none"
      />

      {/* Actieknoppen */}
      <TouchableOpacity style={globalStyles.button} onPress={signInWithEmail} disabled={loading}>
        <Text style={globalStyles.buttonText}>Inloggen</Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.button} onPress={signUpWithEmail} disabled={loading}>
        <Text style={globalStyles.buttonText}>Registreren</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 300,
    height: 300,
  },
});
