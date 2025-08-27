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
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);

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

  async function fetchMessages() {
    const { data, error } = await supabase.from("messages").select("*").eq("chat_id", chatId).order("inserted_at", { ascending: true });

    if (!error && data) setMessages(data);
  }

  async function fetchChatPartner() {
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
        id, user1_id, user2_id,
        user1:profiles!user1_id(id, username, avatar_url),
        user2:profiles!user2_id(id, username, avatar_url)
      `
      )
      .eq("id", chatId)
      .single();

    if (!error && data) {
      const isUser1 = data.user1_id === user?.id;
      const partner = isUser1 ? data.user2 : data.user1;
      setChatPartner(Array.isArray(partner) ? partner[0] : partner);
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !user || !chatId) return;

    setIsSending(true);

    const { error } = await supabase.from("messages").insert({
      chat_id: chatId,
      sender_id: user.id,
      content: newMessage.trim(),
    });

    if (!error) {
      setNewMessage("");
      await fetchMessages(); // forceer herladen
      scrollToEnd();
    }

    setIsSending(false);
  }

  function scrollToEnd() {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }

  if (!chatPartner) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chat aan het laden...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 150 : 0}
    >
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
        onContentSizeChange={scrollToEnd}
        onLayout={scrollToEnd}
        contentContainerStyle={{ paddingBottom: 12, paddingTop: 8 }}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder={isSending ? "Bericht verzenden..." : "Typ een bericht..."}
          style={styles.input}
          editable={!isSending}
        />
        <TouchableOpacity onPress={sendMessage} disabled={isSending}>
          <Text style={[styles.send, isSending && { opacity: 0.4 }]}>{isSending ? "..." : "Verzend"}</Text>
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
    width: "130%",
    marginLeft: -25,
    paddingLeft: 30,
    marginRight: 0,
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
    alignItems: "center",
    marginLeft: -25,
    paddingLeft: 30,
    marginRight: -22,
    paddingRight: 19,
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
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
});