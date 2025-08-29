import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from "react-native";
import { globalStyles } from "../../theme/globalStyles";
import { theme } from "../../theme/theme";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { TopicChip } from "../../components/TopicChips";

type Profile = {
  id: string;
  username: string | null;
  birthdate: string | null;
  since_diabetes: string | null;
  interests: string[] | null;
  avatar_url: string | null;
  onboarding_complete?: boolean | null;
  accepted_terms?: boolean | null;
  updated_at?: string | null;
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loading: userLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();

      if (error) Alert.alert("Fout", error.message);
      setProfile(data as Profile);
      setLoading(false);
    })();
  }, [user]);

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

  const dateOrDash = (s: string | null | undefined) => s ?? "—";

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={[globalStyles.container, { paddingTop: 40, paddingBottom: 40 }]}>
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <Image
            source={profile?.avatar_url ? { uri: profile.avatar_url } : require("../../assets/app_logo.png")}
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              marginBottom: 8,
              borderWidth: 2,
              borderColor: theme.colors.primary,
              backgroundColor: "#eee",
            }}
          />
        </View>

        <Text style={globalStyles.titleL}>{profile?.username || "—"}</Text>
        <Text style={globalStyles.textDark}>E-mail: {user.email}</Text>
        <Text style={globalStyles.textDark}>Geboortedatum: {dateOrDash(profile?.birthdate)}</Text>
        <Text style={globalStyles.textDark}>Sinds diabetes: {dateOrDash(profile?.since_diabetes)}</Text>

        <Text style={[globalStyles.textDark, { marginTop: 12 }]}>Interesses:</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 6 }}>
          {(profile?.interests ?? []).length ? (
            (profile?.interests ?? []).map(i => (
              <View key={i} style={{ margin: 4 }}>
               
                <TopicChip label={i} active disabled size="sm" />
              </View>
            ))
          ) : (
            <Text style={globalStyles.textDark}>—</Text>
          )}
        </View>

        <TouchableOpacity style={[globalStyles.button, { marginTop: 24 }]} onPress={() => router.push("/profile/edit")}>
          <Text style={globalStyles.buttonText}>Bewerk profiel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
