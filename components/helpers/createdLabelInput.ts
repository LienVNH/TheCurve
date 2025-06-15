import React from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";

type Props = {
  label: string;
} & TextInputProps;

export function createdLabelInput({ label, ...rest }: Props): React.ReactElement {
  return React.createElement(
    View,
    { style: styles.wrapper },
    React.createElement(Text, { style: styles.label }, label),
    React.createElement(TextInput, { style: styles.input, ...rest })
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
