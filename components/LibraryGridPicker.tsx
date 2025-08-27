import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { TOPICS } from "../constants/topics";
import type { Topic } from "../types/post";
import { fetchLibrary, getLibraryPublicUrl, LibraryImage } from "../services/imageLibrary";

export default function LibraryGridPicker({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (img: LibraryImage) => void;
}) {
  const [topic, setTopic] = useState<Topic | "all">("all");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(false);

  const loadingRef = useRef(false);
  const reqIdRef = useRef(0);
  const debounceRef = useRef<number | null>(null);

  function mergeUnique(next: LibraryImage[]) {
    const seen = new Set<string>();
    const out: LibraryImage[] = [];
    for (const it of next) {
      if (!seen.has(it.id)) {
        seen.add(it.id);
        out.push(it);
      }
    }
    return out;
  }

  const load = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    const myReq = ++reqIdRef.current;
    setLoading(true);
    try {
      const data = await fetchLibrary({ topic, search, limit: 100 });
      if (myReq !== reqIdRef.current) return; // stale response
      setItems(mergeUnique(data)); // <-- de-dupe
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    if (visible) load();
  }, [visible]);
  useEffect(() => {
    if (!visible) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(load, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [topic, search, visible]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Text style={styles.h1}>Kies een afbeelding</Text>
        <Chips current={topic} onChange={setTopic} />
        <TextInput placeholder="Zoek op titel…" value={search} onChangeText={setSearch} style={styles.search} />
        <FlatList
          data={items}
          keyExtractor={(it, idx) => `${it.id}-${idx}`} // <-- veilige key
          numColumns={3}
          contentContainerStyle={{ padding: 10 }}
          renderItem={({ item }) => {
            const uri = getLibraryPublicUrl(item.path);
            return (
              <TouchableOpacity style={styles.cell} onPress={() => onSelect(item)}>
                <Image source={{ uri }} style={styles.img} />
                <Text numberOfLines={1} style={styles.caption}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={!loading ? <Text style={{ textAlign: "center", marginTop: 20 }}>Geen afbeeldingen</Text> : null}
        />
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeTxt}>Sluiten</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

function Chips({ current, onChange }: { current: Topic | "all"; onChange: (t: Topic | "all") => void }) {
  const all = [{ key: "all", label: "Alles", emoji: "🌀" } as any, ...TOPICS];
  return (
    <FlatList
      horizontal
      data={all}
      keyExtractor={(i: any) => `chip-${i.key}`} // expliciet prefix
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 10, gap: 8 }}
      renderItem={({ item }: any) => {
        const active = current === item.key;
        return (
          <TouchableOpacity onPress={() => onChange(item.key)} style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>
              {item.emoji} {item.label}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 18, fontWeight: "800", textAlign: "center", marginTop: 12, marginBottom: 8 },
  search: {
    marginHorizontal: 12,
    backgroundColor: "#F3F4EF",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    marginBottom: 6,
  },
  cell: { width: "31%", margin: "1%", alignItems: "center" },
  img: { width: "100%", aspectRatio: 1, borderRadius: 10, backgroundColor: "#eee" },
  caption: { fontSize: 11, marginTop: 4, maxWidth: "100%" },
  closeBtn: { position: "absolute", right: 14, bottom: 20, backgroundColor: "#1f6f3f", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14 },
  closeTxt: { color: "#fff", fontWeight: "800" },
  chip: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12, backgroundColor: "#F2F0E6", borderWidth: 1, borderColor: "rgba(0,0,0,0.08)" },
  chipActive: { backgroundColor: "#E3F2E8", borderColor: "#4D7C57" },
  chipTxt: { fontSize: 13 },
  chipTxtActive: { fontWeight: "700" },
});
