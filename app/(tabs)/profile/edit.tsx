import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, Image, ScrollView, ActivityIndicator } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { globalStyles } from "../../../theme/globalStyles";
import { theme } from "../../../theme/theme";

type Profile = {
  id: string;
  username: string | null;
  birthdate: string | null; // "YYYY-MM-DD"
  since_diabetes: string | null; // "YYYY-MM-DD"
  interests: string[] | null;
  avatar_url: string | null;
};

const interestOptions = ["Sport", "Vrienden", "Ondersteuning", "Tips"];
const avatarSeeds = Array.from({ length: 20 }, (_, i) => `user${i + 1}`);

function parseSeedFromDicebear(url?: string | null) {
  if (!url) return avatarSeeds[0];
  try {
    const u = new URL(url);
    const seed = u.searchParams.get("seed");
    return seed ?? avatarSeeds[0];
  } catch {
    return avatarSeeds[0];
  }
}

function toDateOrDefault(s?: string | null) {
  if (!s) return new Date(2000, 0, 1);
  const parts = s.split("-");
  if (parts.length === 3) {
    const y = Number(parts[0]),
      m = Number(parts[1]) - 1,
      d = Number(parts[2]);
    return new Date(y, m, d);
  }
  const dt = new Date(s);
  return isNaN(dt.getTime()) ? new Date(2000, 0, 1) : dt;
}

function toISODate(d: Date) {
  return d.toISOString().split("T")[0];
}

