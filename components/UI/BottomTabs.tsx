import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../theme/theme";

export default function BottomTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { label: "Profiel", icon: "person-outline", route: "/profile" },
    { label: "Vrienden", icon: "people-outline", route: "/friends" },
    { label: "Chats", icon: "chatbubble-outline", route: "/chats" },
    { label: "Meer", icon: "menu-outline", route: "/more" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = pathname.startsWith(tab.route);
        return (
          <TouchableOpacity key={tab.route} onPress={() => router.push(tab.route)} style={styles.tab}>
            <Ionicons name={tab.icon as any} size={22} color={isActive ? "greenLight" : "#ccc"} />
            <Text style={[styles.label, { color: isActive ? "#fff" : "#ccc" }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    backgroundColor: theme.colors.primary,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  tab: {
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
