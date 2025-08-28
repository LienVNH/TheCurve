import React from "react";
import { ScrollView, TouchableOpacity, Text, StyleSheet } from "react-native";
import { TOPICS } from "../constants/topics";
import { Topic } from "../types/post";

type Props = { current: Topic | "all"; onChange: (t: Topic | "all") => void };

export default function TopicChips({ current, onChange }: Props) {
  const items: any[] = [{ key: "all", label: "Alles", emoji: "🌀" }, ...TOPICS];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.map(t => {
        const active = current === t.key;
        return (
          <TouchableOpacity key={t.key} style={[styles.chip, active && styles.active]} onPress={() => onChange(t.key)}>
            <Text style={[styles.txt, active && styles.txtActive]}>
              {t.emoji} {t.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 12, gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: "#F2F0E6", borderWidth: 1, borderColor: "rgba(0,0,0,0.08)" },
  active: { backgroundColor: "#E3F2E8", borderColor: "#4D7C57" },
  txt: { fontSize: 14 },
  txtActive: { fontWeight: "700" },
});
