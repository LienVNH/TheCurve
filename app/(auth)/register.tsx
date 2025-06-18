import { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import { supabase } from "../../lib/supabase";
import { globalStyles } from "../../theme/globalStyles";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PlatformDatePicker from "../../components/PlatformDatePicker";
import { createdLabelInput } from "../../components/helpers/createdLabelInput";

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [diabetesSince, setDiabetesSince] = useState<Date | null>(null);
  const [whatHope, setWhatHope] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const router = useRouter();

  const handleRegister = async () => {
    if (!termsAccepted) {
      Alert.alert("Je moet akkoord gaan met de algemene voorwaarden.");
      return;
    }

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !repeatPassword.trim() ||
      !birthday ||
      !diabetesSince
    ) {
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

    const birthdayStr = birthday.toISOString().slice(0, 10);
    const diabetesStr = diabetesSince.toISOString().slice(0, 10);

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Fout", error.message);
      return;
    }

    if (data?.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          user_id: data.user.id,
          first_name: firstName,
          last_name: lastName,
          username,
          birthday: birthdayStr,
          diabetes_since: diabetesStr,
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
      { text: "Naar login", onPress: () => router.replace("/login") },
    ]);
  };

  const form = (
    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: 30,
          marginBottom: 10,
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity onPress={() => router.replace("/login")} style={{ padding: 8 }}>
          <Ionicons name="arrow-back" size={24} color="#1E5128" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/terms")}>
          <Text style={[globalStyles.textDark, { color: "#F4ED10", textDecorationLine: "underline" }]}>Algemene voorwaarden</Text>
        </TouchableOpacity>
      </View>

      <View style={[globalStyles.container, { paddingHorizontal: 20 }]}>
        {createdLabelInput({
          label: "Voornaam *",
          value: firstName,
          onChangeText: setFirstName,
          placeholder: "Voornaam",
        })}

        {createdLabelInput({
          label: "Achternaam *",
          value: lastName,
          onChangeText: setLastName,
          placeholder: "Achternaam",
        })}

        {createdLabelInput({
          label: "Gebruikersnaam *",
          value: username,
          onChangeText: setUsername,
          placeholder: "Unieke gebruikersnaam",
          autoCapitalize: "none",
        })}

        {createdLabelInput({
          label: "E-mailadres *",
          value: email,
          onChangeText: setEmail,
          placeholder: "E-mailadres",
          keyboardType: "email-address",
          autoCapitalize: "none",
        })}

        {createdLabelInput({
          label: "Wachtwoord *",
          value: password,
          onChangeText: setPassword,
          placeholder: "Wachtwoord",
          secureTextEntry: true,
        })}

        {createdLabelInput({
          label: "Herhaal wachtwoord *",
          value: repeatPassword,
          onChangeText: setRepeatPassword,
          placeholder: "Herhaal wachtwoord",
          secureTextEntry: true,
        })}

        {/* ✅ Hier gebruik je PlatformDatePicker die automatisch DateSelect toont op web */}
        <PlatformDatePicker label="Verjaardag *" value={birthday} onChange={setBirthday} />
        <PlatformDatePicker label="Sinds wanneer heb je diabetes type 1? *" value={diabetesSince} onChange={setDiabetesSince} />

        {createdLabelInput({
          label: "Wat hoop je uit deze app te halen?",
          value: whatHope,
          onChangeText: setWhatHope,
          placeholder: "Tips, vrienden, inspiratie...",
        })}

        <TouchableOpacity style={globalStyles.checkboxRow} onPress={() => setTermsAccepted(!termsAccepted)} activeOpacity={0.7}>
          <View style={[globalStyles.checkboxBox, termsAccepted && { backgroundColor: "#1E5128" }]}>
            {termsAccepted && <Text style={{ color: "#FFF", fontWeight: "bold" }}>✓</Text>}
          </View>
          <Text style={globalStyles.textDark}>
            Ik ga akkoord met de{" "}
            <Text style={{ textDecorationLine: "underline", color: "#F4ED10" }} onPress={() => router.push("/terms")}>
              algemene voorwaarden
            </Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={globalStyles.button} onPress={handleRegister}>
          <Text style={globalStyles.buttonText}>Account aanmaken</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return Platform.OS === "web" ? (
    <View style={{ flex: 1 }}>{form}</View>
  ) : (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      {form}
    </KeyboardAvoidingView>
  );
}
