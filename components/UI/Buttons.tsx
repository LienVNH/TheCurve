import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { globalStyles } from "../../theme/globalStyles";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "success" | "warning";
  disabled?: boolean;
};

export function Button({ title, onPress, variant = "primary", disabled }: ButtonProps) {
  let buttonStyle, textStyle;
  switch (variant) {
    case "success":
      buttonStyle = globalStyles.buttonSuccess;
      textStyle = globalStyles.buttonSuccessText;
      break;
    case "warning":
      buttonStyle = globalStyles.buttonWarning;
      textStyle = globalStyles.buttonWarningText;
      break;
    case "primary":
    default:
      buttonStyle = globalStyles.buttonPrimary;
      textStyle = globalStyles.buttonPrimaryText;
  }

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}
