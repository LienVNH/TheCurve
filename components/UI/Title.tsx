import React from "react";
import { Text, StyleSheet } from "react-native";
import { theme } from "../../theme/theme"; // pad aanpassen indien nodig

type Props = {
  children: string;
};

export default function Title({ children }: Props) {
  return <Text style={[styles.title, { color: theme.colors.textDark }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 1.5,
    fontWeight: "bold",
    marginBottom: theme.spacing.lg,
  },
});
