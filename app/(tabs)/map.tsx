import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
  Modal, Dimensions, Pressable, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Space, FontSize, Radius } from '../../constants/tokens';
import { RESTROOMS, FILTERS, REVIEWS, Restroom } from '../../constants/data';
import { Chip, Stars, Tag, Btn, Avatar } from '../../components/Primitives';

const { width: SCREEN_W } = Dimensions.get('window');

interface Filters {
  sep?: boolean; bidet?: boolean; paper?: boolean;
  soap?: boolean; dryer?: boolean; baby?: boolean;
  __minRating?: number;
}

type ViewMode = 'map' | 'list';
type Screen   = 'map' | 'detail' | 'review' | 'addReview';

export default function MapTabScreen() {
  const [screen,    setScreen]    = useState<Screen>('map');
  const [detailId,  setDetailId]  = useState<string | null>(null);
  const [query,     setQuery]     = useState('');
  const [view,      setView]      = useState<ViewMode>('map');
  const [filters,   setFilters]   = useState<Filters>({});
  const [savedIds,  setSavedIds]  = useState<string[]>(['gn-001', 'gn-002']);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [reviewId,  setReviewId]  = useState<string | null>(null);

  const toggleSave = (id: string) =>
    setSavedIds(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const minRating = filters.__minRating ?? 0;
  const filtered = RESTROOMS.filter(r => {
    if (query && !(r.name + r.address + r.tags.join(' ')).includes(query)) return false;
    for (const k of Object.keys(filters) as (keyof Filters)[]) {
      if (k === '__minRating') continue;
      if (filters[k] && !r.facilities[k as keyof typeof r.facilities]) return false;
    }
    if (minRating > 0 && r.rating < minRating) return false;
    return true;
  });

  const openDetail = (id: string) => { setDetailId(id); setScreen('detail'); };
  const openReview = (id: string) => { setReviewId(id); setScreen('review'); };

  // ── Render ─────────────────────────────────────────────────
  if (screen === 'detail' && detailId) {
    return (
      <DetailScreen
        id={detailId}
        savedIds={savedIds}
        toggleSave={toggleSave}
        onBack={() => setScreen('map')}
        onWriteReview={(id) => openReview(id)}
      />
    );
  }
  if (screen === 'review' && reviewId) {
    return (
      <ReviewSheet
        id={reviewId}
        onClose={() => setScreen('map')}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.bg }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Space.s2, height: 44 }}>
            {/* Logo circle */}
            <View style={[styles.logoCircle, { backgroundColor: Colors.ink1000 }]}>
              <Text style={[styles.logoText, { color: Colors.ink25 }]}>ʃ</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.appName, { color: Colors.text }]}>쉬크릿</Text>
              <Text style={[styles.appMono, { color: Colors.text3 }]}>SHHH-CRET</Text>
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchRow}>
            <View style={[styles.searchBox, { backgroundColor: Colors.surface, borderColor: Colors.border }]}>
              <Ionicons name="search" size={17} color={Colors.text3} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="역, 건물, 동네로 검색"
                placeholderTextColor={Colors.text3}
                style={[styles.searchInput, { color: Colors.text }]}
              />
              {!!query && (
                <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
                  <Ionicons name="close-circle" size={16} color={Colors.text3} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              onPress={() => setShowFilter(true)}
              activeOpacity={0.8}
              style={[styles.filterBtn, { backgroundColor: Colors.ink1000 }]}
            >
              <Ionicons name="options-outline" size={18} color={Colors.ink25} />
              {Object.entries(filters).some(([k, v]) => k === '__minRating' ? (v as number) > 0 : !!v) && (
                <View style={[styles.filterDot, { backgroundColor: Colors.ink25, borderColor: Colors.ink1000 }]} />
              )}
            </TouchableOpacity>
          </View>

          {/* Quick filter chips */}
          <ScrollView
            horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: Space.s2, paddingBottom: 2, paddingTop: Space.s2 }}
          >
            {FILTERS.basics.map(f => (
              <Chip
                key={f.id}
                active={!!filters[f.id as keyof Filters]}
                onPress={() => setFilters({ ...filters, [f.id]: !filters[f.id as keyof Filters] })}
                size="sm"
              >
                {f.label}
              </Chip>
            ))}
            <Chip
              active={(filters.__minRating ?? 0) >= 4.0}
              onPress={() => setFilters({ ...filters, __minRating: (filters.__minRating ?? 0) >= 4.0 ? 0 : 4.0 })}
              size="sm"
            >
              ⭐ 4.0+
            </Chip>
          </ScrollView>
        </View>

        {/* Body */}
        <View style={{ flex: 1 }}>
          {view === 'map' ? (
            <MapView
              items={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onClearSelection={() => setSelectedId(null)}
            />
          ) : (
            <ListSheet
              items={filtered}
              savedIds={savedIds}
              toggleSave={toggleSave}
              onOpen={openDetail}
              onClose={() => setView('map')}
            />
          )}

          {/* Selected pin card (map mode only) */}
          {view === 'map' && selectedId && (() => {
            const r = filtered.find(x => x.id === selectedId) ?? RESTROOMS.find(x => x.id === selectedId);
            if (!r) return null;
            return (
              <SelectedCard
                r={r}
                saved={savedIds.includes(r.id)}
                toggleSave={toggleSave}
                onOpen={openDetail}
                onClose={() => setSelectedId(null)}
              />
            );
          })()}

          {/* List toggle button */}
          {view === 'map' && !selectedId && filtered.length > 0 && (
            <TouchableOpacity
              onPress={() => setView('list')}
              activeOpacity={0.85}
              style={[styles.listToggleBtn, { backgroundColor: Colors.surface, borderColor: Colors.border }]}
            >
              <Ionicons name="list" size={14} color={Colors.text} />
              <Text style={[styles.listToggleText, { color: Colors.text }]}>리스트로 보기</Text>
              <Text style={[styles.listToggleCount, { color: Colors.text3 }]}>{filtered.length}</Text>
            </TouchableOpacity>
          )}

          {/* FAB — add review */}
          <TouchableOpacity
            onPress={() => setScreen('addReview')}
            activeOpacity={0.85}
            style={[styles.fab, { backgroundColor: Colors.ink1000 }]}
          >
            <Ionicons name="add" size={26} color={Colors.ink25} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Filter bottom sheet */}
      <FilterSheet
        visible={showFilter}
        filters={filters}
        setFilters={setFilters}
        onClose={() => setShowFilter(false)}
      />
    </View>
  );
}

