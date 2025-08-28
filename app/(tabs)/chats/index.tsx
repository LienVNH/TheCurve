import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { AuthContext } from "../../../context/AuthContext";
import { globalStyles } from "../../../theme/globalStyles";
import { theme } from "../../../theme/theme";

interface Chat {
  id: string;
  user1: {
    id: string;
    username: string;
    avatar_url: string;
  };
  user2: {
    id: string;
    username: string;
    avatar_url: string;
  };
  last_message?: string;
  last_updated?: string;
}

export default function Chats() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadChatIds, setUnreadChatIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;

    fetchChats();

    const channel = supabase
      .channel("chat_list_updates")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, payload => {
        const newMessage = payload.new;
        if (newMessage.sender_id !== user.id) {
          setUnreadChatIds(prev => new Set(prev.add(newMessage.chat_id)));
        }
        fetchChats(); // update last messages live
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  async function fetchChats() {
    if (!user) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("chats")
      .select(
        `
        id,
        last_message,
        last_updated,
        user1:profiles!user1_id(id, username, avatar_url),
        user2:profiles!user2_id(id, username, avatar_url)
      `
      )
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .order("last_updated", { ascending: false });

    if (!error && data) {
      const mapped: Chat[] = data.map((chat: any) => ({
        id: chat.id,
        last_message: chat.last_message,
        last_updated: chat.last_updated,
        user1: Array.isArray(chat.user1) ? chat.user1[0] : chat.user1,
        user2: Array.isArray(chat.user2) ? chat.user2[0] : chat.user2,
      }));
      setChats(mapped);
    }

    setLoading(false);
  }

  const renderItem = ({ item }: { item: Chat }) => {
    const other = item.user1.id === user!.id ? item.user2 : item.user1;
    const isUnread = unreadChatIds.has(item.id);
    const time = item.last_updated ? new Date(item.last_updated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

    return (
      <TouchableOpacity
        onPress={() => {
          setUnreadChatIds(prev => {
            const updated = new Set(prev);
            updated.delete(item.id);
            return updated;
          });
          router.push(`/chat/${item.id}`);
        }}
        style={styles.chatCard}
      >
        <Image source={{ uri: other.avatar_url || `https://api.dicebear.com/9.x/notionists/png?seed=${other.id}` }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.username}>{other.username}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text numberOfLines={1} style={styles.lastMessage}>
              {item.last_message}
            </Text>
            {isUnread && <View style={styles.unreadDot} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!user || loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleL}>Chats</Text>
      {chats.length === 0 ? (
        <Text style={{ marginTop: 20 }}>Geen actieve gesprekken.</Text>
      ) : (
        <FlatList data={chats} keyExtractor={item => item.id} renderItem={renderItem} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  lastMessage: {
    color: "#555",
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
    marginLeft: 6,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
