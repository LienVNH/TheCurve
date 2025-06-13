import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from "react-native";
import { globalStyles } from "../../theme/globalStyles";
import { theme } from "../../theme/theme";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { user, loading: userLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getProfile();
  }, [user]);

    async function getProfile() {
      if (!user) return;
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
    if (error) Alert.alert("Fout", error.message);
    setProfile(data);
    setLoading(false);
  }

  if (userLoading || loading) {
    return (
      <View style={[globalStyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[globalStyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={globalStyles.titleL}>Niet ingelogd</Text>
        <TouchableOpacity style={globalStyles.button} onPress={() => router.replace("/login")}>
          <Text style={globalStyles.buttonText}>Log in</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={[globalStyles.container, { paddingTop: 40 }]}>
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Image
            source={profile?.avatar_url ? { uri: profile.avatar_url } : require("../../assets/avatar-placeholder.png")}
            style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 8, borderWidth: 2, borderColor: theme.colors.primary }}
          />
        </View>
        <Text style={globalStyles.titleL}>
          {profile?.first_name} {profile?.last_name}
        </Text>
        <Text style={globalStyles.textDark}>Gebruikersnaam: {profile?.username}</Text>
        <Text style={globalStyles.textDark}>E-mail: {user.email}</Text>
        <Text style={globalStyles.textDark}>Verjaardag: {profile?.birthday}</Text>
        <Text style={globalStyles.textDark}>Sinds diabetes: {profile?.diabetes_since}</Text>
        <Text style={globalStyles.textDark}>Wat hoop je uit de app te halen?</Text>
        <Text style={globalStyles.textDark}>{profile?.what_hope}</Text>
        <TouchableOpacity style={globalStyles.button} onPress={() => router.push("/set-avatar")}>
          <Text style={globalStyles.buttonText}>Avatar wijzigen</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
