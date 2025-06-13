import React from "react";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../../theme/globalStyles";
import { theme } from "../../theme/theme";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: "primary" | "success" | "warning";
  iconColor?: string; 
};

export default function IconButton({ icon, onPress, variant = "primary", iconColor }: Props) {
  let style = [{ ...globalStyles.iconButton }];
  if (variant === "success") style[0] = { ...globalStyles.iconButton, ...globalStyles.iconButtonSuccess };
  if (variant === "warning") style[0] = { ...globalStyles.iconButton, ...globalStyles.iconButtonWarning };

  return (
    <Pressable style={style} onPress={onPress}>
      <Ionicons name={icon} size={24} color={iconColor || theme.colors.textLight} />
    </Pressable>
  );
}
