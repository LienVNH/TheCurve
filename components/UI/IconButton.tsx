import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme/theme"; // pad eventueel aanpassen aan je structuur

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export default function IconButton({ icon, onPress }: Props) {
  return (
    <Pressable style={[styles.button, { backgroundColor: theme.colors.primary }]} onPress={onPress}>
      <Ionicons name={icon} size={24} color={theme.colors.textLight} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
