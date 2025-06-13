import React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../../theme/globalStyles";

type Props = {
  title: string;
  summary: string;
};

export default function BlogPostCard({ title, summary }: Props) {
  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.title}>{title}</Text>
      <Text style={globalStyles.textDark}>{summary}</Text>
    </View>
  );
}