// ── MockMap ───────────────────────────────────────────────────
function MapView({ items, selectedId, onSelect, onClearSelection }: {
  items: Restroom[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClearSelection: () => void;
}) {
  return (
    <Pressable onPress={onClearSelection} style={{ flex: 1 }}>
      <View style={[styles.mapBg, { backgroundColor: Colors.ink50 }]}>
        {/* Grid lines (simulated) */}
        <View style={[styles.mapRoad1, { backgroundColor: Colors.ink200 }]} />
        <View style={[styles.mapRoad2, { backgroundColor: Colors.ink200 }]} />

        {/* Pins */}
        {items.map(r => {
          const selected = r.id === selectedId;
          const dimmed   = selectedId && !selected;
          return (
            <TouchableOpacity
              key={r.id}
              onPress={(e) => { e.stopPropagation?.(); onSelect(r.id); }}
              activeOpacity={0.8}
              style={[
                styles.pin,
                {
                  left:    `${r.x}%` as any,
                  top:     `${r.y}%` as any,
                  opacity: dimmed ? 0.45 : 1,
                  transform: [{ scale: selected ? 1.18 : 1 }],
                  zIndex: selected ? 5 : 1,
                },
              ]}
            >
              <View style={[styles.pinBubble, {
                backgroundColor: selected ? '#E85D2C' : Colors.ink1000,
                paddingHorizontal: selected ? 10 : 8,
                paddingVertical:   selected ? 6  : 4,
              }]}>
                <Ionicons name="star" size={selected ? 11 : 10} color={Colors.ink25} />
                <Text style={[styles.pinText, { color: Colors.ink25, fontSize: selected ? 12 : 11 }]}>
                  {r.rating.toFixed(1)}
                </Text>
              </View>
              {/* Pin tail */}
              <View style={[styles.pinTail, {
                borderTopColor: selected ? '#E85D2C' : Colors.ink1000,
                borderLeftWidth: selected ? 6 : 5,
                borderRightWidth: selected ? 6 : 5,
                borderTopWidth: selected ? 7 : 6,
              }]} />
            </TouchableOpacity>
          );
        })}

        {/* You-are-here dot */}
        <View style={[styles.youDot, { backgroundColor: Colors.ink1000, borderColor: Colors.ink25 }]} />

        {/* Attribution */}
        <Text style={[styles.mapAttrib, { color: Colors.text3 }]}>SHHH-CRET MAP · NOT TO SCALE</Text>
      </View>
    </Pressable>
  );
}

// ── ListSheet ─────────────────────────────────────────────────
function ListSheet({ items, savedIds, toggleSave, onOpen, onClose }: {
  items: Restroom[];
  savedIds: string[];
  toggleSave: (id: string) => void;
  onOpen: (id: string) => void;
  onClose: () => void;
}) {
  const fmtDist = (d: number) => d < 1000 ? `${d}m` : `${(d/1000).toFixed(1)}km`;
  return (
    <View style={[styles.listSheet, { backgroundColor: Colors.surface, borderTopColor: Colors.border }]}>
      {/* Drag handle */}
      <TouchableOpacity onPress={onClose} style={styles.dragHandleRow} activeOpacity={0.7}>
        <View style={[styles.dragHandle, { backgroundColor: Colors.ink200 }]} />
      </TouchableOpacity>
      <FlatList
        data={items}
        keyExtractor={r => r.id}
        contentContainerStyle={{ padding: Space.s4, gap: Space.s3, paddingBottom: 120 }}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: Colors.text3 }}>🤫 조건에 맞는 비밀 장소가 없어요</Text>
          </View>
        }
        renderItem={({ item: r }) => (
          <TouchableOpacity key={r.id} onPress={() => onOpen(r.id)} activeOpacity={0.8}
            style={[styles.listCard, { backgroundColor: Colors.surface, borderColor: Colors.hair }]}>
            <View style={[styles.listThumb, { backgroundColor: Colors.ink100 }]}>
              <Text style={{ fontSize: 9, color: Colors.text3, fontWeight: '700' }}>{r.id.toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0, gap: Space.s1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: Space.s2 }}>
                <Text style={[styles.listCardName, { color: Colors.text }]} numberOfLines={1}>{r.name}</Text>
                <Text style={[styles.listCardDist, { color: Colors.text3 }]}>{fmtDist(r.distance)}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Space.s2 }}>
                <Stars value={r.rating} size={11} />
                <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.text }}>{r.rating.toFixed(1)}</Text>
                <Text style={{ fontSize: 12, color: Colors.text3 }}>· {r.reviews}</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Space.s1, marginTop: 2 }}>
                {r.tags.slice(0, 3).map(t => <Tag key={t} tone="outline">{t}</Tag>)}
              </View>
            </View>
            <TouchableOpacity onPress={() => toggleSave(r.id)} activeOpacity={0.7}
              style={{ width: 32, alignSelf: 'flex-start', paddingTop: Space.s1, alignItems: 'center' }}>
              <Ionicons name={savedIds.includes(r.id) ? 'bookmark' : 'bookmark-outline'} size={18}
                color={savedIds.includes(r.id) ? Colors.ink1000 : Colors.text3} />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ── SelectedCard ──────────────────────────────────────────────
