import React, { useState } from "react";
import { View, Text, TextInput, SafeAreaView, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { TOPICS } from "../../../constants/topics";
import type { Topic } from "../../../types/post";
import { createPost } from "../../../services/posts";
import { globalStyles } from "../../../theme/globalStyles";
import { theme } from "../../../theme/theme";
import { TopicChip } from "../../../components/TopicChips";

export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState<Topic>("sport");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!title.trim()) {
      Alert.alert("Titel is verplicht");
      return;
    }
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr) {
      Alert.alert("Fout", "Kon gebruiker niet ophalen");
      return;
    }
    if (!user) {
      Alert.alert("Niet ingelogd");
      return;
    }

    setSaving(true);
    try {
      await createPost({
        userId: user.id,
        title: title.trim(),
        content: content.trim() || undefined,
        topic,
      });
      Alert.alert("Post gepubliceerd");
      router.replace("/(tabs)/buzz");
    } catch (e: any) {
      Alert.alert("Fout", e?.message ?? "Kon post niet opslaan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
        <View style={[globalStyles.container, { paddingBottom: theme.spacing.xl }]}>
          <Text style={globalStyles.titleL}>Nieuwe post</Text>

          <Text style={[globalStyles.textDark, { marginTop: 12 }]}>Titel *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Titel…"
            style={globalStyles.input}
            autoCapitalize="sentences"
            maxLength={120}
          />

          <Text style={[globalStyles.textDark, { marginTop: 12 }]}>Inhoud</Text>
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="Schrijf je bericht…"
            style={[globalStyles.input, styles.textarea]}
            multiline
            textAlignVertical="top"
          />

          
          <Text style={[globalStyles.textDark, { marginTop: 12 }]}>Thema</Text>
          <View style={styles.topicRow}>
            {TOPICS.map(t => (
              <TopicChip
                key={t.key}
                label={t.label}
                topicKey={t.key}
                bgColor={t.color}
                active={topic === t.key}
                onPress={() => setTopic(t.key)}
                size="sm"
              />
            ))}
          </View>

          <TouchableOpacity disabled={saving} onPress={save} style={[globalStyles.button, saving && { opacity: 0.7 }]}>
            <Text style={globalStyles.buttonText}>{saving ? "Opslaan…" : "Publiceren"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textarea: {
    height: 120,
  },
  topicRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
    marginBottom: 4,
  },
});
