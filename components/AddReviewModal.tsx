import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Modal, Image, Dimensions, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Space, FontSize, Radius } from '../constants/tokens';

const { width: SCREEN_W } = Dimensions.get('window');

type Scent = '쾌적' | '보통' | '냄새 심함';
type Cleanliness = '깨끗' | '보통' | '더러움';

const FACILITIES = [
  { id: 'paper',  label: '휴지 유무',   icon: 'document-outline' as const },
  { id: 'bidet',  label: '비데 유무',   icon: 'water-outline' as const },
  { id: 'toilet', label: '양변기 유무', icon: 'accessibility-outline' as const },
  { id: 'soap',   label: '손 세정제',   icon: 'sparkles-outline' as const },
  { id: 'sep',    label: '남녀 분리',   icon: 'people-outline' as const },
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function AddReviewModal({ visible, onClose }: Props) {
  const [location,     setLocation]     = useState('');
  const [placeName,    setPlaceName]    = useState('');
  const [rating,       setRating]       = useState(0);
  const [facilities,   setFacilities]   = useState<string[]>([]);
  const [scent,        setScent]        = useState<Scent | null>(null);
  const [cleanliness,  setCleanliness]  = useState<Cleanliness | null>(null);
  const [detailText,   setDetailText]   = useState('');

  const toggleFacility = (id: string) =>
    setFacilities(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
        {/* Header */}
        <View style={[s.header, { borderBottomColor: Colors.hair }]}>
          <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: Colors.text }]}>리뷰 작성하기</Text>
          <View style={{ width: 36 }} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: Space.s5, gap: Space.s6, paddingBottom: 20 }}
        >
          {/* Title */}
          <View style={{ gap: Space.s1 }}>
            <Text style={[s.title, { color: Colors.text }]}>Shhh-cret한 경험이었나요?</Text>
            <Text style={[s.subtitle, { color: Colors.text3 }]}>방문하신 화장실의 상태를 공유해주세요.</Text>
          </View>

          {/* 위치 */}
          <View style={{ gap: Space.s2 }}>
            <Text style={[s.label, { color: Colors.text }]}>위치</Text>
            <View style={[s.inputRow, { borderColor: Colors.border, backgroundColor: Colors.surface }]}>
              <Ionicons name="location-outline" size={16} color={Colors.text3} />
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="예: 강남역 지하상가 화장실"
                placeholderTextColor={Colors.text3}
                style={[s.input, { color: Colors.text }]}
              />
            </View>
          </View>

          {/* 장소 이름 */}
          <View style={{ gap: Space.s2 }}>
            <Text style={[s.label, { color: Colors.text }]}>장소 이름</Text>
            <TextInput
              value={placeName}
              onChangeText={setPlaceName}
              placeholder="예: 강남역 지하상가 화장실"
              placeholderTextColor={Colors.text3}
              style={[s.inputPlain, { borderColor: Colors.border, backgroundColor: Colors.surface, color: Colors.text }]}
            />
          </View>

          {/* 전체적인 만족도 */}
          <View style={{ gap: Space.s3 }}>
            <Text style={[s.label, { color: Colors.text }]}>전체적인 만족도</Text>
            <View style={{ flexDirection: 'row', gap: Space.s2 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <TouchableOpacity key={i} onPress={() => setRating(i)} activeOpacity={0.7}>
                  <Ionicons
                    name={i <= rating ? 'star' : 'star-outline'}
                    size={32}
                    color={i <= rating ? Colors.ink1000 : Colors.ink200}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 편의시설 체크리스트 */}
          <View style={{ gap: Space.s3 }}>
            <Text style={[s.label, { color: Colors.text }]}>편의시설 체크리스트</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Space.s2 }}>
              {FACILITIES.map(f => {
                const on = facilities.includes(f.id);
                return (
                  <TouchableOpacity
                    key={f.id}
                    onPress={() => toggleFacility(f.id)}
                    activeOpacity={0.8}
                    style={[s.facilityChip, {
                      backgroundColor: on ? Colors.ink1000 : Colors.surface,
                      borderColor: on ? Colors.ink1000 : Colors.border,
                    }]}
                  >
                    <Ionicons name={f.icon} size={14} color={on ? Colors.ink25 : Colors.text2} />
                    <Text style={[s.facilityChipText, { color: on ? Colors.ink25 : Colors.text }]}>
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* SCENT */}
          <View style={{ gap: Space.s2 }}>
            <Text style={[s.segmentLabel, { color: Colors.text3 }]}>SCENT (향기)</Text>
            <SegmentControl
              options={['쾌적', '보통', '냄새 심함']}
              value={scent}
              onChange={v => setScent(v as Scent)}
            />
          </View>

          {/* CLEANLINESS */}
          <View style={{ gap: Space.s2 }}>
            <Text style={[s.segmentLabel, { color: Colors.text3 }]}>CLEANLINESS (청결)</Text>
            <SegmentControl
              options={['깨끗', '보통', '더러움']}
              value={cleanliness}
              onChange={v => setCleanliness(v as Cleanliness)}
            />
          </View>

          {/* 사진 첨부 */}
          <View style={{ gap: Space.s3 }}>
            <Text style={[s.label, { color: Colors.text }]}>사진 첨부</Text>
            <View style={{ flexDirection: 'row', gap: Space.s2 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[s.photoAdd, { borderColor: Colors.border }]}
              >
                <Ionicons name="camera-outline" size={22} color={Colors.text3} />
                <Text style={[s.photoAddText, { color: Colors.text3 }]}>0/3</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 상세 리뷰 */}
          <View style={{ gap: Space.s2 }}>
            <Text style={[s.label, { color: Colors.text }]}>상세 리뷰 (선택)</Text>
            <TextInput
              value={detailText}
              onChangeText={setDetailText}
              placeholder="다른 이용자들에게 도움이 될 만한 내용을 적어주세요."
              placeholderTextColor={Colors.text3}
              multiline
              style={[s.textarea, { borderColor: Colors.border, backgroundColor: Colors.surface, color: Colors.text }]}
            />
          </View>
        </ScrollView>

        {/* 하단 고정 버튼 */}
        <View style={[s.footer, { backgroundColor: Colors.bg, borderTopColor: Colors.hair }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[s.submitBtn, { backgroundColor: Colors.ink1000 }]}
          >
            <Text style={[s.submitText, { color: Colors.ink25 }]}>리뷰 완료하기</Text>
          </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

function SegmentControl({ options, value, onChange }: {
  options: string[];
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <View style={[sc.wrap, { backgroundColor: Colors.ink50 }]}>
      {options.map(opt => {
        const on = value === opt;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onChange(opt)}
            activeOpacity={0.8}
            style={[sc.item, on && { backgroundColor: Colors.ink1000, borderRadius: Radius.r2 }]}
          >
            <Text style={[sc.text, { color: on ? Colors.ink25 : Colors.text2 }]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Space.s4, paddingVertical: Space.s3,
    borderBottomWidth: 1,
  },
  backBtn:     { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSize.h2, fontWeight: '700', letterSpacing: -0.3 },
  title:       { fontSize: 22, fontWeight: '800', letterSpacing: -0.5, lineHeight: 28 },
  subtitle:    { fontSize: 14, lineHeight: 20 },
  label:       { fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
  segmentLabel:{ fontSize: 11, fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: Space.s2,
    height: 48, borderRadius: Radius.r2, borderWidth: 1,
    paddingHorizontal: Space.s4,
  },
  input:      { flex: 1, fontSize: 14 },
  inputPlain: {
    height: 48, borderRadius: Radius.r2, borderWidth: 1,
    paddingHorizontal: Space.s4, fontSize: 14,
  },
  facilityChip: {
    flexDirection: 'row', alignItems: 'center', gap: Space.s1,
    paddingHorizontal: Space.s3, paddingVertical: Space.s2,
    borderRadius: Radius.pill, borderWidth: 1,
  },
  facilityChipText: { fontSize: 13, fontWeight: '600' },
  photoAdd: {
    width: 84, height: 84, borderRadius: 10, borderWidth: 1,
    borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: Space.s1,
  },
  photoAddText: { fontSize: 11, fontWeight: '600' },
  textarea: {
    height: 100, borderWidth: 1, borderRadius: 12,
    padding: Space.s3, fontSize: 14, lineHeight: 22, textAlignVertical: 'top',
  },
  footer: {
    padding: Space.s4, paddingBottom: Space.s5,
    borderTopWidth: 1,
  },
  submitBtn: {
    height: 54, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  submitText: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
});

const sc = StyleSheet.create({
  wrap: {
    flexDirection: 'row', borderRadius: Radius.r2,
    padding: 4, gap: 4,
  },
  item: {
    flex: 1, paddingVertical: Space.s2,
    alignItems: 'center', justifyContent: 'center',
  },
  text: { fontSize: 13, fontWeight: '700' },
});
