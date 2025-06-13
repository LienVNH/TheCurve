import React from "react";
import { Text, Pressable } from "react-native";
import { globalStyles } from "../../theme/globalStyles";

type Props = {
  onPress: () => void;
  children: string;
};

export default function TextLink({ onPress, children }: Props) {
  return (
    <Pressable onPress={onPress}>
      <Text style={globalStyles.link}>{children}</Text>
    </Pressable>
  );
}
