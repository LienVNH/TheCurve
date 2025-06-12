import React from "react";
import { Text, Pressable, StyleSheet } from "react-native";
import { theme } from "../../theme/theme"; // pad aanpassen indien nodig

type Props = {
  onPress: () => void;
  children: string;
};

export default function TextLink({ onPress, children }: Props) {
  return (
    <Pressable onPress={onPress}>
      <Text style={[styles.link, { color: theme.colors.info }]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
