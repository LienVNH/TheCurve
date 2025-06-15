import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { Text, View, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet } from "react-native";
import { globalStyles } from "../../theme/globalStyles";
import Header from "../../components/UI/Header";
import BottomTabs from "../../components/UI/BottomTabs";

export default function Home() {
  const { user } = useContext(AuthContext);
  type Profile = { username?: string } | null;
  const [profile, setProfile] = useState<Profile>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          setProfile(data);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading || !profile) {
    return (
      <View style={[globalStyles.container, styles.center]}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
      <Header variant="personal" />

      <View style={[globalStyles.container, styles.center]}>
        <Text style={globalStyles.textDark}>Welkom {profile?.username || user?.email}!</Text>
      </View>

      <BottomTabs />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
