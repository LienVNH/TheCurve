import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { StyleSheet, View, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Input } from "@rneui/themed";
import { Session } from "@supabase/supabase-js";
import { Buttons } from "../../components/UI/Buttons";
import { globalStyles } from "../../theme/globalStyles";
import { useAuth } from "../../hooks/useAuth";

export default function Account({ session }: { session: Session }) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");


  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("Geen gebruiker in de sessie");

      const { data, error, status } = await supabase.from("profiles").select("username, website, avatar_url").eq("id", session.user.id).single();

      if (error && status !== 406) throw error;

      if (data) {
        setUsername(data.username ?? "");
        setWebsite(data.website ?? "");
        setAvatarUrl(data.avatar_url ?? "");
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }


  async function updateProfile({ username, website, avatar_url }: { username: string; website: string; avatar_url: string }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("Geen gebruiker in de sessie");

      const updates = {
        id: session.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;
      Alert.alert("Profiel opgeslagen");
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={[globalStyles.container, { flex: 1 }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }} keyboardShouldPersistTaps="handled">
          {/* E-mail (alleen-lezen) */}
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Input label="E-mail" value={session?.user?.email ?? ""} disabled />
          </View>

          {/* Username */}
          <View style={styles.verticallySpaced}>
            <Input label="Username" placeholder="Kies je gebruikersnaam" value={username} onChangeText={setUsername} />
          </View>

          {/* Website */}
          <View style={styles.verticallySpaced}>
            <Input label="Website / Link in bio" placeholder="https://" value={website} onChangeText={setWebsite} />
          </View>

          {/* Avatar URL */}
          <View style={styles.verticallySpaced}>
            <Input label="Avatar-URL" placeholder="https://…/avatar.png" value={avatarUrl} onChangeText={setAvatarUrl} />
          </View>

          {/* Actie-knoppen */}
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Buttons
              title={loading ? "Bezig..." : "Opslaan"}
              onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
              disabled={loading}
            />
          </View>

          <View style={styles.verticallySpaced}>
            <Buttons title="Afmelden" onPress={() => supabase.auth.signOut()} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  verticallySpaced: {
    paddingVertical: 8,
  },
  mt20: {
    marginTop: 20,
  },
});
