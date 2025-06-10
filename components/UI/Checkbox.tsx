import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme/theme"; 

type Props = {
  checked: boolean;
  onToggle: () => void;
};

export default function Checkbox({ checked, onToggle }: Props) {
  return (
    <Pressable style={styles.container} onPress={onToggle}>
      <View style={[styles.box, { borderColor: theme.colors.border }]}>
        {checked && <Ionicons name="checkmark" size={16} color={theme.colors.primary} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: theme.spacing.sm,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
