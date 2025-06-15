import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { AuthContext } from "../../../context/AuthContext";
import { theme } from "../../../theme/theme";


type Friend = {
  id: string;
  username: string;
  avatar_url?: string;
};

interface FriendsListProps {
  friends: Friend[];
}

export default function FriendsList({ friends }: FriendsListProps) {
  const { user } = useContext(AuthContext);

  async function startChat(friendId: string) {
    if (!user) return;

    const sortedIds = [user.id, friendId].sort();
    const user1 = sortedIds[0];
    const user2 = sortedIds[1];

    const { data: existingChat } = await supabase
      .from("chats")
      .select("id")
      .or(`and(user1_id.eq.${user1},user2_id.eq.${user2}),and(user1_id.eq.${user2},user2_id.eq.${user1})`)
      .maybeSingle();

    let chatId;

    if (existingChat) {
      chatId = existingChat.id;
    } else {
      const { data, error } = await supabase.from("chats").insert({ user1_id: user1, user2_id: user2 }).select().single();

      if (error || !data) {
        Alert.alert("Fout bij starten gesprek", error?.message || "Onbekende fout");
        return;
      }

      chatId = data.id;
    }

    router.push(`/chat/${chatId}`);
  }

  function reportUser(friend: Friend) {
    const subject = encodeURIComponent("Melding van wangedrag in privéchat");
    const body = encodeURIComponent(
      `
Gebruiker ${user?.email} wil wangedrag melden van ${friend.username} (${friend.id}).

Voeg hier je beschrijving toe:

...
    `.trim()
    );

    const mailto = `mailto:kolibrievnh@gmail.com?subject=${subject}&body=${body}`;
    router.push(mailto);
  }

  return (
    <View>
      {friends.map(friend => (
        <View key={friend.id} style={styles.userCard}>
          <View style={styles.userInfo}>
            <Image source={{ uri: friend.avatar_url || `https://api.dicebear.com/9.x/notionists/png?seed=${friend.id}` }} style={styles.avatar} />
            <Text style={styles.username}>{friend.username}</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => startChat(friend.id)}>
              <Text style={styles.chatButton}>💬 Start gesprek</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => reportUser(friend)}>
              <Text style={styles.reportButton}>🚨 Meld wangedrag</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    backgroundColor: "#eee",
  },
  username: {
    fontSize: 16,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  chatButton: {
    color: theme.colors.primary,
    fontWeight: "bold",
    marginBottom: 4,
  },
  reportButton: {
    color: theme.colors.danger,
    fontWeight: "bold",
  },
});