function SelectedCard({ r, saved, toggleSave, onOpen, onClose }: {
  r: Restroom; saved: boolean;
  toggleSave: (id: string) => void;
  onOpen: (id: string) => void;
  onClose: () => void;
}) {
  const fmtDist = (d: number) => d < 1000 ? `${d}m` : `${(d/1000).toFixed(1)}km`;
  return (
    <View style={styles.selectedCardOuter}>
      <TouchableOpacity onPress={() => onOpen(r.id)} activeOpacity={0.85}
        style={[styles.selectedCard, { backgroundColor: Colors.surface, borderColor: Colors.hair }]}>
        <View style={[styles.listThumb, { backgroundColor: Colors.ink100 }]}>
          <Text style={{ fontSize: 9, color: Colors.text3, fontWeight: '700' }}>{r.id.toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: Space.s1, paddingRight: Space.s8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: Space.s2 }}>
            <Text style={[styles.listCardName, { color: Colors.text }]} numberOfLines={1}>{r.name}</Text>
            <Text style={[styles.listCardDist, { color: Colors.text3 }]}>{fmtDist(r.distance)}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Space.s2 }}>
            <Stars value={r.rating} size={11} />
            <Text style={{ fontSize: 12, fontWeight: '700', color: Colors.text }}>{r.rating.toFixed(1)}</Text>
            <Text style={{ fontSize: 12, color: Colors.text3 }}>· {r.reviews}</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Space.s1, marginTop: 2 }}>
            {r.tags.slice(0, 3).map(t => <Tag key={t} tone="outline">{t}</Tag>)}
          </View>
        </View>
        {/* Save */}
        <TouchableOpacity onPress={() => toggleSave(r.id)} activeOpacity={0.7}
          style={styles.selectedSave}>
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={16} color={saved ? Colors.ink1000 : Colors.text3} />
        </TouchableOpacity>
        {/* Close */}
        <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.selectedClose}>
          <Ionicons name="close" size={13} color={Colors.text2} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

