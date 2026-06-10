import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Switch as RNSwitch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Space, FontSize, Radius } from '../../constants/tokens';
import { Avatar, Chip } from '../../components/Primitives';
import { FILTERS } from '../../constants/data';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsState {
  autoLocate:     boolean;
  unit:           'm' | 'ft';
  nearbyRadius:   number;
  notifyNearby:   boolean;
  notifyReviews:  boolean;
  notifyTips:     boolean;
  anonTips:       boolean;
  blurAddress:    boolean;
  saveHistory:    boolean;
  vibrate:        boolean;
  sosCountdown:   1 | 3 | 5;
  darkMode:       boolean;
  defaultFilters: string[];
}

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const [vals, setVals] = useState<SettingsState>({
    autoLocate:    true,
    unit:          'm',
    nearbyRadius:  500,
    notifyNearby:  true,
    notifyReviews: true,
    notifyTips:    false,
    anonTips:      true,
    blurAddress:   false,
    saveHistory:   true,
    vibrate:       true,
    sosCountdown:  3,
    darkMode:      false,
    defaultFilters: ['sep', 'paper'],
  });

  const set = <K extends keyof SettingsState>(k: K, v: SettingsState[K]) =>
    setVals(s => ({ ...s, [k]: v }));

  const toggleFilter = (id: string) =>
    setVals(s => ({
      ...s,
      defaultFilters: s.defaultFilters.includes(id)
        ? s.defaultFilters.filter(x => x !== id)
        : [...s.defaultFilters, id],
    }));

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky header */}
      <View style={[styles.stickyHeader, { borderBottomColor: Colors.hair, backgroundColor: Colors.bg }]}>
        <View style={{ width: 40 }} />
        <Text style={[styles.headerMono, { color: Colors.text3 }]}>SETTINGS · SHHH-CRET</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Account card */}
        <TouchableOpacity activeOpacity={0.7}
          style={[styles.accountCard, { borderColor: Colors.hair, backgroundColor: Colors.surface }]}>
          <Avatar initial="비" size={44} bg={Colors.ink1000} fg={Colors.ink25} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[styles.accountName, { color: Colors.text }]}>김비밀</Text>
            <Text style={[styles.accountMono, { color: Colors.text3 }]}>AGENT · LV.3 · kim.secret@shhh.cret</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.text3} />
        </TouchableOpacity>

        {/* 위치 & 지도 */}
        <Section title="위치 & 지도" mono="LOCATION">
          <Row title="자동 위치 사용" sub="현재 위치 기반으로 가까운 곳 추천">
            <SSwitch on={vals.autoLocate} onChange={v => set('autoLocate', v)} />
          </Row>
          <Row title="거리 단위">
            <Segment
              value={vals.unit}
              onChange={v => set('unit', v as 'm' | 'ft')}
              options={[{ value: 'm', label: '미터' }, { value: 'ft', label: '피트' }]} />
          </Row>
          <Row title="근처 알림 반경" sub={`${vals.nearbyRadius}m 이내 새 화장실 발견 시 알림`} stack>
            <SimpleSlider min={100} max={2000} step={100} value={vals.nearbyRadius}
              onChange={v => set('nearbyRadius', v)} />
          </Row>
        </Section>

        {/* 기본 필터 */}
        <Section title="기본 필터" mono="DEFAULTS" desc="지도를 열 때 자동으로 적용돼요">
          <View style={{ padding: Space.s3, flexDirection: 'row', flexWrap: 'wrap', gap: Space.s2 }}>
            {FILTERS.basics.map(f => (
              <Chip key={f.id} active={vals.defaultFilters.includes(f.id)} size="sm"
                onPress={() => toggleFilter(f.id)}>
                {f.label}
              </Chip>
            ))}
          </View>
        </Section>

        {/* 알림 */}
        <Section title="알림" mono="NOTIFICATIONS">
          <Row title="근처 새 화장실" sub="반경 안에 새로 등록되면 알려드려요">
            <SSwitch on={vals.notifyNearby} onChange={v => set('notifyNearby', v)} />
          </Row>
          <Row title="내 리뷰 반응" sub="다른 비밀요원이 내 리뷰에 도움됨을 누르면">
            <SSwitch on={vals.notifyReviews} onChange={v => set('notifyReviews', v)} />
          </Row>
          <Row title="비밀 팁 추천" sub="저장한 동네의 새 SHHH-CRET 팁">
            <SSwitch on={vals.notifyTips} onChange={v => set('notifyTips', v)} />
          </Row>
        </Section>

        {/* 프라이버시 */}
        <Section title="프라이버시" mono="PRIVACY">
          <Row title="비밀 팁 익명 작성" sub="내 닉네임 대신 '익명의 비밀요원'으로">
            <SSwitch on={vals.anonTips} onChange={v => set('anonTips', v)} />
          </Row>
          <Row title="정확한 주소 가리기" sub="공유 시 100m 단위로 흐리게 표시">
            <SSwitch on={vals.blurAddress} onChange={v => set('blurAddress', v)} />
          </Row>
          <Row title="방문 기록 저장" sub="다녀온 곳을 자동으로 기록해 추천에 활용">
            <SSwitch on={vals.saveHistory} onChange={v => set('saveHistory', v)} />
          </Row>
          <LinkRow iconName="lock-closed-outline" title="모든 기록 삭제" sub="저장된 위치 · 검색 · 방문 기록" />
        </Section>

        {/* 긴급 SOS */}
        <Section title="긴급 SOS" mono="EMERGENCY">
          <LinkRow iconName="call-outline" title="비상 연락처 관리" sub="현재 3명 등록됨" />
          <Row title="송신 시 진동" sub="버튼 누르는 동안 진동으로 피드백">
            <SSwitch on={vals.vibrate} onChange={v => set('vibrate', v)} />
          </Row>
          <Row title="카운트다운" sub="버튼을 눌러야 하는 시간" stack>
            <Segment
              value={vals.sosCountdown}
              onChange={v => set('sosCountdown', Number(v) as 1|3|5)}
              options={[
                { value: 1, label: '1초' },
                { value: 3, label: '3초' },
                { value: 5, label: '5초' },
              ]} />
          </Row>
        </Section>

        {/* 표시 */}
        <Section title="표시" mono="APPEARANCE">
          <Row title="비밀(Shhh) 모드" sub="어두운 환경을 위한 다크 테마">
            <SSwitch on={vals.darkMode} onChange={v => set('darkMode', v)} />
          </Row>
          <LinkRow title="언어" sub="한국어" right="한국어" />
        </Section>

        {/* 정보 */}
        <Section title="정보" mono="ABOUT">
          <LinkRow title="공지사항" right="2" />
          <LinkRow title="이용약관" />
          <LinkRow title="개인정보 처리방침" />
          <LinkRow title="오픈소스 라이선스" />
          <Row title="앱 버전">
            <Text style={[styles.versionText, { color: Colors.text3 }]}>v1.4.2 (2026.04)</Text>
          </Row>
        </Section>

        {/* Logout */}
        <View style={{ paddingHorizontal: Space.s4, paddingTop: Space.s5 }}>
          <TouchableOpacity activeOpacity={0.7} onPress={signOut}
            style={[styles.logoutBtn, { borderColor: Colors.border }]}>
            <Text style={[styles.logoutText, { color: Colors.text2 }]}>로그아웃</Text>
          </TouchableOpacity>
        </View>


        <Text style={[styles.footerMono, { color: Colors.text3 }]}>🤫 SHHH—CRET · MADE WITH SECRETS</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Section ───────────────────────────────────────────────────
