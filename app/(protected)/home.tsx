import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { Text, View, KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet, ScrollView } from "react-native";
import { globalStyles } from "../../theme/globalStyles";
import Header from "../../components/UI/Header";
import BottomTabs from "../../components/UI/BottomTabs";
import Posts from "../../components/Posts";

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

      <ScrollView contentContainerStyle={[globalStyles.container, { paddingBottom: 100 }]}>
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeText}>
            <Text style={styles.bold}>Je bent niet alleen.</Text>
            {"\n\n"}
            Leven met diabetes is soms een echte achtbaan – van hypers naar hypo's, van frustratie tot focus. Het is normaal dat je je soms
            overweldigd voelt, alsof je in een karretje zit dat alle kanten op schiet.{"\n\n"}
            Maar weet je?{"\n\n"}
            <Text style={styles.bold}>Jij zit niet alleen in dat karretje.</Text>
            {"\n\n"}
            Deze app is er om samen met jou de bochten te nemen, om verhalen te delen en om af en toe even stil te staan.{"\n\n"}
            
          </Text>
        </View>

        <Posts />
      </ScrollView>

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
  welcomeBox: {
    backgroundColor: "#c09e5f",
    padding: 20,
    fontWeight: "bold",
    borderRadius: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    textAlign: "center"
  },
  bold: {
    fontWeight: "bold",
  },
  quote: {
    fontStyle: "italic",
    color: "#555",
    fontSize: 12
  },
});
