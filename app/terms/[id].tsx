import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, Radius, Space } from '../../constants/tokens';
import { TERM_DETAILS, TermId, TERMS } from '../../features/auth/authFlowTypes';

function isTermId(value: unknown): value is TermId {
  return typeof value === 'string' && TERMS.some(term => term.id === value);
}

export default function TermDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  if (!isTermId(id)) {
    return <Redirect href="/" />;
  }

  const detail = TERM_DETAILS[id];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>약관 상세</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.kicker}>SHHH-CRET TERMS</Text>
        <Text style={styles.title}>{detail.title}</Text>
        <Text style={styles.summary}>{detail.summary}</Text>

        <View style={styles.notice}>
          <Ionicons name="document-text-outline" size={18} color={Colors.text2} />
          <Text style={styles.noticeText}>정식 약관 내용은 추후 업데이트 예정입니다.</Text>
        </View>

        {detail.sections.map((section, index) => (
          <View key={section} style={styles.section}>
            <Text style={styles.sectionTitle}>{index + 1}. 임시 조항</Text>
            <Text style={styles.sectionBody}>{section}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    height: 54,
    paddingHorizontal: Space.s4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.hair,
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: Colors.text,
    fontSize: FontSize.small,
    fontWeight: '900',
  },
  content: {
    padding: Space.s5,
    paddingBottom: Space.s10,
  },
  kicker: {
    color: Colors.text3,
    fontSize: FontSize.micro,
    fontWeight: '800',
    letterSpacing: 0,
  },
  title: {
    marginTop: Space.s2,
    color: Colors.text,
    fontSize: FontSize.h1,
    fontWeight: '900',
    lineHeight: 30,
    letterSpacing: 0,
  },
  summary: {
    marginTop: Space.s3,
    color: Colors.text3,
    fontSize: FontSize.body,
    lineHeight: 23,
  },
  notice: {
    marginTop: Space.s6,
    padding: Space.s4,
    borderRadius: Radius.r2,
    backgroundColor: Colors.ink50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.s2,
  },
  noticeText: {
    flex: 1,
    color: Colors.text2,
    fontSize: FontSize.small,
    fontWeight: '700',
    lineHeight: 19,
  },
  section: {
    marginTop: Space.s5,
    paddingTop: Space.s5,
    borderTopWidth: 1,
    borderTopColor: Colors.hair,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: FontSize.body,
    fontWeight: '900',
  },
  sectionBody: {
    marginTop: Space.s2,
    color: Colors.text2,
    fontSize: FontSize.body,
    lineHeight: 24,
  },
});
