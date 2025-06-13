import React from "react";
import { View, Pressable, Text } from "react-native";
import { globalStyles } from "../../theme/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme/theme";

type Props = {
  checked: boolean;
  onToggle: () => void;
};

export default function Checkbox({ checked, onToggle }: Props) {
  return (
    <Pressable style={globalStyles.checkboxRow} onPress={onToggle}>
      <View style={globalStyles.checkboxBox}>{checked && <Ionicons name="checkmark" size={16} color={theme.colors.primary} />}</View>
    </Pressable>
  );
}
