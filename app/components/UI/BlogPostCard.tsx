import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../theme/theme"; // pad aanpassen indien nodig

type Props = {
  title: string;
  summary: string;
};

export default function BlogPostCard({ title, summary }: Props) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.textDark }]}>{title}</Text>
      <Text style={[styles.summary, { color: theme.colors.textDark }]}>{summary}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    marginVertical: theme.spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: theme.spacing.xs,
  },
  summary: {
    fontSize: 14,
  },
});
