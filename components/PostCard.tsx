import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { globalStyles } from "../theme/globalStyles";
import { theme } from "../theme/theme";
import { TOPICS } from "../constants/topics";
import { TopicChip } from "./TopicChips";

type Props = { post: any; onPress?: () => void };

export default function PostCard({ post, onPress }: Props) {
  const authorObj = post?.author ?? post?.profiles ?? null;

  const name: string = authorObj?.username ?? post?.author_username ?? authorObj?.full_name ?? post?.author_full_name ?? "Onbekende gebruiker";

  const avatarUrl: string | null = authorObj?.avatar_url ?? post?.author_avatar_url ?? null;

  const initials =
    (name || "?")
      .split(" ")
      .map((x: string) => x?.[0] || "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const topicKey: string | undefined = post?.topic;
  const tdef = topicKey ? TOPICS.find(x => x.key === topicKey) : null;
  const topicLabel = tdef?.label ?? topicKey ?? null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[globalStyles.card, styles.card]} 
    >
     
      <View style={styles.headerRow}>
        <View style={styles.leftWrap}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarFallbackTxt}>{initials}</Text>
            </View>
          )}
          <View style={styles.nameCol}>
            <Text style={[globalStyles.textDark, styles.name]} numberOfLines={1}>
              {name}
            </Text>
            {post?.created_at ? <Text style={styles.meta}>{formatWhen(post.created_at)}</Text> : null}
          </View>
        </View>

        {topicLabel ? (
          <View style={styles.rightWrap}>
            <TopicChip
              label={topicLabel}
              topicKey={topicKey}
              bgColor={tdef?.color}
              active
              disabled
              size="xs" 
            />
          </View>
        ) : null}
      </View>

      {post?.title ? (
        <Text style={[globalStyles.titleS, { marginTop: 6 }]} numberOfLines={2}>
          {post.title}
        </Text>
      ) : null}
      {post?.content ? <Text style={[globalStyles.textDark, { marginTop: 4 }]}>{post.content}</Text> : null}
    </TouchableOpacity>
  );
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  const diff = Math.max(0, Date.now() - d.getTime());
  const m = Math.floor(diff / 60000);
  if (m < 1) return "zojuist";
  if (m < 60) return `${m} min geleden`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} u geleden`;
  const days = Math.floor(h / 24);
  return `${days} d geleden`;
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    alignSelf: "center",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  leftWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexShrink: 1,
    minWidth: 0, 
  },
  nameCol: {
    flexShrink: 1,
    minWidth: 0,
  },
  rightWrap: {
    marginLeft: theme.spacing.sm, 
    alignItems: "flex-end",
    justifyContent: "center",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEE",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatarFallback: {
    backgroundColor: theme.colors.backgroundColor,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackTxt: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  name: { fontWeight: "bold" },
  meta: {
    marginTop: 2,
    fontSize: theme.font.size.sm,
    color: theme.colors.textDark,
    opacity: 0.7,
  },
});
