import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "../../theme/theme"; // pas pad aan indien nodig

type Props = {
  children: ReactNode;
};

export default function Card({ children }: Props) {
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
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    marginVertical: theme.spacing.sm,
  },
});
