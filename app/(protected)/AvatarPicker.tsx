import React, { useState, useEffect } from "react";
import { View, Image, FlatList, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import { globalStyles } from "../../theme/globalStyles";
import { theme } from "../../theme/theme";

const AVATAR_COUNT = 10;
const AVATAR_API_URL = "https://api.dicebear.com/9.x/notionists/svg";

export default function AvatarPicker() {
  const { user } = useAuth();
  const [avatars, setAvatars] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    // Genereer 10 willekeurige avatars
    const seeds = Array.from({ length: AVATAR_COUNT }, (_, i) => `user_${i + 1}`);
    const urls = seeds.map(seed => `${AVATAR_API_URL}?seed=${seed}`);
    setAvatars(urls);
  }, []);

  async function saveAvatar() {
    if (!selected || !user) {
      Alert.alert("Selecteer eerst een avatar.");
      return;
    }

    const { error } = await supabase.from("profiles").update({ avatar_url: selected }).eq("user_id", user.id);

    if (error) {
      Alert.alert("Fout bij opslaan", error.message);
    } else {
      Alert.alert("Avatar opgeslagen!", "", [{ text: "Verder", onPress: () => console.log("Ga verder in onboarding flow") }]);
    }
  }

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => setSelected(item)} style={styles.avatarWrapper}>
      <Image source={{ uri: item }} style={[styles.avatar, selected === item && styles.selected]} />
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleL}>Kies een avatar</Text>
      <FlatList
        data={avatars}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
      <TouchableOpacity style={globalStyles.button} onPress={saveAvatar}>
        <Text style={globalStyles.buttonText}>Opslaan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: theme.spacing.sm,
    justifyContent: "center",
    paddingBottom: 20,
  },
  avatarWrapper: {
    margin: theme.spacing.sm,
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selected: {
    borderColor: theme.colors.primary,
  },
});
