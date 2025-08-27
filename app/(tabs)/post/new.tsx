import React, { useState } from "react";
import { View, Text, TextInput, SafeAreaView, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { TOPICS } from "../../../constants/topics";
import type { Topic } from "../../../types/post";
import LibraryGridPicker from "../../../components/LibraryGridPicker";
import { getLibraryPublicUrl } from "../../../services/imageLibrary";
import { createPost } from "../../../services/posts";
import { globalStyles } from "../../../theme/globalStyles";

export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState<Topic>("sport");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [imagePath, setImagePath] = useState<string | null>(null); // storage pad
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!title.trim()) {
      Alert.alert("Titel is verplicht");
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert("Niet ingelogd");
      return;
    }
    setSaving(true);
    try {
      await createPost({ userId: user.id, title, content, imagePath: imagePath ?? undefined, topic });
      Alert.alert("Post gepubliceerd");
      router.replace("/(tabs)/buzz");
    } catch (e: any) {
      Alert.alert("Fout", e.message ?? "Kon post niet opslaan");
    } finally {
      setSaving(false);
    }
  };

  const previewUrl = imagePath ? getLibraryPublicUrl(imagePath) : null;

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, marginTop: 20,  marginBottom: 20, marginLeft: 10, marginRight: 10 }}>
      <Text style={globalStyles.titleL}>Nieuwe post</Text>

      <Text style={styles.label}>Titel *</Text>
      <TextInput value={title} onChangeText={setTitle} placeholder="Titel…" style={styles.input} />

      <Text style={styles.label}>Inhoud</Text>
      <TextInput value={content} onChangeText={setContent} placeholder="Schrijf je bericht…" style={[styles.input, { height: 110 }]} multiline />

      <Text style={styles.label}>Thema</Text>
      <View style={styles.topicRow}>
        {TOPICS.map(t => {
          const active = topic === t.key;
          return (
            <TouchableOpacity key={t.key} style={[styles.topicChip, active && styles.topicActive]} onPress={() => setTopic(t.key)}>
              <Text style={[styles.topicText, active && styles.topicTextActive]}>
                {t.emoji} {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Afbeelding uit bibliotheek</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <TouchableOpacity style={styles.pickBtn} onPress={() => setLibraryOpen(true)}>
          <Text style={styles.pickTxt}>{imagePath ? "Andere afbeelding kiezen" : "Kies afbeelding"}</Text>
        </TouchableOpacity>
        {previewUrl && <Image source={{ uri: previewUrl }} style={{ width: 60, height: 60, borderRadius: 8 }} />}
      </View>

      <TouchableOpacity disabled={saving} style={[styles.btn, saving && { opacity: 0.6 }]} onPress={save}>
        <Text style={styles.btnTxt}>{saving ? "Opslaan…" : "Publiceren"}</Text>
      </TouchableOpacity>

      <LibraryGridPicker
        visible={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={img => {
          setImagePath(img.path);
          setLibraryOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 22, fontWeight: "800", marginBottom: 12, textAlign: "center" },
  label: { marginTop: 12, marginBottom: 6, fontWeight: "700" },
  input: { backgroundColor: "#F5F6F0", borderWidth: 1, borderColor: "rgba(0,0,0,0.1)", borderRadius: 12, padding: 12 },
  topicRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  topicChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#c6b351ff",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  topicActive: { backgroundColor: "#517f61ff", borderColor: "#4D7C57" },
  topicText: { fontSize: 13 },
  topicTextActive: { fontWeight: "700" },
  pickBtn: {
    backgroundColor: "#E8F1EA",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  pickTxt: { fontWeight: "700", color: "#1f6f3f" },
  btn: { marginTop: 20, backgroundColor: "#1f6f3f", paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  btnTxt: { color: "#fff", fontWeight: "800" },
});
