import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Space, FontSize } from '../../constants/tokens';

type Phase = 'ready' | 'sending' | 'sent';

export default function SOSScreen() {
  const [phase, setPhase] = useState<Phase>('ready');
  const [count, setCount]   = useState(3);
  const [holding, setHolding] = useState(false);
  const holdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Countdown while holding
  useEffect(() => {
    if (!holding || phase !== 'ready') return;
    if (count === 0) { setPhase('sending'); return; }
    holdRef.current = setTimeout(() => setCount(c => c - 1), 1000);
    return () => { if (holdRef.current) clearTimeout(holdRef.current); };
  }, [holding, count, phase]);

  // Auto-complete sending after 1.8s
  useEffect(() => {
    if (phase !== 'sending') return;
    const t = setTimeout(() => setPhase('sent'), 1800);
    return () => clearTimeout(t);
  }, [phase]);

  // Pulse animation for sending phase
  useEffect(() => {
    if (phase !== 'sending') return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.12, duration: 700, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 700, easing: Easing.in(Easing.ease),  useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [phase, pulseAnim]);

  const reset = () => { setPhase('ready'); setCount(3); setHolding(false); };

  const bgColor = phase === 'sent' ? Colors.ink1000 : Colors.bg;
  const textColor = phase === 'sent' ? Colors.ink25 : Colors.text;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={[styles.headerMono, { color: phase === 'sent' ? Colors.ink300 : Colors.text3 }]}>
          EMERGENCY · SHHH-CRET
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        {phase === 'ready' && (
          <>
            <View style={styles.titleBlock}>
              <Text style={[styles.microLabel, { color: Colors.text3 }]}>HOLD TO BROADCAST</Text>
              <Text style={[styles.h1, { color: textColor }]}>긴급 SOS</Text>
              <Text style={[styles.bodyText, { color: Colors.text2 }]}>
                {'3초간 누르고 있으면 가장 가까운\n관리자와 친구에게 위치를 송신해요.'}
              </Text>
            </View>

            {/* Big SOS button */}
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => { setHolding(true); }}
              onPressOut={() => { setHolding(false); setCount(3); }}
              style={[styles.sosButton, holding && styles.sosButtonActive]}
            >
              {/* Progress ring using border trick */}
              <View style={styles.sosInner}>
                <Ionicons name="radio-outline" size={42} color={Colors.ink25} />
                <Text style={styles.sosCountText}>
                  {holding ? String(count) : 'SOS'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Location card */}
            <View style={[styles.locationCard, { backgroundColor: Colors.surface, borderColor: Colors.hair }]}>
              <Text style={[styles.microLabel, { color: Colors.text3, marginBottom: Space.s2 }]}>현재 위치</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Space.s2 }}>
                <Ionicons name="location" size={14} color={Colors.text} />
                <Text style={[styles.locationTitle, { color: Colors.text }]}>강남역 2번 출구 · 3번 칸</Text>
              </View>
              <Text style={[styles.locationCoords, { color: Colors.text3 }]}>37.4979° N · 127.0276° E · ±5m</Text>
            </View>
          </>
        )}

        {phase === 'sending' && (
          <View style={styles.centeredBlock}>
            <Animated.View style={[styles.sendingCircle, { transform: [{ scale: pulseAnim }] }]}>
              <Ionicons name="radio-outline" size={42} color={Colors.ink25} />
            </Animated.View>
            <Text style={[styles.h2, { color: textColor, marginTop: Space.s5 }]}>송신 중...</Text>
            <Text style={[styles.bodyText, { color: Colors.text2 }]}>위치 정보를 보내고 있어요</Text>
          </View>
        )}

        {phase === 'sent' && (
          <View style={styles.centeredBlock}>
            <View style={styles.sentCircle}>
              <Ionicons name="checkmark" size={48} color={Colors.ink1000} />
            </View>
            <Text style={[styles.h1, { color: Colors.ink25, marginTop: Space.s5 }]}>송신 완료</Text>
            <Text style={[styles.bodyText, { color: Colors.ink300, textAlign: 'center' }]}>
              {'관리자 1명, 친구 2명에게\n위치가 전달되었어요.'}
            </Text>
            <View style={styles.caseCard}>
              <Text style={[styles.caseMono, { color: Colors.ink300 }]}>CASE #SC-2024-0428-1432</Text>
            </View>
            <TouchableOpacity onPress={reset} style={styles.doneBtn} activeOpacity={0.8}>
              <Text style={[styles.doneBtnText, { color: Colors.ink1000 }]}>완료</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Space.s4, paddingVertical: Space.s3,
  },
  headerMono: { fontSize: 11, fontWeight: '800', letterSpacing: 2 },
  body: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: Space.s6, gap: Space.s6,
  },
  titleBlock: { alignItems: 'center', gap: Space.s2 },
  microLabel: {
    fontSize: FontSize.micro, fontWeight: '600', letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  h1:       { fontSize: 32, fontWeight: '800', letterSpacing: -0.8 },
  h2:       { fontSize: FontSize.h1, fontWeight: '800', letterSpacing: -0.4 },
  bodyText: { fontSize: FontSize.body, lineHeight: 22, textAlign: 'center' },
  sosButton: {
    width: 240, height: 240, borderRadius: 120,
    backgroundColor: Colors.ink1000,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28, shadowRadius: 16, elevation: 12,
  },
  sosButtonActive: {
    shadowColor: 'rgba(217,32,32,0.55)', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 24,
    transform: [{ scale: 0.97 }],
  },
  sosInner: { alignItems: 'center', gap: Space.s1 },
  sosCountText: {
    fontSize: 36, fontWeight: '900', letterSpacing: 0.4,
    color: Colors.ink25, fontVariant: ['tabular-nums'],
  },
  locationCard: {
    width: '100%', padding: Space.s4,
    borderWidth: 1, borderRadius: 12,
  },
  locationTitle: { fontSize: 14, fontWeight: '700', letterSpacing: -0.1 },
  locationCoords: { fontSize: 11, marginTop: Space.s1, letterSpacing: 0.5 },
  centeredBlock: { alignItems: 'center', gap: Space.s2 },
  sendingCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: Colors.ink1000,
    alignItems: 'center', justifyContent: 'center',
  },
  sentCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.ink25,
    alignItems: 'center', justifyContent: 'center',
  },
  caseCard: {
    marginTop: Space.s6,
    paddingHorizontal: Space.s4, paddingVertical: Space.s4,
    backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 12,
  },
  caseMono: { fontSize: 12, letterSpacing: 0.8 },
  doneBtn: {
    marginTop: Space.s6,
    paddingHorizontal: Space.s5, paddingVertical: 12,
    borderRadius: 10, backgroundColor: Colors.ink25,
  },
  doneBtnText: { fontSize: 14, fontWeight: '700' },
});
