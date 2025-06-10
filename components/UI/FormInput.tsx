import React from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { theme } from "../../theme/theme"; // pas dit pad aan indien nodig

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
};

export default function FormInput({ label, value, onChangeText, error }: Props) {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.colors.textDark }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: error ? theme.colors.danger : theme.colors.border,
            color: theme.colors.textDark,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
      />
      {error && <Text style={[styles.error, { color: theme.colors.danger }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    marginBottom: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
  },
  error: {
    fontSize: 12,
    marginTop: theme.spacing.xs,
  },
});
