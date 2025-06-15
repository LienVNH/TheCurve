import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";

type Props = {
  label: string;
  date: Date | null;
  onChange: (date: Date) => void;
  minYear?: number;
  maxYear?: number;
};

export default function DateSelect({ label, date, onChange, minYear = 1950, maxYear = new Date().getFullYear() }: Props) {
  const selectedDay = date?.getDate() ?? "";
  const selectedMonth = date?.getMonth() ?? "";
  const selectedYear = date?.getFullYear() ?? "";

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);

  function updateDate(part: "day" | "month" | "year", value: number) {
    const d = selectedDay || 1;
    const m = selectedMonth !== "" ? selectedMonth : 0;
    const y = selectedYear || new Date().getFullYear();

    const newDate = new Date(y, m, d);
    if (part === "day") newDate.setDate(value);
    if (part === "month") newDate.setMonth(value);
    if (part === "year") newDate.setFullYear(value);
    onChange(newDate);
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <Picker selectedValue={selectedDay} style={styles.picker} onValueChange={v => { if (v !== "") updateDate("day", Number(v)); }}>
          <Picker.Item label="Dag" value="" />
          {days.map(d => (
            <Picker.Item key={d} label={d.toString()} value={d} />
          ))}
        </Picker>

        <Picker selectedValue={selectedMonth} style={styles.picker} onValueChange={v => { if (v !== "") updateDate("month", Number(v)); }}>
          <Picker.Item label="Maand" value="" />
          {months.map((m, i) => (
            <Picker.Item key={i} label={m} value={i} />
          ))}
        </Picker>

        <Picker selectedValue={selectedYear} style={styles.picker} onValueChange={v => { if (v !== "") updateDate("year", Number(v)); }}>
          <Picker.Item label="Jaar" value="" />
          {years.map(y => (
            <Picker.Item key={y} label={y.toString()} value={y} />
          ))}
        </Picker>
      </View>
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
  row: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
  },
  picker: {
    flex: 1,
    backgroundColor: Platform.OS === "android" ? "#fff" : undefined,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
