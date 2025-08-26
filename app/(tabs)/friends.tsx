import React, { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput, Image, ActivityIndicator, Linking } from "react-native";
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
  const [sentRequests, setSentRequests] = useState<any[]>([]);

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
    const { data, error } = await supabase
      .from("friends")
      .select(
        `
        id,
        receiver_id,
        receiver:profiles!receiver_id(id, username, avatar_url)
      `
      )
      .eq("requester_id", user.id)
      .eq("status", "pending");

    if (error) {
      Alert.alert("Fout bij ophalen verzonden verzoeken", error.message);
      return;
    }

    setSentRequests(data?.map(r => r.receiver) || []);
  }

  async function loadFriends() {
    if (!user) return;
    const { data, error } = await supabase.rpc("get_friends", { current_user_id: user.id });
    if (error) {
      Alert.alert("Fout bij ophalen vrienden", error.message);
      return;
    }
    setFriends(data || []);
  }

  async function sendFriendRequest(toId: string, username: string) {
    if (!user || sentRequests.find(r => r.id === toId) || friends.find(f => f.id === toId)) return;

    const { data: existing } = await supabase
      .from("friends")
      .select("id")
      .or(`and(requester_id.eq.${user.id},receiver_id.eq.${toId}),and(requester_id.eq.${toId},receiver_id.eq.${user.id})`)
      .not("status", "eq", "declined")
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
      Alert.alert(`Vriendschapsverzoek verzonden naar ${username}`);
      loadUsers();
      loadSentRequests();
    }
  }

  async function respondToRequest(requestId: string, accept: boolean) {
    if (!user) return;

    if (!accept) {
      await supabase.from("friends").update({ status: "declined" }).eq("id", requestId);
      loadFriendRequests();
      return;
    }

    const { data: requestData, error: fetchError } = await supabase.from("friends").select("requester_id").eq("id", requestId).single();

    if (fetchError || !requestData) {
      Alert.alert("Fout bij ophalen verzoek", fetchError?.message || "Geen data");
      return;
    }

    const friendId = requestData.requester_id;
    const sortedIds = [user.id, friendId].sort();
    const user1 = sortedIds[0];
    const user2 = sortedIds[1];

    const { data: existingChat } = await supabase
      .from("chats")
      .select("id")
      .or(`and(user1_id.eq.${user1},user2_id.eq.${user2}),and(user1_id.eq.${user2},user2_id.eq.${user1})`)
      .maybeSingle();

    if (!existingChat) {
      await supabase.from("chats").insert({ user1_id: user1, user2_id: user2 });
    }

    await supabase.from("friends").update({ status: "accepted" }).eq("id", requestId);
    loadFriendRequests();
    loadFriends();
  }

  async function startChat(friendId: string) {
    if (!user) return;

    const sortedIds = [user.id, friendId].sort();
    const user1 = sortedIds[0];
    const user2 = sortedIds[1];

    try {
      const { data: existingChat, error } = await supabase
        .from("chats")
        .select("id")
        .or(`and(user1_id.eq.${user1},user2_id.eq.${user2}),and(user1_id.eq.${user2},user2_id.eq.${user1})`)
        .maybeSingle();

      if (error || !existingChat) {
        Alert.alert("Fout bij openen chat", error?.message || "Geen bestaande chat");
        return;
      }

      router.push(`/chat/${existingChat.id}`);
    } catch (err) {
      console.error("❌ Onverwachte fout:", err);
    }
  }

  function reportUser(friend: any) {
    const subject = encodeURIComponent("Melding van wangedrag in Applicatie tijdens een privéchat");
    const body = encodeURIComponent(
      `Gebruiker ${user?.email} wil wangedrag melden van ${friend.username} (${friend.id}).\n\nVoeg hier je beschrijving toe:\n...`
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
    u => u.username?.toLowerCase().includes(searchQuery.toLowerCase()) && !sentRequests.some(r => r.id === u.id) && !friends.some(f => f.id === u.id)
  );

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={globalStyles.container}>
        <Text style={globalStyles.titleL}>Nieuwe vrienden uitnodigen</Text>
        <TextInput placeholder="Zoek op naam..." value={searchQuery} onChangeText={setSearchQuery} style={styles.searchInput} />

        {availableUsers.map(item => (
          <View key={`new-${item.id}`} style={styles.userCard}>
            <View style={styles.userInfo}>
              <Image source={{ uri: item.avatar_url || `https://api.dicebear.com/9.x/notionists/png?seed=${item.id}` }} style={styles.avatar} />
              <Text style={styles.username}>{item.username}</Text>
            </View>
            <TouchableOpacity onPress={() => sendFriendRequest(item.id, item.username)}>
              <Text style={styles.addButton}>+ Voeg toe</Text>
            </TouchableOpacity>
          </View>
        ))}

        {sentRequests.length > 0 && (
          <>
            <Text style={globalStyles.titleL}>Verzonden verzoeken</Text>
            {sentRequests.map(req => (
              <View key={`sent-${req.id}`} style={styles.userCard}>
                <View style={styles.userInfo}>
                  <Image source={{ uri: req.avatar_url || `https://api.dicebear.com/9.x/notionists/png?seed=${req.id}` }} style={styles.avatar} />
                  <Text style={styles.username}>{req.username}</Text>
                </View>
                <Text style={styles.invited}>Verzoek verzonden</Text>
              </View>
            ))}
          </>
        )}

        <Text style={globalStyles.titleL}>Vriendverzoeken</Text>
        {friendRequests.length === 0 && <Text style={{ fontStyle: "italic" }}>Geen openstaande verzoeken.</Text>}
        {friendRequests.map(req => (
          <View key={`req-${req.id}`} style={styles.row}>
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
          <View key={`friend-${friend.id}`} style={styles.userCard}>
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
