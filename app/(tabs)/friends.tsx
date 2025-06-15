import React, { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, TextInput, Image } from "react-native";
import { supabase } from "../../lib/supabase";
import { AuthContext } from "../../context/AuthContext";
import { globalStyles } from "../../theme/globalStyles";
import Header from "../../components/UI/Header";
import { theme } from "../../theme/theme";

export default function Friends() {
  const { user } = useContext(AuthContext);

  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
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

  useEffect(() => {
    setFilteredUsers(allUsers.filter(u => u.username?.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [searchQuery, allUsers]);

  async function loadUsers() {
    if (!user) return;
    const { data, error } = await supabase.from("profiles").select("id, username, avatar_url").neq("id", user.id);

    if (error) Alert.alert("Fout bij ophalen gebruikers", error.message);
    else setAllUsers(data || []);
  }

  async function loadFriendRequests() {
    if (!user) return;
    const { data } = await supabase
      .from("friends")
      .select("*, requester:profiles!friends_requester_id_fkey(id, username, avatar_url)")
      .eq("receiver_id", user.id)
      .eq("status", "pending");

    setFriendRequests(data || []);
  }

  async function loadSentRequests() {
    if (!user) return;
    const { data } = await supabase.from("friends").select("receiver_id").eq("requester_id", user.id).eq("status", "pending");

    if (data) {
      setSentRequests(data.map(r => r.receiver_id));
    }
  }

  async function loadFriends() {
    if (!user) return;
    const { data } = await supabase.rpc("get_friends", { current_user_id: user.id });
      setFriends(data || []);
      
    }
    
    

  async function sendFriendRequest(toId: string) {
    if (!user || sentRequests.includes(toId)) return;

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

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Bezig met laden...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header variant="default" />
      <View style={[globalStyles.container, { flex: 1 }]}>
        <Text style={globalStyles.titleL}>Nieuwe vrienden uitnodigen</Text>

        <TextInput placeholder="Zoek op naam..." value={searchQuery} onChangeText={setSearchQuery} style={styles.searchInput} />

        <FlatList
          data={filteredUsers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <View style={styles.userInfo}>
                <Image source={{ uri: item.avatar_url || `https://api.dicebear.com/9.x/notionists/png?seed=${item.id}` }} style={styles.avatar} />
                <Text style={styles.username}>{item.username}</Text>
              </View>
              {sentRequests.includes(item.id) ? (
                <Text style={styles.invited}>Uitnodiging verzonden</Text>
              ) : (
                <TouchableOpacity onPress={() => sendFriendRequest(item.id)}>
                  <Text style={styles.addButton}>+ Voeg toe</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />

        <Text style={globalStyles.titleL}>Vriendverzoeken</Text>
        {friendRequests.map(req => (
          <View key={req.id} style={styles.row}>
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
          </View>
        ))}

        <Text style={globalStyles.titleL}>Je vrienden</Text>
        {friends.map(friend => (
          <View key={friend.id} style={styles.userCard}>
            <View style={styles.userInfo}>
              <Image source={{ uri: friend.avatar_url || `https://api.dicebear.com/9.x/notionists/png?seed=${friend.id}` }} style={styles.avatar} />
              <Text style={styles.username}>👥 {friend.username}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
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
});
