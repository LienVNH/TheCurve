import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "../../theme/theme";
import { AuthContext } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

export default function Header({ variant = "default", chatName = "" }: { variant?: "default" | "personal" | "chat"; chatName?: string }) {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  type Profile = { username?: string; avatar_url?: string } | null;
  const [profile, setProfile] = useState<Profile>(null);

  useEffect(() => {
    if (user?.id) {
      supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user.id)
        .single()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

  const handleLogout = async () => {
    router.replace("/");
  };

  return (
    <View style={styles.container}>
      {variant === "personal" && user ? (
        <View style={styles.row}>
          {profile?.avatar_url ? (
            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: "#ccc" }]} />
          )}
          <Text style={styles.title}>Welkom, {profile?.username || user.email}!</Text>
          <Pressable onPress={handleLogout} style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutPressed]}>
            <Text style={styles.logoutIcon}>👤</Text>
          </Pressable>
        </View>
      ) : variant === "chat" ? (
        <View style={styles.row}>
          <Text style={styles.title}>{chatName}</Text>
          <TouchableOpacity onPress={() => alert("Rapporteer dit gesprek")}>
            <Text style={styles.report}>⚠️</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.row}>
          <Image source={require("../../assets/the.png")} style={styles.logo} resizeMode="contain" />
          <Pressable onPress={handleLogout} style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutPressed]}>
            <Text style={styles.logoutIcon}>👤</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    height: 120,
    flexDirection: "row",
    marginLeft: 0,
    marginRight: 0,
    paddingRight: 35,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    position: "relative",
    width: 60,
    height: 60,
  },
  title: {
    color: "#F7F7EF",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "white", // kleur komt overeen met begroetingskleur
  },
  logoutButton: {
    backgroundColor: "primary",
    borderWidth: 2,
    borderColor: "#F7F7EF", // zachte groene achtergrond
    borderRadius: 20,
    padding: 6,
  },
  logoutPressed: {
    borderColor: "#1B4332", // donkergroen bij indrukken
    backgroundColor: "#c09e5f", // iets donkerder groen bij indrukken
  },
  logoutIcon: {
    color: "#1B4332", // donkergroen icoon
    fontSize: 20,
    fontWeight: "bold",
  },
  report: {
    color: "yellow",
    fontSize: 22,
  },
});
