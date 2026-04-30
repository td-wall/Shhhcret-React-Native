import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Space } from '../../constants/tokens';
import { Avatar, Btn } from '../../components/Primitives';
import { useAuth } from '../../contexts/AuthContext';

const TABS = [
  { id: 'reviews', label: '내 리뷰' },
  { id: 'tips',    label: '내 팁' },
] as const;

type TabId = typeof TABS[number]['id'];

export default function ProfileScreen() {
  const [tab, setTab] = useState<TabId>('reviews');
  const { session, signOut } = useAuth();
  const user = session?.user;
  const initial = user?.nickname?.trim().charAt(0) || '쉬';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={[styles.headerMono, { color: Colors.text3 }]}>MY · SHHH-CRET</Text>
        <TouchableOpacity onPress={signOut} activeOpacity={0.7} style={styles.logoutButton}>
          <Text style={[styles.logoutText, { color: Colors.text3 }]}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero card */}
        <View style={[styles.heroCard, { backgroundColor: Colors.ink1000 }]}>
          {/* Big faint emoji */}
          <Text style={styles.bgEmoji}>🤫</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: Space.s4 }}>
            <Avatar initial={initial} size={56} bg={Colors.ink25} fg={Colors.ink1000} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroName, { color: Colors.ink25 }]}>{user?.nickname ?? '쉬크릿 유저'}</Text>
              <Text style={[styles.heroMono, { color: Colors.ink300 }]}>{user?.email ?? 'SHHH-CRET MEMBER'}</Text>
            </View>
          </View>

          {/* Stats grid */}
          <View style={styles.statsRow}>
            {([
              ['24', '스크랩'],
              ['12', '내 리뷰'],
              ['3',  'SHHH 팁'],
            ] as [string, string][]).map(([n, l]) => (
              <View key={l} style={styles.statCell}>
                <Text style={[styles.statNum, { color: Colors.ink25 }]}>{n}</Text>
                <Text style={[styles.statLabel, { color: Colors.ink300 }]}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabRow, { borderBottomColor: Colors.hair }]}>
          {TABS.map(t => {
            const on = t.id === tab;
            return (
              <TouchableOpacity key={t.id} onPress={() => setTab(t.id)} activeOpacity={0.7}
                style={[styles.tabBtn, { borderBottomColor: on ? Colors.ink1000 : 'transparent', borderBottomWidth: 2 }]}>
                <Text style={[styles.tabLabel, { color: on ? Colors.text : Colors.text3, fontWeight: on ? '700' : '600' }]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tab body */}
        <View style={{ padding: Space.s4, gap: Space.s2 }}>
          {tab === 'reviews' && (
            <View style={styles.placeholder}>
              <Text style={[styles.placeholderText, { color: Colors.text3 }]}>작성한 리뷰가 여기에 표시됩니다</Text>
            </View>
          )}
          {tab === 'tips' && (
            <View style={[styles.tipCard, { backgroundColor: Colors.ink1000 }]}>
              <Text style={[styles.tipMono, { color: Colors.ink300 }]}>SHHH-CRET TIP · 03</Text>
              <Text style={[styles.tipText, { color: Colors.ink25 }]}>
                성수 카페 거리 골목 안쪽 화장실은 4시 이후가 가장 한가해요.
              </Text>
              <Text style={[styles.tipFooter, { color: Colors.ink300 }]}>👍 28 · 🤫 14</Text>
            </View>
          )}
          <Btn variant="ghost" full onPress={signOut}>로그아웃</Btn>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Space.s4, paddingVertical: Space.s3,
  },
  headerMono: { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  logoutButton: {
    width: 64,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0,
  },
  heroCard: {
    margin: Space.s4, padding: Space.s5,
    borderRadius: 16, overflow: 'hidden',
  },
  bgEmoji: {
    position: 'absolute', right: -24, top: -24,
    fontSize: 140, opacity: 0.06,
    transform: [{ rotate: '-15deg' }],
  },
  heroName:   { fontSize: 18, fontWeight: '800', letterSpacing: -0.4 },
  heroMono:   { fontSize: 11, letterSpacing: 1, marginTop: 2 },
  statsRow: {
    flexDirection: 'row', marginTop: Space.s4, gap: Space.s2,
  },
  statCell: {
    flex: 1, paddingVertical: Space.s2,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10,
  },
  statNum:   { fontSize: 18, fontWeight: '800', color: Colors.ink25 },
  statLabel: { fontSize: 10, letterSpacing: 0.5, marginTop: 1 },
  tabRow: {
    flexDirection: 'row', paddingHorizontal: Space.s4,
    borderBottomWidth: 1, marginTop: Space.s5,
  },
  tabBtn: {
    paddingVertical: Space.s3, paddingHorizontal: Space.s3,
    marginBottom: -1,
  },
  tabLabel: { fontSize: 13, letterSpacing: -0.1 },
  placeholder: {
    paddingVertical: 32, alignItems: 'center',
  },
  placeholderText: { fontSize: 12, letterSpacing: 0.3 },
  tipCard: {
    padding: Space.s4, borderRadius: 12, gap: Space.s2,
  },
  tipMono: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  tipText: { fontSize: 14, fontWeight: '700', lineHeight: 22 },
  tipFooter: { fontSize: 11 },
});