export default function EditProfile() {
  const router = useRouter();

  // ---- STATE (alle hooks binnen de component) ----
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [username, setUsername] = useState("");
  const [birthdate, setBirthdate] = useState<Date>(new Date(2000, 0, 1));
  const [sinceDiabetes, setSinceDiabetes] = useState<Date>(new Date());
  const [interests, setInterests] = useState<string[]>([]);
  const [avatarSeed, setAvatarSeed] = useState<string>(avatarSeeds[0]);

  // Android datepicker toggles
  const [showBirthPicker, setShowBirthPicker] = useState(false);
  const [showSincePicker, setShowSincePicker] = useState(false);
  // -----------------------------------------------

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      if (!user) {
        Alert.alert("Niet ingelogd");
        router.replace("/login");
        return;
      }

      setLoading(true);
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (error) {
        Alert.alert("Fout", error.message);
        setLoading(false);
        return;
      }
      const p = data as Profile;

      setUsername(p.username ?? "");
      setBirthdate(toDateOrDefault(p.birthdate));
      setSinceDiabetes(toDateOrDefault(p.since_diabetes));
      setInterests(Array.isArray(p.interests) ? p.interests : []);
      setAvatarSeed(parseSeedFromDicebear(p.avatar_url));
      setLoading(false);
    })();
  }, [router]);

  function toggleInterest(option: string) {
    setInterests(prev => (prev.includes(option) ? prev.filter(i => i !== option) : [...prev, option]));
  }

  async function handleSave() {
    if (!username.trim()) {
      Alert.alert("Gebruikersnaam is verplicht");
      return;
    }
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) {
      Alert.alert("Niet ingelogd");
      return;
    }

    setSaving(true);
    const avatar_url = `https://api.dicebear.com/9.x/notionists/png?seed=${encodeURIComponent(avatarSeed)}`;

    const { error } = await supabase
      .from("profiles")
      .update({
        username: username.trim(),
        birthdate: toISODate(birthdate),
        since_diabetes: toISODate(sinceDiabetes),
        interests,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      Alert.alert("Fout bij opslaan", error.message);
    } else {
      Alert.alert("Opgeslagen");
      router.replace("/profile");
    }
  }

  if (loading) {
    return (
      <View style={[globalStyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const avatarUri = `https://api.dicebear.com/9.x/notionists/png?seed=${encodeURIComponent(avatarSeed)}`;

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={[globalStyles.container, { paddingBottom: 40 }]}>
        <Text style={globalStyles.titleL}>Bewerk profiel</Text>

        {/* Gebruikersnaam */}
        <Text style={[globalStyles.textDark, { marginTop: 12 }]}>Gebruikersnaam</Text>
        <TextInput style={globalStyles.input} value={username} onChangeText={setUsername} placeholder="Gebruikersnaam" />

        {/* Geboortedatum */}
        <Text style={[globalStyles.textDark, { marginTop: 12 }]}>Geboortedatum</Text>
        {Platform.OS === "web" ? (
          <TextInput
            style={globalStyles.input}
            value={toISODate(birthdate)}
            onChangeText={text => setBirthdate(toDateOrDefault(text))}
            placeholder="YYYY-MM-DD"
          />
        ) : Platform.OS === "ios" ? (
          <DateTimePicker value={birthdate} mode="date" display="spinner" onChange={(_, d) => d && setBirthdate(d)} />
        ) : (
          <>
            <TouchableOpacity onPress={() => setShowBirthPicker(true)} style={[globalStyles.input, { justifyContent: "center" }]}>
              <Text>{toISODate(birthdate)}</Text>
            </TouchableOpacity>
            {showBirthPicker && (
              <DateTimePicker
                value={birthdate}
                mode="date"
                display="calendar"
                onChange={(event, selected) => {
                  setShowBirthPicker(false);
                  if (event.type === "set" && selected) setBirthdate(selected);
                }}
              />
            )}
          </>
        )}

        {/* Sinds diabetes */}
        <Text style={[globalStyles.textDark, { marginTop: 12 }]}>Sinds wanneer heb je diabetes?</Text>
        {Platform.OS === "web" ? (
          <TextInput
            style={globalStyles.input}
            value={toISODate(sinceDiabetes)}
            onChangeText={text => setSinceDiabetes(toDateOrDefault(text))}
            placeholder="YYYY-MM-DD"
          />
        ) : Platform.OS === "ios" ? (
          <DateTimePicker value={sinceDiabetes} mode="date" display="spinner" onChange={(_, d) => d && setSinceDiabetes(d)} />
        ) : (
          <>
            <TouchableOpacity onPress={() => setShowSincePicker(true)} style={[globalStyles.input, { justifyContent: "center" }]}>
              <Text>{toISODate(sinceDiabetes)}</Text>
            </TouchableOpacity>
            {showSincePicker && (
              <DateTimePicker
                value={sinceDiabetes}
                mode="date"
                display="calendar"
                onChange={(event, selected) => {
                  setShowSincePicker(false);
                  if (event.type === "set" && selected) setSinceDiabetes(selected);
                }}
              />
            )}
          </>
        )}

        {/* Interesses */}
        <Text style={[globalStyles.textDark, { marginTop: 12 }]}>Interesses</Text>
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
                    backgroundColor: selected
                      ? theme.colors.tagBackgrounds?.[option as keyof typeof theme.colors.tagBackgrounds] ?? "#E8F1EA"
                      : "transparent",
                    borderColor: selected ? theme.colors.tagBorders.active : theme.colors.tagBorders.default,
                    borderWidth: selected ? 2 : 1,
                  },
                ]}
              >
                <Text style={{ color: selected ? "#000" : theme.colors.textDark, fontWeight: selected ? "bold" : "normal" }}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Avatar keuze */}
        <Text style={[globalStyles.textDark, { marginTop: 16 }]}>Kies je avatar</Text>
        <View style={styles.avatarRow}>
          <Image source={{ uri: avatarUri }} style={styles.avatarLarge} />
        </View>
        <View style={styles.avatarGrid}>
          {avatarSeeds.map(seed => {
            const uri = `https://api.dicebear.com/9.x/notionists/png?seed=${seed}`;
            const selected = avatarSeed === seed;
            return (
              <TouchableOpacity key={seed} onPress={() => setAvatarSeed(seed)} style={styles.avatarWrapper}>
                <Image source={{ uri }} style={[styles.avatarSmall, selected && { borderColor: theme.colors.green, borderWidth: 3 }]} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Acties */}
        <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
          <TouchableOpacity style={[globalStyles.button, { flex: 1, backgroundColor: "#aaa" }]} onPress={() => router.back()} disabled={saving}>
            <Text style={globalStyles.buttonText}>Annuleren</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[globalStyles.button, { flex: 1 }]} onPress={handleSave} disabled={saving}>
            <Text style={globalStyles.buttonText}>{saving ? "Opslaan…" : "Opslaan"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tagContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8, marginTop: 6 },
  tag: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, margin: 4 },
  avatarRow: { alignItems: "center", marginTop: 8 },
  avatarLarge: { width: 92, height: 92, borderRadius: 46, backgroundColor: "#eee", borderWidth: 2, borderColor: theme.colors.primary },
  avatarGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginTop: 14, marginBottom: 8 },
  avatarWrapper: { margin: 6 },
  avatarSmall: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#eee", borderColor: "transparent", borderWidth: 2 },
});
