import { SafeAreaView, View, StyleSheet, Platform } from "react-native";
import { Slot, usePathname } from "expo-router";
import BottomTabs from "../../components/UI/BottomTabs";
import Header from "../../components/UI/Header";
import { globalStyles } from "../../theme/globalStyles";
import { theme } from "../../theme/theme";

export default function TabsLayout() {
  const pathname = usePathname();

  
  let headerVariant: "default" | "personal" | "chat" = "default";
  if (pathname.includes("/tabs/profile")) headerVariant = "personal";
  if (pathname.includes("/tabs/chats/")) headerVariant = "chat";


  return (
    <SafeAreaView style={[globalStyles.container, styles.container]}>
      <View style={styles.header}>
        <Header variant={headerVariant} />
      </View>

      <View style={styles.content}>
        <Slot />
      </View>

      <View style={styles.bottomNav}>
        <BottomTabs />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "backgroundColor",
  },
  header: {
    zIndex: 1,
  },
  content: {
    flex: 1,
    marginBottom: 80,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    height: 70,
    justifyContent: "center",
    paddingBottom: Platform.OS === "ios" ? 10 : 0,
    zIndex: 2,
  },
});