function Section({ title, mono, desc, children }: { title: string; mono?: string; desc?: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: Space.s6 }}>
      <View style={{ paddingHorizontal: Space.s4, paddingBottom: Space.s2, flexDirection: 'row', alignItems: 'baseline', gap: Space.s2 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {mono && <Text style={[styles.sectionMono, { color: Colors.text3 }]}>{mono}</Text>}
      </View>
      {desc && <Text style={[styles.sectionDesc, { color: Colors.text3 }]}>{desc}</Text>}
      <View style={[styles.sectionBody, { marginHorizontal: Space.s4, borderColor: Colors.hair, backgroundColor: Colors.surface }]}>
        {children}
      </View>
    </View>
  );
}

// ── Row ───────────────────────────────────────────────────────
function Row({ title, sub, children, stack }: { title: string; sub?: string; children: React.ReactNode; stack?: boolean }) {
  return (
    <View style={[styles.row, { flexDirection: stack ? 'column' : 'row', borderBottomColor: Colors.hair }]}>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[styles.rowTitle, { color: Colors.text }]}>{title}</Text>
        {sub && <Text style={[styles.rowSub, { color: Colors.text3 }]}>{sub}</Text>}
      </View>
      <View style={stack ? { marginTop: Space.s2 } : { flexShrink: 0 }}>{children}</View>
    </View>
  );
}

// ── LinkRow ───────────────────────────────────────────────────
function LinkRow({ title, sub, right, iconName }: { title: string; sub?: string; right?: string; iconName?: keyof typeof Ionicons.glyphMap }) {
  return (
    <TouchableOpacity activeOpacity={0.7}
      style={[styles.row, { flexDirection: 'row', borderBottomColor: Colors.hair, gap: Space.s3 }]}>
      {iconName && <Ionicons name={iconName} size={18} color={Colors.text2} />}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={[styles.rowTitle, { color: Colors.text }]}>{title}</Text>
        {sub && <Text style={[styles.rowSub, { color: Colors.text3 }]}>{sub}</Text>}
      </View>
      {right && <Text style={[styles.rightText, { color: Colors.text3 }]}>{right}</Text>}
      <Ionicons name="chevron-forward" size={16} color={Colors.text3} />
    </TouchableOpacity>
  );
}

