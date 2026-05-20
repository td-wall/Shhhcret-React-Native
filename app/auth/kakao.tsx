import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, FontSize, Space } from '../../constants/tokens';

export default function KakaoAuthCallbackScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>카카오 인증 처리 중</Text>
        <Text style={styles.description}>
          로그인 창이 자동으로 닫히지 않으면 앱 화면으로 돌아가 다시 시도해주세요.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  content: {
    flex: 1,
    padding: Space.s5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.text,
    fontSize: FontSize.h1,
    fontWeight: '900',
    letterSpacing: 0,
  },
  description: {
    marginTop: Space.s3,
    color: Colors.text3,
    fontSize: FontSize.body,
    lineHeight: 23,
    textAlign: 'center',
  },
});
