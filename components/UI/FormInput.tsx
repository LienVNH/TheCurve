import React from "react";
import { TextInput, View, Text } from "react-native";
import { globalStyles } from "../../theme/globalStyles";

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
};

export default function FormInput({ label, value, onChangeText, error }: Props) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={globalStyles.textDark}>{label}</Text>
      <TextInput
        style={[
          globalStyles.input,
          error && { borderColor: "#FF4242" }, 
        ]}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
      />
      {error && <Text style={globalStyles.errorText}>{error}</Text>}
    </View>
  );
}
