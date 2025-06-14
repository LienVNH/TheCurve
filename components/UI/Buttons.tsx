import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { globalStyles } from "../../theme/globalStyles";
import { theme } from "../../theme/theme";

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export function Buttons({ title, onPress, disabled }: ButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={[styles.button, disabled && styles.disabled]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
  },
  text: {
    color: theme.colors.buttonText,
    fontSize: theme.font.size.md,
    fontWeight: "bold",
  },
  disabled: {
    backgroundColor: theme.colors.disabled,
  },
});
