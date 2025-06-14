import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { Text, View } from "react-native";
import { KeyboardAvoidingView, Platform } from "react-native";
import { globalStyles } from "../../theme/globalStyles";
import Header from "../../components/UI/Header";

export default function Home() {
  const { user } = useContext(AuthContext);
  type Profile = { username?: string } | null;
  const [profile, setProfile] = useState<Profile>(null);

  useEffect(() => {
    if (user?.id) {
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
        .then(({ data }) => setProfile(data));
    }
  }, [user]);

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}>
      <Header variant="personal" />
          
        <View style={[globalStyles.container, { flex: 1, justifyContent: "center" }]}>
      <Text>Welkom {profile?.username || user?.email}!</Text>
      </View>
    </KeyboardAvoidingView>
  );
}
