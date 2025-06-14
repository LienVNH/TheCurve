// theme/globalStyles.ts
import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
    padding: theme.spacing.lg,
  },

  titleXL: {
    marginTop: 10,
    color: theme.colors.primary,
    fontSize: theme.font.size.xl,
    fontWeight: "bold",
    marginBottom: theme.spacing.lg,
  },
  titleL: {
    marginTop: 30,
    color: theme.colors.primary,
    fontSize: theme.font.size.lg,
    fontWeight: "bold",
    marginBottom: theme.spacing.md,
  },
  titleM: {
    color: theme.colors.primary,
    fontSize: theme.font.size.md,
    fontWeight: "bold",
    marginBottom: theme.spacing.md,
  },
  titleS: {
    color: theme.colors.primary,
    fontSize: theme.font.size.sm,
    fontWeight: "bold",
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    color: theme.colors.textDark,
    fontWeight: "medium",
    fontSize: theme.font.size.md,
    marginTop: theme.spacing.md,
  },
  textDark: {
    fontWeight: "medium",
    color: theme.colors.textDark,
    fontSize: theme.font.size.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    borderColor: theme.colors.border,
    color: theme.colors.textDark,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    marginVertical: theme.spacing.sm,
  },
  buttonText: {
    color: theme.colors.textLight,
    fontSize: theme.font.size.md,
    fontWeight: "bold",
  },
  card: {
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.white,
    marginVertical: theme.spacing.sm,
  },
  link: {
    fontSize: theme.font.size.md,
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: theme.colors.primary,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: theme.font.size.sm,
    marginTop: theme.spacing.xs,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    marginVertical: theme.spacing.sm,
  },
  buttonPrimaryText: {
    color: theme.colors.textLight,
    fontSize: theme.font.size.md,
    fontWeight: "bold",
  },
  buttonSuccess: {
    backgroundColor: theme.colors.succes,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    marginVertical: theme.spacing.sm,
  },
  buttonSuccessText: {
    color: theme.colors.textDark,
    fontSize: theme.font.size.md,
    fontWeight: "bold",
  },
  buttonWarning: {
    backgroundColor: theme.colors.warning,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    marginVertical: theme.spacing.sm,
  },
  buttonWarningText: {
    color: theme.colors.textDark,
    fontSize: theme.font.size.md,
    fontWeight: "bold",
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
  },
  iconButtonSuccess: {
    backgroundColor: theme.colors.succes,
  },
  iconButtonWarning: {
    backgroundColor: theme.colors.warning,
  },
});
