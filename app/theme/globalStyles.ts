import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const globalStyles = StyleSheet.create({
  // Layout containers
  container: {
    flex: 1,
    backgroundColor: theme.colors.greenDark,
    padding: theme.spacing.lg,
  },
  lightContainer: {
    flex: 1,
    backgroundColor: theme.colors.yellowLightest,
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.yellow,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    ...theme.shadow.card,
  },
  // Typography
  title: {
    color: theme.colors.textLight,
    fontSize: theme.font.size.xl,
    fontWeight: "bold",
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    color: theme.colors.textLight,
    fontSize: theme.font.size.lg,
    fontWeight: "500",
    marginBottom: theme.spacing.sm,
  },
  text: {
    color: theme.colors.textLight,
    fontSize: theme.font.size.md,
    fontWeight: "400",
  },
  textDark: {
    color: theme.colors.textDark,
    fontSize: theme.font.size.md,
    fontWeight: "400",
  },
  smallText: {
    color: theme.colors.textLight,
    fontSize: theme.font.size.sm,
  },
  // Buttons
  button: {
    backgroundColor: theme.colors.greenDarkest,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    marginVertical: theme.spacing.md,
  },
  buttonText: {
    color: theme.colors.textLight,
    fontSize: theme.font.size.lg,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  
  // Checkbox
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: theme.colors.green,
    backgroundColor: theme.colors.white,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
});
