import React, { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput, Image, ScrollView, ActivityIndicator, Linking } from "react-native";
import { supabase } from "../../lib/supabase";
import { AuthContext } from "../../context/AuthContext";
import { globalStyles } from "../../theme/globalStyles";
import { theme } from "../../theme/theme";
import { router } from "expo-router";

export default function Friends() {
  const { user } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    loadUsers();
    loadFriendRequests();
    loadFriends();
    loadSentRequests();

    const subscription = supabase
      .channel("friends_channel")
      .on("postgres_changes", { event: "*", schema: "public", table: "friends" }, () => {
        loadFriendRequests();
        loadFriends();
        loadSentRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  async function loadUsers() {
    if (!user) return;
    const { data, error } = await supabase.from("profiles").select("id, username, avatar_url").neq("id", user.id);
    if (error) Alert.alert("Fout bij ophalen gebruikers", error.message);
    else setAllUsers(data || []);
  }

  async function loadFriendRequests() {
    if (!user) return;
    const { data, error } = await supabase
      .from("friends")
      .select(
        `
        id,
        requester_id,
        receiver_id,
        status,
        requester:profiles!requester_id(id, username, avatar_url)
      `
      )
      .eq("receiver_id", user.id)
      .eq("status", "pending");

    if (error) {
      console.error("Fout bij ophalen vriendverzoeken:", error.message);
      Alert.alert("Fout", error.message);
      return;
    }

    setFriendRequests(data || []);
  }

  async function loadSentRequests() {
    if (!user) return;
    const { data, error } = await supabase.from("friends").select("receiver_id").eq("requester_id", user.id).eq("status", "pending");

    if (error) {
      Alert.alert("Fout bij ophalen verzonden verzoeken", error.message);
      return;
    }

    setSentRequests(data?.map(r => r.receiver_id) || []);
  }

  async function loadFriends() {
    if (!user) return;
    const { data } = await supabase.rpc("get_friends", { current_user_id: user.id });
    setFriends(data || []);
  }

  async function sendFriendRequest(toId: string) {
    if (!user || sentRequests.includes(toId)) return;

    const { data: existing } = await supabase
      .from("friends")
      .select("id")
      .eq("requester_id", user.id)
      .eq("receiver_id", toId)
      .neq("status", "declined")
      .maybeSingle();

    if (existing) {
      Alert.alert("Je hebt deze gebruiker al uitgenodigd of bent al vrienden.");
      return;
    }

    const { error } = await supabase.from("friends").insert({
      requester_id: user.id,
      receiver_id: toId,
      status: "pending",
    });

    if (error) Alert.alert("Fout bij verzenden uitnodiging", error.message);
    else {
      loadUsers();
      loadSentRequests();
    }
  }

  async function respondToRequest(requestId: string, accept: boolean) {
    const { error } = await supabase
      .from("friends")
      .update({ status: accept ? "accepted" : "declined" })
      .eq("id", requestId);

    if (error) Alert.alert("Fout bij beantwoorden", error.message);
    else {
      loadFriendRequests();
      loadFriends();
    }
  }

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

    router.push(`/${chatId}`);
  }

  function reportUser(friend: any) {
    const subject = encodeURIComponent("Melding van wangedrag in Applicatie tijdens een privéchat");
    const body = encodeURIComponent(
      `
Gebruiker ${user?.email} wil wangedrag melden van ${friend.username} (${friend.id}).

Voeg hier je beschrijving toe:

...
    `.trim()
    );

    const mailto = `mailto:Kolibrievnh@ygmail.com?subject=${subject}&body=${body}`;
    Linking.openURL(mailto);
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>Bezig met laden...</Text>
      </View>
    );
  }

  const availableUsers = allUsers.filter(
    u => u.username?.toLowerCase().includes(searchQuery.toLowerCase()) && !sentRequests.includes(u.id) && !friends.find(f => f.id === u.id)
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={[globalStyles.container, { flex: 1 }]}>
          <Text style={globalStyles.titleL}>Nieuwe vrienden uitnodigen</Text>
          <TextInput placeholder="Zoek op naam..." value={searchQuery} onChangeText={setSearchQuery} style={styles.searchInput} />

          <FlatList
            data={availableUsers}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.userCard}>
                <View style={styles.userInfo}>
                  <Image source={{ uri: item.avatar_url || `https://api.dicebear.com/9.x/notionists/png?seed=${item.id}` }} style={styles.avatar} />
                  <Text style={styles.username}>{item.username}</Text>
                </View>
                <TouchableOpacity onPress={() => sendFriendRequest(item.id)}>
                  <Text style={styles.addButton}>+ Voeg toe</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <Text style={globalStyles.titleL}>Vriendverzoeken</Text>
          {friendRequests.length === 0 && <Text style={{ fontStyle: "italic" }}>Geen openstaande verzoeken.</Text>}
          {friendRequests.map(req => (
            <View key={req.id} style={styles.row}>
              {req?.requester && (
                <>
                  <View style={styles.userInfo}>
                    <Image
                      source={{ uri: req.requester.avatar_url || `https://api.dicebear.com/9.x/notionists/png?seed=${req.requester.id}` }}
                      style={styles.avatar}
                    />
                    <Text style={styles.username}>{req.requester.username}</Text>
                  </View>
                  <View style={styles.row}>
                    <TouchableOpacity onPress={() => respondToRequest(req.id, true)}>
                      <Text style={styles.accept}>✅</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => respondToRequest(req.id, false)}>
                      <Text style={styles.decline}>❌</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ))}

          <Text style={globalStyles.titleL}>Vrienden</Text>
          {friends.map(friend => (
            <View key={friend.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                <Image source={{ uri: friend.avatar_url || `https://api.dicebear.com/9.x/notionists/png?seed=${friend.id}` }} style={styles.avatar} />
                <Text style={styles.username}>{friend.username}</Text>
              </View>
              <View>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
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
  addButton: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  invited: {
    fontStyle: "italic",
    color: "gray",
  },
  accept: {
    fontSize: 18,
    marginRight: 8,
  },
  decline: {
    fontSize: 18,
  },
  searchInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  chatButton: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.textLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    fontWeight: "bold",
    marginLeft: 8,
  },
  reportButton: {
    color: theme.colors.danger,
    marginLeft: 8,
    marginTop: 4,
    fontWeight: "bold",
  },
});
