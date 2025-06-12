import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { globalStyles } from "../theme/globalStyles";
import { useRouter } from "expo-router";
import Error from "../components/Error"; 

export default function AccountScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    getProfile();
  }, [user]);

  async function getProfile() {
    try {
      setLoading(true);
      setError(null);
      if (!user) throw "Geen gebruiker gevonden!";
      const { data, error } = await supabase.from("profiles").select("username, age").eq("user_id", user.id).single();
      if (error) throw error.message;
      if (data) {
        setUsername(data.username ?? "");
        setAge(data.age ?? "");
      }
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err && typeof err === "object" && "message" in err && typeof (err as any).message === "string"
          ? (err as any).message
          : "Onbekende fout"
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      setError(null);
      if (!user) throw "Geen gebruiker gevonden!";
      const updates = {
        user_id: user.id,
        username,
        age,
        updated_at: new Date(),
      };
      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error.message;
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err && typeof err === "object" && "message" in err && typeof (err as any).message === "string"
          ? (err as any).message
          : "Onbekende fout"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/auth/login");
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Account</Text>
      {/* Render component hier, NOOIT new Error(...)! */}
      <Error error={error} />

      <Text style={globalStyles.textDark}>Gebruikersnaam</Text>
      <TextInput style={globalStyles.input} value={username} onChangeText={setUsername} editable={!loading} />

      <Text style={globalStyles.textDark}>Leeftijd</Text>
      <TextInput style={globalStyles.input} value={age} onChangeText={setAge} keyboardType="numeric" editable={!loading} />

      <TouchableOpacity style={globalStyles.button} onPress={updateProfile} disabled={loading}>
        <Text style={globalStyles.buttonText}>{loading ? "Bezig..." : "Opslaan"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.button} onPress={handleLogout} disabled={loading}>
        <Text style={globalStyles.buttonText}>Uitloggen</Text>
      </TouchableOpacity>
    </View>
  );
}
