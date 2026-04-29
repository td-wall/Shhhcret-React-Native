import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Space, FontSize, Radius } from '../../constants/tokens';
import { RESTROOMS, Restroom } from '../../constants/data';
import { Stars, Tag, Chip } from '../../components/Primitives';

export default function SavedScreen() {
  const [savedIds, setSavedIds] = useState<string[]>(['gn-001', 'gn-002', 'gn-003']);
  const [sort, setSort]     = useState<'recent' | 'rating' | 'distance'>('recent');
  const [filter, setFilter] = useState<'all' | 'secret'>('all');

  const toggleSave = (id: string) =>
    setSavedIds(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  let saved = RESTROOMS.filter(r => savedIds.includes(r.id));
  if (filter === 'secret') saved = saved.filter(r => r.secret);
  if (sort === 'rating')   saved = [...saved].sort((a, b) => b.rating - a.rating);
  if (sort === 'distance') saved = [...saved].sort((a, b) => a.distance - b.distance);

  const fmtDist = (d: number) => d < 1000 ? `${d}m` : `${(d/1000).toFixed(1)}km`;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 36 }} />
        <Text style={[styles.headerMono, { color: Colors.text3 }]}>
          SAVED · {String(saved.length).padStart(2, '0')}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Title block */}
      <View style={[styles.titleBlock, { borderBottomColor: Colors.hair }]}>
        <Text style={[styles.display, { color: Colors.text }]}>저장한 장소</Text>
        <Text style={[styles.small, { color: Colors.text3, marginTop: Space.s2 }]}>
          비밀로 간직한 {saved.length}개의 화장실
        </Text>
      </View>

      {/* Filter / sort row */}
      <View style={[styles.filterRow, { borderBottomColor: Colors.hair }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: Space.s2, paddingRight: Space.s4 }}>
          {([
            { id: 'all',    label: '전체' },
            { id: 'secret', label: '🤫 비밀' },
          ] as { id: 'all' | 'secret'; label: string }[]).map(f => (
            <Chip key={f.id} active={filter === f.id} onPress={() => setFilter(f.id)} size="sm">
              {f.label}
            </Chip>
          ))}
        </ScrollView>
        <View style={{ flexDirection: 'row', gap: Space.s1 }}>
          {([
            { id: 'recent',   label: '최근' },
            { id: 'rating',   label: '평점' },
            { id: 'distance', label: '거리' },
          ] as { id: 'recent'|'rating'|'distance'; label: string }[]).map(s => (
            <TouchableOpacity key={s.id} onPress={() => setSort(s.id)} activeOpacity={0.7}
              style={[styles.sortChip, { backgroundColor: sort === s.id ? Colors.ink1000 : Colors.ink50, borderColor: sort === s.id ? Colors.ink1000 : Colors.hair }]}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: sort === s.id ? Colors.ink25 : Colors.text2 }}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={{ padding: Space.s4, gap: Space.s2, paddingBottom: 100 }}>
        {saved.map(r => (
          <SavedCard key={r.id} r={r} saved toggleSave={toggleSave} fmtDist={fmtDist} />
        ))}
        {saved.length === 0 && (
          <View style={styles.empty}>
            <Text style={{ fontSize: 48, opacity: 0.4 }}>🤫</Text>
            <Text style={[styles.emptyTitle, { color: Colors.text2 }]}>아직 저장한 곳이 없어요</Text>
            <Text style={[styles.emptyMono, { color: Colors.text3 }]}>지도에서 북마크 아이콘을 눌러보세요</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SavedCard({ r, saved, toggleSave, fmtDist }: {
  r: Restroom; saved: boolean;
  toggleSave: (id: string) => void;
  fmtDist: (d: number) => string;
}) {
  return (
    <View style={[styles.card, { backgroundColor: Colors.surface, borderColor: Colors.hair }]}>
      {/* Thumbnail */}
      <View style={[styles.thumbnail, { backgroundColor: Colors.ink100 }]}>
        <Text style={{ fontSize: 9, color: Colors.text3, fontWeight: '700' }}>{r.id.toUpperCase()}</Text>
      </View>

      {/* Info */}
      <View style={{ flex: 1, minWidth: 0, gap: Space.s1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Space.s1 }}>
          <Text style={[styles.cardName, { color: Colors.text }]} numberOfLines={1}>{r.name}</Text>
          {r.secret && <Text style={{ fontSize: 11 }}>🤫</Text>}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Space.s2 }}>
          <Stars value={r.rating} size={10} />
          <Text style={[styles.bold12, { color: Colors.text }]}>{r.rating.toFixed(1)}</Text>
          <Text style={[styles.small2, { color: Colors.text3 }]}>· {r.cleanliness}</Text>
          <Text style={[styles.mono11, { color: Colors.text3 }]}>· {fmtDist(r.distance)}</Text>
        </View>
        <Text style={[styles.mono11, { color: Colors.text3 }]} numberOfLines={1}>{r.address}</Text>
      </View>

      {/* Bookmark */}
      <TouchableOpacity onPress={() => toggleSave(r.id)} activeOpacity={0.7} style={{ padding: Space.s1, alignSelf: 'flex-start' }}>
        <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={18} color={Colors.ink1000} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Space.s4, paddingVertical: Space.s3,
  },
  headerMono: { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  titleBlock: {
    paddingHorizontal: Space.s5, paddingTop: Space.s2, paddingBottom: Space.s5,
    borderBottomWidth: 1,
  },
  display:    { fontSize: FontSize.display, fontWeight: '800', letterSpacing: -0.8, lineHeight: 32 },
  small:      { fontSize: FontSize.small },
  filterRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Space.s4, paddingVertical: Space.s3,
    borderBottomWidth: 1, gap: Space.s2,
  },
  sortChip: {
    height: 28, paddingHorizontal: Space.s2,
    borderRadius: Radius.pill, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  card: {
    padding: Space.s3, borderRadius: 12, borderWidth: 1,
    flexDirection: 'row', alignItems: 'center', gap: Space.s3,
  },
  thumbnail: {
    width: 64, height: 64, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardName:  { fontSize: 15, fontWeight: '800', letterSpacing: -0.2, flex: 1 },
  bold12:    { fontSize: 12, fontWeight: '700' },
  small2:    { fontSize: 12 },
  mono11:    { fontSize: 11 },
  empty:     { paddingVertical: 60, paddingHorizontal: Space.s6, alignItems: 'center', gap: Space.s4 },
  emptyTitle: { fontSize: 15, fontWeight: '700' },
  emptyMono:  { fontSize: 12, letterSpacing: 0.3 },
});
