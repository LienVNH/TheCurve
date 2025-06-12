
import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const globalStyles = StyleSheet.create({
  container: {
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontFamily: String(theme.text.headingFontFamily),
    fontSize: theme.text.headingSize,
    color: theme.colors.primaryDark,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
  },
  text: {
    fontFamily: String(theme.text.fontFamily),
    fontSize: theme.text.fontSize,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.button.primary.background,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },
  buttonText: {
    color: theme.colors.button.primary.text,
    fontFamily: String(theme.text.headingFontFamily),
    fontSize: theme.text.fontSize,
  },
});
