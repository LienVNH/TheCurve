import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TextInput, FlatList, SafeAreaView, ActivityIndicator, RefreshControl, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { fetchPostsWithAuthor } from "../../services/posts";
import TopicChips from "../../components/TopicChips";
import PostCard from "../../components/PostCard";
import type { Topic } from "../../types/post";
import { globalStyles } from "../../theme/globalStyles";


const PAGE_SIZE = 12;

export default function Buzz() {
  const router = useRouter();
  const [topic, setTopic] = useState<Topic | "all">("all");
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<any[]>([]); // PostWithAuthor[] maar laat 'any' om type-mismatch met PostCard te vermijden
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const loadingRef = useRef(false);
  const typingTimer = useRef<number | null>(null);

  const load = useCallback(
    async ({ reset = false } = {}) => {
      if (loadingRef.current) return;
      if (!hasMore && !reset) return;

      loadingRef.current = true;
      try {
        const nextPage = reset ? 0 : page;
        // Haalt posts en auteur (naam/avatar) op, met filters & paginatie
        const items = await fetchPostsWithAuthor({
          topic,
          search,
          page: nextPage,
        });

        setPosts(prev => {
          const base = reset ? [] : prev;
          const map = new Map(base.map((p: any) => [p.id, p]));
          for (const it of items) map.set(it.id, it);
          return Array.from(map.values());
        });

        setHasMore(items.length > 0 && items.length % PAGE_SIZE === 0);
        setPage(nextPage + 1);
      } finally {
        loadingRef.current = false;
      }
    },
    [topic, search, page, hasMore]
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      await load({ reset: true });
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    load({ reset: true });
  }, [topic, load]);

  useEffect(() => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => load({ reset: true }), 350);
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, [search, load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load({ reset: true });
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={[globalStyles.container, styles.center]}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ListHeaderComponent={
          <View style={[globalStyles.container, { paddingVertical: 12, gap: 10 }]}>
            <Text style={globalStyles.titleL}>Posts</Text>

            <TopicChips current={topic} onChange={setTopic} />

            <TextInput placeholder="Waar wil je over lezen?" value={search} onChangeText={setSearch} style={globalStyles.input} />
          </View>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item} // PostWithAuthor werkt prima zolang PostCard onbekende velden negeert
            onPress={() => {
              /* detail later */
            }}
          />
        )}
        onEndReachedThreshold={0.25}
        onEndReached={() => load()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity style={[globalStyles.button, styles.fabButtonShape]} onPress={() => router.push("/post/new")}>
        <Text style={globalStyles.buttonText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: "center", alignItems: "center", flex: 1 },
  fabButtonShape: {
    position: "absolute",
    right: 15,
    bottom: 24,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
});
