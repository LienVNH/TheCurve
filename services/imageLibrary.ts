import { supabase } from "../lib/supabase";
import type { Topic } from "../types/post";

export type LibraryImage = {
  id: string;
  title: string;
  topic: Topic;
  path: string;
  is_active: boolean;
  created_at: string;
};

export async function fetchLibrary(opts: { topic?: Topic | "all"; search?: string; limit?: number; offset?: number }): Promise<LibraryImage[]> {
  const { topic = "all", search = "", limit = 100, offset = 0 } = opts;
  let q = supabase.from("image_library").select("*").eq("is_active", true);
  if (topic !== "all") q = q.eq("topic", topic);
  if (search.trim()) q = q.ilike("title", `%${search.trim()}%`);

  const { data, error } = await q.order("created_at", { ascending: false }).range(offset, offset + limit - 1);
  if (error) throw error;
  return data as LibraryImage[];
}

export function getLibraryPublicUrl(path: string) {
  const { data } = supabase.storage.from("library").getPublicUrl(path);
  return data.publicUrl;
}
