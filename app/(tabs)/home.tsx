import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../theme/theme";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welkom </Text>
      <Text style={styles.subtitle}>Je bent ingelogd. Veel plezier!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  title: {
    color: theme.colors.primaryDark,
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: theme.colors.textDark,
    fontSize: 16,
    marginTop: theme.spacing.md,
  },
});
