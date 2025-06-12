import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Linking } from "react-native";
import { supabase } from "../../lib/supabase";
import { globalStyles } from "../theme/globalStyles";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [age, setAge] = useState("");
  const [diabetesSince, setDiabetesSince] = useState("");
  const [whatHope, setWhatHope] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    if (!termsAccepted) {
      Alert.alert("Je moet akkoord gaan met de algemene voorwaarden.");
      return;
    }
    if (!username.trim() || !email.trim() || !password.trim() || !repeatPassword.trim()) {
      Alert.alert("Vul alle verplichte velden in.");
      return;
    }
    if (password !== repeatPassword) {
      Alert.alert("Wachtwoorden komen niet overeen.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Wachtwoord moet minstens 8 tekens bevatten.");
      return;
    }

    // 1. Account aanmaken
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Fout", error.message);
      return;
    }

    // 2. Profiel toevoegen in 'profiles' (zie vorige instructie)
    if (data?.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          user_id: data.user.id,
          username,
          age,
          diabetes_since: diabetesSince,
          what_hope: whatHope,
          terms_accepted: true,
        },
      ]);

      if (profileError) {
        Alert.alert("Fout bij profiel aanmaken", profileError.message);
        return;
      }
    }

    Alert.alert("Registratie gelukt!", "Check je inbox voor bevestiging. Na bevestigen kan je inloggen.", [
      { text: "Naar login", onPress: () => router.replace("/auth/login") },
    ]);
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Registreren</Text>

      <Text style={globalStyles.textDark}>Gebruikersnaam *</Text>
      <TextInput
        style={globalStyles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Kies een unieke gebruikersnaam"
        autoCapitalize="none"
      />

      <Text style={globalStyles.textDark}>E-mailadres *</Text>
      <TextInput
        style={globalStyles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="E-mailadres"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={globalStyles.textDark}>Wachtwoord *</Text>
      <TextInput style={globalStyles.input} value={password} onChangeText={setPassword} placeholder="Wachtwoord" secureTextEntry />

      <Text style={globalStyles.textDark}>Herhaal wachtwoord *</Text>
      <TextInput
        style={globalStyles.input}
        value={repeatPassword}
        onChangeText={setRepeatPassword}
        placeholder="Herhaal wachtwoord"
        secureTextEntry
      />

      <Text style={globalStyles.textDark}>Leeftijd</Text>
      <TextInput style={globalStyles.input} value={age} onChangeText={setAge} placeholder="Leeftijd" keyboardType="numeric" />

      <Text style={globalStyles.textDark}>Sinds wanneer heb je diabetes type 1?</Text>
      <TextInput style={globalStyles.input} value={diabetesSince} onChangeText={setDiabetesSince} placeholder="bv. 01/09/2001" />

      <Text style={globalStyles.textDark}>Wat hoop je uit deze app te halen?</Text>
      <TextInput style={globalStyles.input} value={whatHope} onChangeText={setWhatHope} placeholder="Tips, vrienden, inspiratie..." />

      <TouchableOpacity style={globalStyles.checkboxRow} onPress={() => setTermsAccepted(!termsAccepted)} activeOpacity={0.7}>
        <View style={[globalStyles.checkboxBox, termsAccepted && { backgroundColor: "#1E5128" }]}>
          {termsAccepted && <Text style={{ color: "#FFF", fontWeight: "bold" }}>✓</Text>}
        </View>
        <Text style={globalStyles.textDark}>
          Ik ga akkoord met de{" "}
          <Text style={{ textDecorationLine: "underline", color: "#F4ED10" }} onPress={() => Linking.openURL("/terms")}>
            algemene voorwaarden
          </Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.button} onPress={handleRegister}>
        <Text style={globalStyles.buttonText}>Account aanmaken</Text>
      </TouchableOpacity>
    </View>
  );
}
