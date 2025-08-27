import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Post } from "../types/post";
import { TOPICS } from "../constants/topics";
import { getLibraryPublicUrl } from "../services/imageLibrary";

export default function PostCard({ post, onPress }: { post: Post; onPress?: () => void }) {
  const topic = TOPICS.find(t => t.key === post.topic);
  const uri = post.image_url ? getLibraryPublicUrl(post.image_url) : null;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.card}>
      {!!uri && <Image source={{ uri }} style={styles.thumb} />}
      <View style={{ flex: 1 }}>
        <View style={styles.topic}>
          <Text style={styles.topicTxt}>
            {topic?.emoji} {topic?.label}
          </Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
        {!!post.content && (
          <Text style={styles.excerpt} numberOfLines={2}>
            {post.content}
          </Text>
        )}
        <Text style={styles.date}>{new Date(post.created_at).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  thumb: { width: 70, height: 70, borderRadius: 10, backgroundColor: "#eee" },
  topic: {
    alignSelf: "flex-start",
    backgroundColor: "#F4F8F2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  topicTxt: { fontSize: 12, fontWeight: "600" },
  title: { fontSize: 16, fontWeight: "700" },
  excerpt: { fontSize: 13, marginTop: 2, color: "#555" },
  date: { fontSize: 12, color: "#777", marginTop: 8 },
});
