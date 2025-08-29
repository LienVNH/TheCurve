import { Topic } from "../types/post";
import { theme } from "../theme/theme";

export type TopicDef = { key: Topic; label: string; emoji: string; color: string };

export const TOPICS: TopicDef[] = [
  { key: "reizen", label: "Reizen", emoji: "✈️", color: theme.colors.tagBackgrounds.Vrienden }, // blauw
  { key: "voeding", label: "Voeding", emoji: "🍽️", color: theme.colors.tagBackgrounds.Tips }, // geel
  { key: "hypos", label: "Hypo's", emoji: "⚡", color: theme.colors.tagBackgrounds.Ondersteuning }, // roze
  { key: "hypers", label: "Hypers", emoji: "🔥", color: theme.colors.yellow }, // zacht geel
  { key: "sport", label: "Sport", emoji: "🏃", color: theme.colors.tagBackgrounds.Sport }, // groen
  { key: "school", label: "School", emoji: "🎒", color: theme.colors.offWhite }, // neutraal
  { key: "werk", label: "Werk", emoji: "💼", color: theme.colors.greenLight }, // licht groen
  { key: "relaties", label: "Relaties", emoji: "💬", color: theme.colors.tagBackgrounds.Ondersteuning }, // roze
  { key: "technologie", label: "Tech", emoji: "📱", color: theme.colors.tagBackgrounds.Vrienden }, // blauw
];
