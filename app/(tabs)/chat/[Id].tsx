import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { AuthContext } from "../../../context/AuthContext";
import { theme } from "../../../theme/theme";

type Message = {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  inserted_at?: string;
};

type User = {
  id: string;
  username: string;
  avatar_url: string;
};

export default function ChatDetail() {
  const { id } = useLocalSearchParams();
  const chatId = typeof id === "string" ? id : id?.[0];
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatPartner, setChatPartner] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef<FlatList<Message>>(null);

  // ✅ Realtime en initiële fetch
  useEffect(() => {
    if (!chatId || !user) return;

    fetchChatPartner();
    fetchMessages();

    const channel = supabase
      .channel(`chat_messages_${chatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${chatId}`,
        },
        payload => {
          const newMsg = payload.new as Message;
          setMessages(prev => {
            const alreadyExists = prev.some(m => m.id === newMsg.id);
            return alreadyExists ? prev : [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, user]);

  // ✅ Ophalen berichten
  async function fetchMessages() {
    console.log("[ChatDetail] Start fetchMessages()");


    const { data, error } = await supabase.from("messages").select("*").eq("chat_id", chatId).order("inserted_at", { ascending: true });

    if (error) {
      console.error("Fout bij ophalen berichten:", error.message);
      return;
    }
    console.log("[ChatDetail] Berichten opgehaald:", data);
    setMessages(data || []);
  }

  // ✅ Partner ophalen
  async function fetchChatPartner() {
    console.log("[ChatDetail] Start fetchChatPartner() met chatId:", chatId);
    const { data, error } = await supabase
      .from("chats")
      .select("id, user1_id, user2_id, user1:profiles!user1_id(id, username, avatar_url), user2:profiles!user2_id(id, username, avatar_url)")
      .eq("id", chatId)
      .single();

    if (error || !data) {
      console.error("Fout bij ophalen chatpartner:", error?.message);
      return;
    }

    console.log("[ChatDetail] Chatpartner raw data:", data);

    const isUser1 = data.user1_id === user?.id;
    const partner = isUser1 ? data.user2 : data.user1;
    setChatPartner(Array.isArray(partner) ? partner[0] : partner);
    
  }

  // ✅ Bericht verzenden
  async function sendMessage() {
    if (!newMessage.trim() || !user || !chatId) return;

    const { error } = await supabase.from("messages").insert({
      chat_id: chatId,
      sender_id: user.id,
      content: newMessage.trim(),
    });

    if (error) {
      console.error("Fout bij versturen:", error.message);
    } else {
      setNewMessage(""); // Laat realtime het bericht toevoegen
    }
  }

  if (!chatPartner) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chat aan het laden...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: chatPartner.avatar_url || `https://api.dicebear.com/9.x/notionists/png?seed=${chatPartner.id}` }}
          style={styles.avatar}
        />
        <Text style={styles.headerTitle}>{chatPartner.username}</Text>
      </View>

      {/* Chat berichten */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isMine = item.sender_id === user?.id;
          return (
            <View style={[styles.message, isMine ? styles.myMessage : styles.theirMessage]}>
              <Text style={isMine ? styles.myText : styles.theirText}>{item.content}</Text>
            </View>
          );
        }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={{ paddingBottom: 12 }}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput value={newMessage} onChangeText={setNewMessage} placeholder="Typ een bericht..." style={styles.input} />
        <TouchableOpacity onPress={sendMessage}>
          <Text style={styles.send}>Verzend</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eee",
  },
  message: {
    margin: 8,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  myMessage: {
    backgroundColor: theme.colors.primary,
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },
  myText: {
    color: "#fff",
  },
  theirText: {
    color: theme.colors.textDark,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    backgroundColor: "#f9f9f9",
  },
  send: {
    color: theme.colors.primary,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
