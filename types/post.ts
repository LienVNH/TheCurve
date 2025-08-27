export type Topic = "sport" | "reizen" | "voeding" | "hypos" | "hypers" | "school" | "werk" | "relaties" | "technologie";

export type Post = {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  image_url: string | null; 
  topic: Topic;
  created_at: string;
};
