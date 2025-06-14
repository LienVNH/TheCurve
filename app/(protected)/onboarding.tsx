import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Image, FlatList } from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "../../lib/supabase";
import { globalStyles } from "../../theme/globalStyles";
import { theme } from "../../theme/theme";
import Header from "../../components/UI/Header";

export default function Onboarding() {
  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState<Date>(new Date());
  const [sinceDiabetes, setSinceDiabetes] = useState<Date>(new Date());
  const [interests, setInterests] = useState<string[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const avatarSeeds = Array.from({ length: 20 }, (_, i) => `user${i + 1}`);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(avatarSeeds[0]);

  const router = useRouter();
  const interestOptions = ["Sport", "Vrienden", "Ondersteuning", "Tips"];

  async function handleSubmit() {
    if (!username || !birthdate || !sinceDiabetes || interests.length === 0 || !acceptedTerms) {
      Alert.alert("Vul alle velden in en accepteer de voorwaarden.");
      return;
    }

    setSubmitting(true);
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      Alert.alert("Gebruiker niet gevonden.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        birthdate: birthdate.toISOString().split("T")[0],
        since_diabetes: sinceDiabetes.toISOString().split("T")[0],
        interests,
        accepted_terms: true,
        onboarding_complete: true,
        avatar_url: `https://api.dicebear.com/9.x/notionists/png?seed=${selectedAvatar}`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      Alert.alert("Fout bij opslaan", error.message);
    } else {
      router.replace("/home");
    }

    setSubmitting(false);
  }

  function toggleInterest(option: string) {
    setInterests(prev => (prev.includes(option) ? prev.filter(i => i !== option) : [...prev, option]));
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <Header variant="default" />
      <FlatList
        data={[]} // leeg, want we gebruiken alleen de header
        keyExtractor={() => "dummy"}
        renderItem={null}
        ListHeaderComponent={
          <View style={[globalStyles.container, { paddingBottom: 80 }]}>
            <Text style={globalStyles.textDark}>Gebruikersnaam</Text>
            <TextInput style={globalStyles.input} value={username} onChangeText={setUsername} placeholder="Gebruikersnaam" />

            <Text style={globalStyles.textDark}>Geboortedatum</Text>
            <DateTimePicker
              value={birthdate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) setBirthdate(selectedDate);
              }}
            />

            <Text style={globalStyles.textDark}>Sinds wanneer heb je diabetes?</Text>
            <DateTimePicker
              value={sinceDiabetes}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                if (selectedDate) setSinceDiabetes(selectedDate);
              }}
            />

            <Text style={globalStyles.textDark}>Waar heb je het meeste interesse in?</Text>
            <View style={styles.tagContainer}>
              {interestOptions.map(option => {
                const selected = interests.includes(option);
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => toggleInterest(option)}
                    style={[
                      styles.tag,
                      {
                        backgroundColor: selected ? theme.colors.tagBackgrounds[option as keyof typeof theme.colors.tagBackgrounds] : "transparent",
                        borderColor: selected ? theme.colors.tagBorders.active : theme.colors.tagBorders.default,
                        borderWidth: selected ? 2 : 1,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: selected ? "#000" : theme.colors.textDark,
                        fontWeight: selected ? "bold" : "normal",
                      }}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[globalStyles.textDark, { marginTop: 24 }]}>Kies je avatar</Text>
            <View style={styles.avatarGrid}>
              {avatarSeeds.map(seed => {
                const uri = `https://api.dicebear.com/9.x/notionists/png?seed=${seed}`;
                const selected = selectedAvatar === seed;
                return (
                  <TouchableOpacity key={seed} onPress={() => setSelectedAvatar(seed)} style={styles.avatarWrapper}>
                    <Image
                      source={{ uri }}
                      style={[
                        styles.avatar,
                        selected && {
                          borderColor: theme.colors.green,
                          borderWidth: 3,
                        },
                      ]}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity onPress={() => setAcceptedTerms(!acceptedTerms)} style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}>
              <Text style={globalStyles.textDark}>{acceptedTerms ? "☑" : "☐"} Ik ga akkoord met de </Text>
              <Text
                onPress={() => router.push("/terms")}
                style={{
                  fontWeight: "bold",
                  color: theme.colors.primary,
                  textDecorationLine: "underline",
                }}
              >
                algemene voorwaarden
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={globalStyles.button} onPress={handleSubmit} disabled={submitting}>
              <Text style={globalStyles.buttonText}>{submitting ? "Verzenden..." : "Profiel vervolledigen"}</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  tag: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  avatarWrapper: {
    margin: 6,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderColor: "transparent",
    borderWidth: 2,
    backgroundColor: "#eee",
  },
});
