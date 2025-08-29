
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { TOPICS } from "../constants/topics";
import type { Topic } from "../types/post";
import { theme } from "../theme/theme";

function norm(s?: string | null) {
  if (!s) return "";
  return s
    .toString()
    .trim()
    .normalize?.("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

const COLOR_BY_NAME: Record<string, string> = {
  sport: theme.colors.tagBackgrounds.Sport,
  vrienden: theme.colors.tagBackgrounds.Vrienden,
  ondersteuning: theme.colors.tagBackgrounds.Ondersteuning,
  tips: theme.colors.tagBackgrounds.Tips,
};

function resolveTagBg(label?: string, topicKey?: string) {
  const nLabel = norm(label);
  if (nLabel && COLOR_BY_NAME[nLabel]) return COLOR_BY_NAME[nLabel];
  const nKey = norm(topicKey);
  if (nKey && COLOR_BY_NAME[nKey]) return COLOR_BY_NAME[nKey];
  return theme.colors.yellow; // fallback
}

export function TopicChip({
  label,
  topicKey,
  bgColor, 
  active,
  onPress,
  size = "sm",
  style,
  textStyle,
  disabled,
  numberOfLines = 1,
}: {
  label: string;
  topicKey?: string;
  bgColor?: string;
  active?: boolean;
  onPress?: () => void;
  size?: "xs" | "sm" | "md";
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  numberOfLines?: 1 | 2;
}) {
  const bg = bgColor ?? resolveTagBg(label, topicKey);
  const borderActive = theme.colors.tagBorders.active;
  const borderDefault = theme.colors.tagBorders.default;
  const baseFont = theme.font.size.sm; // 16
  const fontSize = size === "xs" ? Math.max(12, baseFont - 4) : size === "sm" ? baseFont : baseFont + 2;
  const labelLen = (label ?? "").length;
  const autoFont = labelLen >= 14 ? Math.max(12, fontSize - 4) : labelLen >= 10 ? Math.max(12, fontSize - 2) : fontSize;
  const padV = size === "xs" ? 2 : size === "sm" ? 4 : 6;
  const padH = size === "xs" ? 8 : size === "sm" ? 10 : 12;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.8}
      style={[
        styles.chipBase,
        {
          paddingVertical: padV,
          paddingHorizontal: padH,
          backgroundColor: active ? bg : "transparent",
          borderColor: active ? borderActive : borderDefault,
          borderWidth: active ? 2 : 1,
        },
        style,
      ]}
    >
      <Text
        numberOfLines={numberOfLines}
        style={[
          styles.chipText,
          {
            fontSize: autoFont,
            color: active ? theme.colors.black : theme.colors.textDark,
            fontWeight: active ? "bold" : "normal",
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function TopicChips({ current, onChange }: { current: Topic | "all"; onChange: (t: Topic | "all") => void }) {
  return (
    <View style={styles.rowWrap}>
      <TopicChip label="Alle" topicKey="all" active={current === "all"} onPress={() => onChange("all")} size="sm" />
      {TOPICS.map(t => (
        <TopicChip
          key={t.key}
          label={t.label}
          topicKey={t.key}
          bgColor={t.color} // ⬅️ kleur vanuit TOPICS
          active={current === t.key}
          onPress={() => onChange(t.key)}
          size="sm"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8, marginBottom: 6 },
  chipBase: {
    alignSelf: "flex-start",
    flexShrink: 1,
    maxWidth: "100%",
    borderRadius: theme.borderRadius.md,
  },
  chipText: {},
});
