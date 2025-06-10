import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../theme/theme"; // pad aanpassen indien nodig

type Props = {
  text: string;
  fromUser: boolean;
};

export default function ChatBubble({ text, fromUser }: Props) {
  const bubbleStyle = {
    backgroundColor: fromUser ? theme.colors.primary : theme.colors.shades.primary[100],
    alignSelf: fromUser ? ("flex-end" as "flex-end" | "flex-start") : ("flex-start" as "flex-end" | "flex-start"),
  };

  const textColor = fromUser ? theme.colors.textDark : theme.colors.textDark;

  return (
    <View style={[styles.bubble, bubbleStyle]}>
      <Text style={[styles.text, { color: textColor }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "75%",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginVertical: theme.spacing.xs,
  },
  text: {
    fontSize: 14,
  },
});