// ── FilterSheet ───────────────────────────────────────────────
function FilterSheet({ visible, filters, setFilters, onClose }: {
  visible: boolean;
  filters: Filters;
  setFilters: (f: Filters) => void;
  onClose: () => void;
}) {
  const minRating = filters.__minRating ?? 0;
  const levels = [0, 1, 2, 3, 4, 5];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <View style={[styles.sheet, { backgroundColor: Colors.surface }]}>
        <View style={[styles.dragHandle, { backgroundColor: Colors.ink200, alignSelf: 'center', marginBottom: Space.s4 }]} />

        <View style={styles.sheetHeader}>
          <Text style={[styles.sheetTitle, { color: Colors.text }]}>필터</Text>
          <TouchableOpacity onPress={() => setFilters({})} activeOpacity={0.7}>
            <Text style={[styles.clearText, { color: Colors.text3 }]}>모두 지우기</Text>
          </TouchableOpacity>
        </View>

        {/* Rating slider (segmented) */}
        <Text style={[styles.sectionLabel, { color: Colors.text3 }]}>최소 별점</Text>
        <View style={styles.ratingRow}>
          {levels.map(l => (
            <TouchableOpacity key={l} onPress={() => setFilters({ ...filters, __minRating: l })}
              activeOpacity={0.7}
              style={[styles.ratingBtn, {
                backgroundColor: minRating >= l && l > 0 ? Colors.ink1000 : (l === 0 && minRating === 0 ? Colors.ink1000 : Colors.ink50),
                borderColor: minRating >= l && l > 0 ? Colors.ink1000 : (l === 0 && minRating === 0 ? Colors.ink1000 : Colors.border),
              }]}>
              <Text style={[styles.ratingBtnText, {
                color: minRating >= l && l > 0 ? Colors.ink25 : (l === 0 && minRating === 0 ? Colors.ink25 : Colors.text2),
              }]}>
                {l === 0 ? '전체' : `${l}.0+`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Facilities */}
        <Text style={[styles.sectionLabel, { color: Colors.text3, marginTop: Space.s5 }]}>편의시설</Text>
        <View style={styles.facilityGrid}>
          {FILTERS.basics.map(f => {
            const on = !!filters[f.id as keyof Filters];
            return (
              <TouchableOpacity key={f.id}
                onPress={() => setFilters({ ...filters, [f.id]: !on })}
                activeOpacity={0.8}
                style={[styles.facilityBtn, {
                  backgroundColor: on ? Colors.ink1000 : Colors.ink50,
                  borderColor:     on ? Colors.ink1000 : 'transparent',
                }]}>
                <Ionicons name="checkmark-circle-outline" size={20} color={on ? Colors.ink25 : Colors.text} />
                <Text style={[styles.facilityLabel, { color: on ? Colors.ink25 : Colors.text }]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ marginTop: Space.s5 }}>
          <Btn full size="lg" onPress={onClose}>적용하기</Btn>
        </View>
      </View>
    </Modal>
  );
}

// ── DetailScreen ──────────────────────────────────────────────
function DetailScreen({ id, onBack, savedIds, toggleSave, onWriteReview }: {
  id: string;
  onBack: () => void;
  savedIds: string[];
  toggleSave: (id: string) => void;
  onWriteReview: (id: string) => void;
}) {
  const r       = RESTROOMS.find(x => x.id === id) ?? RESTROOMS[0];
  const reviews = REVIEWS[r.id] ?? REVIEWS['gn-001'] ?? [];
  const saved   = savedIds.includes(r.id);

  const fmtDist = (d: number) => d < 1000 ? `${d}M` : `${(d/1000).toFixed(1)}KM`;

  const facilities = [
    { k: 'sep',   label: '남녀분리',     icon: 'body-outline' as const },
    { k: 'bidet', label: '비데',         icon: 'water-outline' as const },
    { k: 'paper', label: '휴지',         icon: 'image-outline' as const },
    { k: 'soap',  label: '손세정제',     icon: 'sparkles-outline' as const },
    { k: 'dryer', label: '드라이어',     icon: 'leaf-outline' as const },
    { k: 'baby',  label: '기저귀대',     icon: 'happy-outline' as const },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero */}
        <View style={{ height: 280, position: 'relative' }}>
          <View style={[styles.heroPlaceholder, { backgroundColor: Colors.ink100 }]}>
            <Text style={{ fontSize: 11, color: Colors.ink500, fontWeight: '700' }}>화장실 사진 1/4</Text>
          </View>
          {/* Gradient overlay */}
          <View style={styles.heroGradient} />

          {/* Top buttons */}
          <View style={styles.heroTopRow}>
            <TouchableOpacity onPress={onBack} activeOpacity={0.85}
              style={[styles.heroBtn, { backgroundColor: 'rgba(255,255,255,0.92)' }]}>
              <Ionicons name="chevron-back" size={20} color={Colors.text} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: Space.s2 }}>
              <TouchableOpacity activeOpacity={0.85}
                style={[styles.heroBtn, { backgroundColor: 'rgba(255,255,255,0.92)' }]}>
                <Ionicons name="share-social-outline" size={18} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleSave(r.id)} activeOpacity={0.85}
                style={[styles.heroBtn, { backgroundColor: 'rgba(255,255,255,0.92)' }]}>
                <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={18} color={Colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Pagination dots */}
          <View style={styles.heroDots}>
            {[0,1,2,3].map(i => (
              <View key={i} style={[styles.heroDot, {
                width: i === 0 ? 16 : 6,
                backgroundColor: i === 0 ? Colors.ink25 : 'rgba(255,255,255,0.5)',
              }]} />
            ))}
          </View>

          {/* Secret badge */}
          {r.secret && (
            <View style={styles.secretBadge}>
              <Text style={[styles.secretText, { backgroundColor: Colors.ink1000, color: Colors.ink25 }]}>
                𓂃 SECRET
              </Text>
            </View>
          )}
        </View>

        {/* Main info */}
        <View style={{ padding: Space.s5, paddingBottom: Space.s3 }}>
          <Text style={[styles.detailName, { color: Colors.text }]}>{r.name}</Text>
          <Text style={[styles.detailSub, { color: Colors.text2 }]}>{r.sub} · {r.address}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Space.s2, marginTop: Space.s2 }}>
            <Stars value={r.rating} size={14} />
            <Text style={[styles.detailRating, { color: Colors.text }]}>{r.rating.toFixed(1)}</Text>
            <Text style={[styles.detailReviews, { color: Colors.text3 }]}>리뷰 {r.reviews}</Text>
            <Text style={[styles.detailDist, { color: Colors.text3 }]}>{fmtDist(r.distance)}</Text>
          </View>

          {/* Tags */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Space.s1, marginTop: Space.s3 }}>
            {r.tags.map(t => <Tag key={t} tone="default">{t}</Tag>)}
            <Tag tone="yellow">⏱ {r.cleanliness}</Tag>
          </View>

          {/* Quick actions */}
          <View style={styles.quickActions}>
            <Btn iconName="navigate-outline" size="sm" style={{ flex: 1 }}>길찾기</Btn>
            <Btn iconName="call-outline" variant="ghost" size="sm" style={{ flex: 1 }}>전화</Btn>
            <Btn iconName="share-social-outline" variant="ghost" size="sm" style={{ flex: 1 }}>공유</Btn>
          </View>
        </View>

        {/* Secret note */}
        {r.secret && r.note && (
          <View style={[styles.secretNote, { backgroundColor: Colors.ink1000, marginHorizontal: Space.s5 }]}>
            <Text style={{ fontSize: 18, lineHeight: 24 }}>🤫</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.secretNoteLabel, { color: Colors.ink300 }]}>SHHH-CRET TIP</Text>
              <Text style={[styles.secretNoteText, { color: Colors.ink25 }]}>{r.note}</Text>
            </View>
          </View>
        )}

        {/* Facilities */}
        <View style={[styles.facilitiesCard, { backgroundColor: Colors.surface, borderColor: Colors.hair, marginHorizontal: Space.s5 }]}>
          <Text style={[styles.microLabel, { color: Colors.text3 }]}>편의시설</Text>
          <View style={styles.facilitiesGrid}>
            {facilities.map(({ k, label, icon }) => {
              const has = r.facilities[k as keyof typeof r.facilities];
              return (
                <View key={k} style={[styles.facilityItem, { opacity: has ? 1 : 0.32 }]}>
                  <View style={[styles.facilityIcon, {
                    backgroundColor: has ? Colors.ink1000 : Colors.ink100,
                  }]}>
                    <Ionicons name={icon} size={18} color={has ? Colors.ink25 : Colors.text3} />
                  </View>
                  <Text style={[styles.facilityItemLabel, { color: has ? Colors.text : Colors.text3 }]}>{label}</Text>
                </View>
              );
            })}
          </View>
          <View style={[styles.facilitiesFooter, { borderTopColor: Colors.hair }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Space.s2 }}>
              <Ionicons name="time-outline" size={13} color={Colors.text2} />
              <Text style={[styles.facilityHours, { color: Colors.text2 }]}>{r.accessHours}</Text>
            </View>
            <Text style={[styles.facilityUpdate, { color: Colors.text3 }]}>마지막 업데이트 · 2시간 전</Text>
          </View>
        </View>

        {/* Rating breakdown */}
        <View style={{ marginTop: Space.s4, paddingHorizontal: Space.s5 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: Space.s3 }}>
            <Text style={[styles.reviewsTitle, { color: Colors.text }]}>방문자 리뷰</Text>
            <TouchableOpacity onPress={() => onWriteReview(r.id)} activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center', gap: Space.s1 }}>
              <Ionicons name="create-outline" size={14} color={Colors.text} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: Colors.text }}>리뷰 쓰기</Text>
            </TouchableOpacity>
          </View>

          {/* Summary card */}
          <View style={[styles.ratingCard, { backgroundColor: Colors.surface, borderColor: Colors.hair }]}>
            <View style={{ alignItems: 'center' }}>
              <Text style={[styles.ratingBig, { color: Colors.text }]}>{r.rating.toFixed(1)}</Text>
              <Stars value={r.rating} size={11} />
              <Text style={[styles.ratingCount, { color: Colors.text3 }]}>{r.reviews} REVIEWS</Text>
            </View>
            <View style={{ flex: 1, gap: Space.s1 }}>
              {[5,4,3,2,1].map(s => {
                const pct = s===5 ? 72 : s===4 ? 18 : s===3 ? 7 : s===2 ? 2 : 1;
                return (
                  <View key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: Space.s2 }}>
                    <Text style={{ width: 10, fontSize: 10, color: Colors.text3, fontWeight: '700' }}>{s}</Text>
                    <View style={[styles.barBg, { backgroundColor: Colors.ink100, flex: 1 }]}>
                      <View style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: Colors.ink1000 }]} />
                    </View>
                    <Text style={{ width: 24, fontSize: 10, textAlign: 'right', color: Colors.text3 }}>{pct}%</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Reviews */}
        <View style={{ padding: Space.s5, paddingTop: Space.s3, gap: Space.s3 }}>
          {reviews.map(rv => (
            <View key={rv.id} style={[styles.reviewCard, { backgroundColor: Colors.surface, borderColor: Colors.hair }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Space.s2 }}>
                <Avatar initial={rv.initial} size={32} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.reviewUser, { color: Colors.text }]}>{rv.user}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Space.s2, marginTop: 2 }}>
                    <Stars value={rv.rating} size={10} />
                    <Text style={[styles.reviewTime, { color: Colors.text3 }]}>{rv.time}</Text>
                  </View>
                </View>
                <TouchableOpacity activeOpacity={0.7}>
                  <Ionicons name="ellipsis-horizontal" size={18} color={Colors.text3} />
                </TouchableOpacity>
              </View>
              <Text style={[styles.reviewText, { color: Colors.text }]}>{rv.text}</Text>
              {rv.tags?.length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Space.s1, marginTop: Space.s2 }}>
                  {rv.tags.map(t => <Tag key={t} tone="outline">#{t}</Tag>)}
                </View>
              )}
              <View style={[styles.reviewFooter, { borderTopColor: Colors.hair }]}>
                <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: 'row', gap: Space.s1 }}>
                  <Text style={[styles.reviewAction, { color: Colors.text2 }]}>👍 {rv.helpful}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={[styles.reviewAction, { color: Colors.text2 }]}>답글</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── ReviewSheet ───────────────────────────────────────────────