// ── SSwitch (styled switch) ───────────────────────────────────
function SSwitch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <RNSwitch
      value={on}
      onValueChange={onChange}
      trackColor={{ false: Colors.ink200, true: Colors.ink1000 }}
      thumbColor={Colors.ink25}
      ios_backgroundColor={Colors.ink200}
    />
  );
}

// ── Segment ───────────────────────────────────────────────────
function Segment({ value, onChange, options }: {
  value: string | number;
  onChange: (v: string | number) => void;
  options: { value: string | number; label: string }[];
}) {
  return (
    <View style={[styles.segment, { backgroundColor: Colors.ink50, borderColor: Colors.hair }]}>
      {options.map(o => {
        const on = o.value === value;
        return (
          <TouchableOpacity key={String(o.value)} onPress={() => onChange(o.value)} activeOpacity={0.7}
            style={[styles.segOption, {
              backgroundColor: on ? Colors.surface : 'transparent',
              shadowOpacity: on ? 0.06 : 0,
            }]}>
            <Text style={[styles.segText, { color: on ? Colors.text : Colors.text3, fontWeight: on ? '700' : '600' }]}>
              {o.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── SimpleSlider (shows value only — range input not native in RN) ─────────
function SimpleSlider({ min, max, step, value, onChange }: { min: number; max: number; step: number; value: number; onChange: (v: number) => void }) {
  const steps = Math.round((max - min) / step);
  const ticks = Array.from({ length: steps + 1 }, (_, i) => min + i * step);
  const pct = (value - min) / (max - min);

  return (
    <View>
      {/* Track */}
      <View style={styles.trackOuter}>
        <View style={[styles.trackFill, { width: `${pct * 100}%` as any, backgroundColor: Colors.ink1000 }]} />
      </View>
      {/* Step buttons */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Space.s2, paddingTop: Space.s2 }}>
        {ticks.filter((_, i) => i % 4 === 0 || ticks[i] === value || ticks[i] === max).map(t => (
          <TouchableOpacity key={t} onPress={() => onChange(t)} activeOpacity={0.7}
            style={[styles.tickBtn, {
              backgroundColor: t === value ? Colors.ink1000 : Colors.ink50,
              borderColor: t === value ? Colors.ink1000 : Colors.border,
            }]}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: t === value ? Colors.ink25 : Colors.text2 }}>
              {t}m
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.bg },
  stickyHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Space.s4, paddingVertical: Space.s3,
    borderBottomWidth: 1,
  },
  headerMono:   { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  accountCard: {
    margin: Space.s4, padding: Space.s4,
    borderWidth: 1, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', gap: Space.s3,
  },
  accountName:  { fontSize: 15, fontWeight: '800', letterSpacing: -0.3 },
  accountMono:  { fontSize: 11, letterSpacing: 1, marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '800', letterSpacing: -0.1 },
  sectionMono:  { fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  sectionDesc:  { paddingHorizontal: Space.s4, paddingBottom: Space.s2, fontSize: 12, letterSpacing: -0.1 },
  sectionBody:  { borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
  row: {
    padding: Space.s4, alignItems: 'center',
    gap: Space.s3, borderBottomWidth: 1,
  },
  rowTitle: { fontSize: 14, fontWeight: '600', letterSpacing: -0.1 },
  rowSub:   { fontSize: 12, marginTop: 2, lineHeight: 17 },
  rightText: { fontSize: 12 },
  versionText: { fontSize: 12 },
  segment: {
    flexDirection: 'row', padding: 3,
    borderRadius: 10, borderWidth: 1,
  },
  segOption: {
    paddingHorizontal: Space.s3, paddingVertical: Space.s1,
    borderRadius: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowRadius: 2, elevation: 1,
  },
  segText: { fontSize: 12, letterSpacing: -0.1 },
  trackOuter: {
    height: 4, borderRadius: 2,
    backgroundColor: Colors.ink100, marginTop: Space.s1,
  },
  trackFill: { height: 4, borderRadius: 2 },
  tickBtn: {
    height: 28, paddingHorizontal: Space.s2,
    borderRadius: Radius.pill, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  logoutBtn: {
    height: 48, borderRadius: 12, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  logoutText:  { fontSize: 14, fontWeight: '700' },
  footerMono: {
    padding: Space.s4, textAlign: 'center',
    fontSize: 10, letterSpacing: 2,
  },
});
