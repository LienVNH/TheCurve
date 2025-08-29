import { supabase } from "../lib/supabase";
import type { Post, Topic } from "../types/post";

const PAGE_SIZE = 12;

export async function fetchPosts({ topic, search, page = 0 }: { topic?: Topic | "all"; search?: string; page?: number }): Promise<Post[]> {
  let q = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

  if (topic && topic !== "all") q = q.eq("topic", topic);
  if (search && search.trim()) q = q.or(`title.ilike.%${search}%,content.ilike.%${search}%`);

  const { data, error } = await q;
  if (error) throw error;
  return data as Post[];
}

export async function createPost({
  userId,
  title,
  content,
  imagePath,
  topic,
}: {
  userId: string;
  title: string;
  content?: string;
  imagePath?: string;
  topic: Topic;
}) {
  const { error } = await supabase.from("posts").insert({
    user_id: userId,
    title: title.trim(),
    content: content?.trim() || null,
    image_url: imagePath || null,
    topic,
  });
  if (error) throw error;
}

export type AuthorProfile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
};
export type PostWithAuthor = Post & { author?: AuthorProfile | null };

export async function fetchPostsWithAuthor(args: { topic?: Topic | "all"; search?: string; page?: number }): Promise<PostWithAuthor[]> {
  const rows = await fetchPosts(args);
  const ids = Array.from(new Set(rows.map(r => r.user_id).filter(Boolean))) as string[];

  if (ids.length === 0) return rows as PostWithAuthor[];
  const { data: profiles, error: profErr } = await supabase.from("profiles").select("id, username, avatar_url").in("id", ids);

  if (profErr) throw profErr;

  const map = new Map<string, AuthorProfile>((profiles ?? []).map(p => [p.id, p as AuthorProfile]));
  return rows.map(r => ({ ...(r as PostWithAuthor), author: map.get(r.user_id) || null }));
}