function ReviewSheet({ id, onClose }: { id: string; onClose: () => void }) {
  const r = RESTROOMS.find(x => x.id === id) ?? RESTROOMS[0];
  const [rating, setRating] = useState(0);
  const [text,   setText]   = useState('');
  const [tags,   setTags]   = useState<string[]>([]);
  const [secret, setSecret] = useState(false);
  const quickTags = ['깨끗함', '한가함', '향기 좋음', '넓음', '비데 좋음', '조용함'];

  const ratingLabels = ['', '별로...', '그저그래요', '괜찮아요', '좋아요', '최고에요!'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <View style={[styles.reviewSheetHeader, { borderBottomColor: Colors.hair }]}>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
          <Text style={[styles.cancelText, { color: Colors.text2 }]}>취소</Text>
        </TouchableOpacity>
        <Text style={[styles.reviewSheetTitle, { color: Colors.text }]}>리뷰 쓰기</Text>
        <TouchableOpacity activeOpacity={rating ? 0.8 : 1}
          style={[styles.submitBtn, { backgroundColor: rating ? Colors.ink1000 : Colors.ink100 }]}
          disabled={!rating}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: rating ? Colors.ink25 : Colors.text3 }}>등록</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: Space.s5, gap: Space.s5, paddingBottom: 60 }}>
        <Text style={[styles.reviewPlaceName, { color: Colors.text3 }]}>{r.name.toUpperCase()}</Text>

        {/* Stars */}
        <View style={[styles.starBlock, { backgroundColor: Colors.ink50 }]}>
          <View style={{ flexDirection: 'row', gap: Space.s2 }}>
            {[1,2,3,4,5].map(i => (
              <TouchableOpacity key={i} onPress={() => setRating(i)} activeOpacity={0.7}
                style={{ transform: [{ scale: i <= rating ? 1.1 : 1 }] }}>
                <Ionicons
                  name={i <= rating ? 'star' : 'star-outline'}
                  size={36}
                  color={i <= rating ? Colors.ink1000 : Colors.ink200}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.ratingLabel, { color: Colors.text3 }]}>
            {rating === 0 ? '별을 눌러주세요' : ratingLabels[rating]}
          </Text>
        </View>

        {/* Quick tags */}
        <View>
          <Text style={[styles.microLabel, { color: Colors.text3, marginBottom: Space.s2 }]}>한 단어로</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Space.s2 }}>
            {quickTags.map(t => {
              const on = tags.includes(t);
              return (
                <Chip key={t} active={on} size="sm"
                  onPress={() => setTags(on ? tags.filter(x => x !== t) : [...tags, t])}>
                  #{t}
                </Chip>
              );
            })}
          </View>
        </View>

        {/* Text */}
        <View>
          <Text style={[styles.microLabel, { color: Colors.text3, marginBottom: Space.s2 }]}>한마디 (선택)</Text>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="다음 비밀요원에게 짧게 한마디... (선택)"
            placeholderTextColor={Colors.text3}
            multiline
            style={[styles.reviewTextArea, { borderColor: Colors.border, backgroundColor: Colors.surface, color: Colors.text }]}
          />
        </View>

        {/* Photo + Secret */}
        <View style={{ flexDirection: 'row', gap: Space.s2 }}>
          <TouchableOpacity activeOpacity={0.7}
            style={[styles.photoBtn, { borderColor: Colors.border }]}>
            <Ionicons name="camera-outline" size={16} color={Colors.text2} />
            <Text style={[styles.photoBtnText, { color: Colors.text2 }]}>사진 추가</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSecret(s => !s)} activeOpacity={0.7}
            style={[styles.secretBtn, {
              backgroundColor: secret ? Colors.ink1000 : 'transparent',
              borderColor:     secret ? Colors.ink1000 : Colors.border,
            }]}>
            <Text style={{ fontSize: 14 }}>🤫</Text>
            <Text style={[styles.secretBtnText, { color: secret ? Colors.ink25 : Colors.text2 }]}>비밀팁으로</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Space.s4,
    paddingTop: Space.s2,
    paddingBottom: Space.s2,
    backgroundColor: Colors.bg,
  },
  logoCircle: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  logoText:   { fontSize: 17, fontWeight: '900' },
  appName:    { fontSize: 17, fontWeight: '800', letterSpacing: -0.4 },
  appMono:    { fontSize: 10, fontWeight: '600', letterSpacing: 3, marginTop: 2 },
  searchRow:  { flexDirection: 'row', gap: Space.s2, marginTop: Space.s2 },
  searchBox: {
    flex: 1, height: 44, borderRadius: 12, borderWidth: 1,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Space.s4, gap: Space.s2,
  },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '500' },
  filterBtn: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  filterDot: {
    position: 'absolute', top: 6, right: 6,
    width: 8, height: 8, borderRadius: 4, borderWidth: 1.5,
  },
  mapBg:    { flex: 1, position: 'relative', overflow: 'hidden' },
  mapRoad1: {
    position: 'absolute', left: 0, right: 0,
    top: '55%', height: 14, opacity: 0.4,
  },
  mapRoad2: {
    position: 'absolute', top: 0, bottom: 0,
    left: '35%', width: 10, opacity: 0.4,
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinBubble: {
    borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  pinText:  { fontWeight: '800', letterSpacing: -0.1 },
  pinTail:  {
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    width: 0, height: 0,
  },
  youDot: {
    position: 'absolute', left: '50%', top: '55%',
    width: 18, height: 18, borderRadius: 9, borderWidth: 3,
    marginLeft: -9, marginTop: -9,
  },
  mapAttrib: {
    position: 'absolute', left: 12, bottom: 10,
    fontSize: 9, letterSpacing: 1.2,
  },
  listToggleBtn: {
    position: 'absolute', left: '50%', bottom: 88 + Space.s4,
    transform: [{ translateX: -72 }],
    height: 38, paddingHorizontal: Space.s4, borderRadius: Radius.pill,
    borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: Space.s2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
  },
  listToggleText:  { fontSize: 12, fontWeight: '700', letterSpacing: -0.05 },
  listToggleCount: { fontSize: 11 },
  fab: {
    position: 'absolute', right: Space.s4, bottom: 88 + Space.s4,
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.32, shadowRadius: 12, elevation: 10,
    zIndex: 15,
  },
  listSheet: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
    borderTopLeftRadius: 20, borderTopRightRadius: 20, borderTopWidth: 1,
  },
  dragHandleRow: {
    padding: Space.s3, alignItems: 'center',
  },
  dragHandle: {
    width: 40, height: 4, borderRadius: 2,
  },
  listCard: {
    padding: Space.s3, borderRadius: 14, borderWidth: 1,
    flexDirection: 'row', alignItems: 'stretch', gap: Space.s3,
  },
  listThumb: {
    width: 68, height: 68, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  listCardName: { fontSize: 15, fontWeight: '800', letterSpacing: -0.2, flex: 1 },
  listCardDist: { fontSize: 11, fontWeight: '700', flexShrink: 0 },
  selectedCardOuter: {
    position: 'absolute', left: Space.s3, right: Space.s3, bottom: Space.s4,
    zIndex: 10,
  },
  selectedCard: {
    padding: Space.s3, borderRadius: 16, borderWidth: 1,
    flexDirection: 'row', alignItems: 'stretch', gap: Space.s3, position: 'relative',
    shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.22, shadowRadius: 16, elevation: 8,
  },
  selectedSave: {
    position: 'absolute', top: Space.s2, right: 36 + Space.s2,
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  selectedClose: {
    position: 'absolute', top: Space.s2, right: Space.s2,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.ink50,
    alignItems: 'center', justifyContent: 'center',
  },
  backdrop: { flex: 1, backgroundColor: 'rgba(10,10,10,0.4)' },
  sheet: {
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: Space.s5, paddingTop: Space.s3, paddingBottom: Space.s8,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 16,
  },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Space.s4,
  },
  sheetTitle:  { fontSize: FontSize.h2, fontWeight: '700', letterSpacing: -0.2 },
  clearText:   { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  sectionLabel: { fontSize: FontSize.micro, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Space.s2 },
  ratingRow:  { flexDirection: 'row', gap: Space.s1 },
  ratingBtn: {
    flex: 1, height: 36, borderRadius: Radius.r2, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  ratingBtnText: { fontSize: 11, fontWeight: '700' },
  facilityGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Space.s2,
  },
  facilityBtn: {
    width: (SCREEN_W - Space.s5 * 2 - Space.s2 * 2) / 3,
    padding: Space.s3, borderRadius: 10, borderWidth: 1,
    alignItems: 'center', gap: Space.s2,
  },
  facilityLabel: { fontSize: 12, fontWeight: '700', letterSpacing: -0.05 },
  heroPlaceholder: {
    width: '100%', height: 280,
    alignItems: 'center', justifyContent: 'center',
  },
  heroGradient: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  heroTopRow: {
    position: 'absolute', top: 12, left: 12, right: 12,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  heroBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  heroDots: {
    position: 'absolute', bottom: 14,
    left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: Space.s1,
  },
  heroDot: { height: 6, borderRadius: 3 },
  secretBadge: { position: 'absolute', left: 16, bottom: 30 },
  secretText: {
    fontSize: 10, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase',
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4,
  },
  detailName:    { fontSize: FontSize.h1, fontWeight: '800', letterSpacing: -0.4 },
  detailSub:     { fontSize: 13, marginTop: Space.s1 },
  detailRating:  { fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
  detailReviews: { fontSize: 13 },
  detailDist:    { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginLeft: 'auto' as any },
  quickActions:  { flexDirection: 'row', gap: Space.s2, marginTop: Space.s4 },
  secretNote: {
    marginTop: Space.s2, padding: Space.s4, borderRadius: 12,
    flexDirection: 'row', gap: Space.s2,
  },
  secretNoteLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  secretNoteText:  { fontSize: 13, fontWeight: '600', lineHeight: 20, marginTop: Space.s1 },
  facilitiesCard: {
    marginTop: Space.s5, padding: Space.s4,
    borderWidth: 1, borderRadius: 14,
  },
  microLabel: { fontSize: FontSize.micro, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: Space.s2 },
  facilitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Space.s3, marginTop: Space.s2 },
  facilityItem:  { width: '30%', alignItems: 'center', gap: Space.s2 },
  facilityIcon:  { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  facilityItemLabel: { fontSize: 11, fontWeight: '700', letterSpacing: -0.05 },
  facilitiesFooter: {
    marginTop: Space.s4, paddingTop: Space.s3, borderTopWidth: 1,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  facilityHours:  { fontSize: 12 },
  facilityUpdate: { fontSize: 11 },
  reviewsTitle:   { fontSize: 17, fontWeight: '800', letterSpacing: -0.3 },
  ratingCard: {
    padding: Space.s4, borderWidth: 1, borderRadius: 12,
    flexDirection: 'row', gap: Space.s4, alignItems: 'center', marginBottom: Space.s4,
  },
  ratingBig:   { fontSize: 28, fontWeight: '800', letterSpacing: -0.8, lineHeight: 32 },
  ratingCount: { fontSize: 10, marginTop: 2, letterSpacing: 0.5 },
  barBg:  { height: 4, borderRadius: 2 },
  barFill:{ height: 4, borderRadius: 2 },
  reviewCard: { padding: Space.s4, borderWidth: 1, borderRadius: 12 },
  reviewUser:   { fontSize: 13, fontWeight: '700' },
  reviewTime:   { fontSize: 11, letterSpacing: 0.3 },
  reviewText:   { fontSize: 13, lineHeight: 20, marginTop: Space.s2 },
  reviewFooter: {
    marginTop: Space.s2, paddingTop: Space.s2, borderTopWidth: 1,
    flexDirection: 'row', gap: Space.s4,
  },
  reviewAction: { fontSize: 12, fontWeight: '600' },
  reviewSheetHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Space.s5, paddingVertical: Space.s4,
    borderBottomWidth: 1,
  },
  cancelText:       { fontSize: 13, fontWeight: '700' },
  reviewSheetTitle: { fontSize: FontSize.h2, fontWeight: '700', letterSpacing: -0.2 },
  submitBtn: {
    paddingHorizontal: Space.s4, paddingVertical: Space.s2, borderRadius: 8,
  },
  reviewPlaceName: { fontSize: 12, letterSpacing: 0.5 },
  starBlock: {
    padding: Space.s5, borderRadius: 14,
    alignItems: 'center', gap: Space.s2,
  },
  ratingLabel: { fontSize: 12 },
  reviewTextArea: {
    padding: Space.s3, height: 84, borderWidth: 1, borderRadius: 12,
    fontSize: 14, lineHeight: 22, textAlignVertical: 'top',
  },
  photoBtn: {
    flex: 1, height: 44, borderRadius: 10, borderWidth: 1,
    borderStyle: 'dashed', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Space.s2,
  },
  photoBtnText: { fontSize: 13, fontWeight: '600' },
  secretBtn: {
    flex: 1, height: 44, borderRadius: 10, borderWidth: 1,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Space.s2,
  },
  secretBtnText: { fontSize: 13, fontWeight: '700' },
  ink500: Colors.ink500,
});
