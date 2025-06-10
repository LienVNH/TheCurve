import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import { theme } from "../../theme/theme";

type Props = {
  title: string;
  onPress: () => void;
};

export default function PrimaryButton({ title, onPress }: Props) {
  return (
    <Pressable style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={onPress}>
      <Text style={[styles.text, { color: theme.colors.textLight }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: theme.spacing.sm,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  color: {
    backgroundColor: theme.colors.primary,
  }
    
});
