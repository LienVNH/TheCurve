import React, { useState, useEffect, useContext, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert, Linking, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { AuthContext } from "../../../context/AuthContext";
import { theme } from "../../../theme/theme";
import { Ionicons } from "@expo/vector-icons";
import { Filter as FilterLib } from "bad-words";

export default function ChatDetail() {
  const { chatId: rawId } = useLocalSearchParams();
  const chatId = Array.isArray(rawId) ? rawId[0] : rawId;

  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [chatPartner, setChatPartner] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!chatId || !user) return;

    loadMessages();
    fetchPartner();

    const channel = supabase
      .channel("messages")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, payload => {
        if (payload.new.chat_id === chatId) {
          setMessages(prev => [...prev, payload.new]);
          setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, user]);

  async function loadMessages() {
    const { data, error } = await supabase.from("messages").select("*").eq("chat_id", chatId).order("created_at", { ascending: true });

    if (error) Alert.alert("Fout bij laden", error.message);
    else setMessages(data || []);
  }

  async function fetchPartner() {
    const { data, error } = await supabase
      .from("chats")
      .select("*, user1:profiles!user1_id(id, username), user2:profiles!user2_id(id, username)")
      .eq("id", chatId)
      .single();

    if (!error && data && user) {
      if (data.user1 && data.user2) {
        const partner = data.user1.id === user.id ? data.user2 : data.user1;
        setChatPartner(partner);
      }
    }
  }

  async function sendMessage() {
    if (!user) return;

    const filter = new FilterLib();
    filter.addWords("kut", "klootzak", "lul", "tering", "hoer", "slet", "eikel", "wijf", "mongool", "debiel");

    const trimmed = input.trim();
    if (!trimmed) return;

    if (filter.isProfane(trimmed)) {
      Alert.alert("Oeps...", "Je bericht bevat ongepaste taal.");
      return;
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        chat_id: chatId,
        sender_id: user.id,
        content: trimmed,
      })
      .select("*")
      .single();

    if (error) Alert.alert("Fout bij verzenden", error.message);
    else {
      setMessages(prev => [...prev, data]);
      setInput("");
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  function reportChat() {
    const subject = encodeURIComponent("Melding van wangedrag in privéchat");
    const body = encodeURIComponent(
      `
Gebruiker ${user?.email} wil wangedrag melden in chat ${chatId} met ${chatPartner?.username}.

Voeg hier je beschrijving toe:
...`.trim()
    );
    const mailto = `mailto:admin@yourdomain.com?subject=${subject}&body=${body}`;
    Linking.openURL(mailto);
  }

  const renderMessage = ({ item }: any) => (
    <View style={[styles.bubble, user && item.sender_id === user.id ? styles.bubbleRight : styles.bubbleLeft]}>
      <Text style={styles.bubbleText}>{item.content}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{chatPartner?.username || "Chat"}</Text>
        <TouchableOpacity onPress={reportChat}>
          <Ionicons name="alert-circle" size={24} color={theme.colors.danger} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 12 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      <View style={styles.inputContainer}>
        <TextInput value={input} onChangeText={setInput} style={styles.input} placeholder="Typ een bericht..." />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "backgroundColor",
  },
  header: {
    padding: 16,
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: theme.colors.textLight,
    fontSize: 18,
    fontWeight: "bold",
  },
  bubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  bubbleLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
  },
  bubbleRight: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.primary,
  },
  bubbleText: {
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
