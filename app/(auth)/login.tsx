import React, { useState, useEffect, useRef } from "react";
import { Alert, StyleSheet, View, Animated, Image, AppState, TextInput, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { supabase } from "../../lib/supabase";
import { globalStyles } from "../../theme/globalStyles";
import { useRouter } from "expo-router";

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
  const router = useRouter();

  useEffect(() => {
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  async function signInWithEmail() {
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.warn("Supabase login error ➜", error);
      Alert.alert(error.message);
      setLoading(false);
      return;
    }

    const user = data?.user;

    if (!user) {
      Alert.alert("Er ging iets fout bij het ophalen van de gebruiker.");
      setLoading(false);
      return;
    }

    // Haalt profiel op
    const { data: profile, error: profileError } = await supabase.from("profiles").select("*").eq("id", user.id).single();

    if (profileError) {
      console.warn("Fout bij ophalen profiel ➜", profileError);
      Alert.alert("Kon profielgegevens niet ophalen.");
      setLoading(false);
      return;
    }

    const isIncomplete = !profile?.username || !profile?.birthdate || !profile?.since_diabetes || !profile?.interests || !profile?.accepted_terms;

    if (isIncomplete) {
      router.replace("/onboarding");
    } else {
      router.replace("/home");
    }

    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
    } else if (!data.session) {
      Alert.alert("Check je mailbox voor e-mailverificatie!");
    }

    setLoading(false);
  }


  const content = (
    <View style={[globalStyles.container, { flex: 1, justifyContent: "center" }]}>
      <Animated.View style={{ alignItems: "center", opacity: logoOpacity }}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
      </Animated.View>

      <Text style={globalStyles.textDark}>E-mailadres</Text>
      <TextInput
        style={globalStyles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="email@address.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={globalStyles.textDark}>Wachtwoord</Text>
      <TextInput
        style={globalStyles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Wachtwoord"
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity style={globalStyles.button} onPress={signInWithEmail} disabled={loading}>
        <Text style={globalStyles.buttonText}>Inloggen</Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.button} onPress={signUpWithEmail} disabled={loading}>
        <Text style={globalStyles.buttonText}>Registreren</Text>
      </TouchableOpacity>
    </View>
  );

  //  Return afhankelijk van platform
  return Platform.OS === "web" ? (
    content
  ) : (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      {content}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 300,
    height: 300,
  },
});
