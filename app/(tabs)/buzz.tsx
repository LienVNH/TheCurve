import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, SafeAreaView, ActivityIndicator, RefreshControl, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { fetchPosts } from "../../services/posts";
import TopicChips from "../../components/TopicChips";
import PostCard from "../../components/PostCard";
import { Topic, Post } from "../../types/post";

export default function Buzz() {
  const router = useRouter();
  const [topic, setTopic] = useState<Topic | "all">("all");
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (reset = false) => {
      if (reset) {
        setPage(0);
        setHasMore(true);
        setPosts([]);
      }
      if (!hasMore && !reset) return;
      const p = reset ? 0 : page;
      const items = await fetchPosts({ topic, search, page: p });
      setPosts(prev => (reset ? items : prev.concat(items)));
      setHasMore(items.length > 0 && items.length % 12 === 0);
      setPage(p + 1);
    },
    [topic, search, page, hasMore]
  );

  useEffect(() => {
    (async () => {
      await load(true);
      setLoading(false);
    })();
  }, []);
  useEffect(() => {
    load(true);
  }, [topic]);
  useEffect(() => {
    const t = setTimeout(() => load(true), 300);
    return () => clearTimeout(t);
  }, [search]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load(true);
    setRefreshing(false);
  };

  if (loading)
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <View style={{ gap: 10, paddingVertical: 10 }}>
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 20, fontWeight: "800" }}>Buzz</Text>
            </View>
            <TopicChips current={topic} onChange={setTopic} />
            <View style={{ paddingHorizontal: 12 }}>
              <TextInput
                placeholder="Waar wil je over lezen?"
                value={search}
                onChangeText={setSearch}
                style={{ backgroundColor: "#EEF1E8", padding: 12, borderRadius: 14, borderWidth: 1, borderColor: "rgba(0,0,0,0.08)" }}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => {
              /* later detail */
            }}
          />
        )}
        onEndReachedThreshold={0.25}
        onEndReached={() => load(false)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push("/post/new")}>
        <Text style={styles.fabTxt}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1f6f3f",
    elevation: 3,
  },
  fabTxt: { color: "#fff", fontSize: 30, lineHeight: 30, marginTop: -2 },
});
