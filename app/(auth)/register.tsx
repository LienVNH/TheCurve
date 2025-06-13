import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import { supabase } from "../../lib/supabase";
import { globalStyles } from "../../theme/globalStyles";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [showBirthdayPicker, setShowBirthdayPicker] = useState(false);
  const [diabetesSince, setDiabetesSince] = useState<Date | null>(null);
  const [showDiabetesPicker, setShowDiabetesPicker] = useState(false);
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

    // Opslaan als YYYY-MM-DD
    const birthdayStr = birthday.toISOString().slice(0, 10);
    const diabetesStr = diabetesSince.toISOString().slice(0, 10);

    // 1. Account aanmaken
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Fout", error.message);
      return;
    }

    // 2. Profiel toevoegen in 'profiles'
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

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingTop: 30,
            marginBottom: 10,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => router.replace("/login")} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color="#1E5128" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/terms")}>
            <Text style={[globalStyles.textDark, { color: "#F4ED10", textDecorationLine: "underline" }]}>Algemene voorwaarden</Text>
          </TouchableOpacity>
        </View>

        <View style={globalStyles.container}>
          <Text style={globalStyles.titleL}>Registreren</Text>

          <Text style={globalStyles.textDark}>Voornaam *</Text>
          <TextInput style={globalStyles.input} value={firstName} onChangeText={setFirstName} placeholder="Voornaam" autoCapitalize="words" />

          <Text style={globalStyles.textDark}>Achternaam *</Text>
          <TextInput style={globalStyles.input} value={lastName} onChangeText={setLastName} placeholder="Achternaam" autoCapitalize="words" />

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

          {/* Verjaardag */}
          <Text style={globalStyles.textDark}>Verjaardag *</Text>
          <TouchableOpacity style={globalStyles.input} onPress={() => setShowBirthdayPicker(true)}>
            <Text>{birthday ? birthday.toLocaleDateString() : "Kies je verjaardag"}</Text>
          </TouchableOpacity>
          {showBirthdayPicker && (
            <DateTimePicker
              mode="date"
              value={birthday || new Date(2000, 0, 1)}
              onChange={(_, selectedDate) => {
                setShowBirthdayPicker(false);
                if (selectedDate) setBirthday(selectedDate);
              }}
              maximumDate={new Date()}
            />
          )}

          {/* Sinds wanneer diabetes */}
          <Text style={globalStyles.textDark}>Sinds wanneer heb je diabetes type 1? *</Text>
          <TouchableOpacity style={globalStyles.input} onPress={() => setShowDiabetesPicker(true)}>
            <Text>{diabetesSince ? diabetesSince.toLocaleDateString() : "Kies een datum"}</Text>
          </TouchableOpacity>
          {showDiabetesPicker && (
            <DateTimePicker
              mode="date"
              value={diabetesSince || new Date()}
              onChange={(_, selectedDate) => {
                setShowDiabetesPicker(false);
                if (selectedDate) setDiabetesSince(selectedDate);
              }}
              maximumDate={new Date()}
            />
          )}

          <Text style={globalStyles.textDark}>Wat hoop je uit deze app te halen?</Text>
          <TextInput style={globalStyles.input} value={whatHope} onChangeText={setWhatHope} placeholder="Tips, vrienden, inspiratie..." />

          {/* Checkbox met link naar terms */}
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
    </KeyboardAvoidingView>
  );
}
