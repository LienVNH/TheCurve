import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../theme/theme";

export default function Error({ error }: { error: string | null }) {
  if (!error) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>⚠️ {error}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.danger,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.md,
    alignSelf: "stretch",
    minHeight: 44,
    justifyContent: "center",
    shadowColor: theme.colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  text: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: theme.font.size.md,
    textAlign: "center",
  },
});
