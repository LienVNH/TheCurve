import React, { useState } from "react";
import { Platform, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateSelect from "./DateSelect";

type Props = {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
};

export default function PlatformDatePicker({ label, value, onChange }: Props) {
  const [show, setShow] = useState(false);

  if (Platform.OS === "web") {
    return <DateSelect label={label} date={value} onChange={onChange} />;
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.nativeInput} onPress={() => setShow(true)}>
        <Text>{value ? value.toISOString().slice(0, 10) : `Kies ${label.toLowerCase()}`}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          mode="date"
          value={value || new Date()}
          onChange={(_, selectedDate) => {
            setShow(false);
            if (selectedDate) onChange(selectedDate);
          }}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontWeight: "600",
  },
  nativeInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
});
