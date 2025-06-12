import { TouchableOpacity, Text, StyleSheet } from "react-native";
import {theme } from "../../theme/theme";


const { colors } = theme;

// Primary button
export function PrimaryButton({ title, onPress }) {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={onPress}>
      <Text style={[styles.text, { color: colors.accent }]}>{title}</Text>
    </TouchableOpacity>
  );
}

// Secondary button
export function SecondaryButton({ title, onPress }) {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: colors.accent }]} onPress={onPress}>
      <Text style={[styles.text, { color: colors.primaryDark }]}>{title}</Text>
    </TouchableOpacity>
  );
}

// Success button
export function SuccessButton({ title, onPress }) {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: colors.success }]} onPress={onPress}>
      <Text style={[styles.text, { color: colors.textInvert }]}>{title}</Text>
    </TouchableOpacity>
  );
}

// Warning button
export function WarningButton({ title, onPress }) {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: colors.warning }]} onPress={onPress}>
      <Text style={[styles.text, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );
}

// Danger button
export function DangerButton({ title, onPress }) {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: colors.danger }]} onPress={onPress}>
      <Text style={[styles.text, { color: colors.textInvert }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 6,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
