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

/** Auteur data voor kaart */
export type Author = { id: string; username: string | null; avatar_url: string | null };
export type PostWithAuthor = Post & { author?: Author };

export async function fetchPostsWithAuthors(params: { topic?: Topic | "all"; search?: string; page?: number }): Promise<PostWithAuthor[]> {
  const posts = await fetchPosts(params);
  if (!posts.length) return [];

  const userIds = Array.from(new Set(posts.map(p => p.user_id)));
  const { data: profiles, error } = await supabase.from("profiles").select("id, username, avatar_url").in("id", userIds);

  if (error) throw error;
  const map = new Map((profiles ?? []).map(p => [p.id, p]));

  return posts.map(p => ({ ...p, author: map.get(p.user_id) as Author | undefined }));
}
