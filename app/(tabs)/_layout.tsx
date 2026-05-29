import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Space } from '../../constants/tokens';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../contexts/AuthContext';

// Custom tab bar that matches the design:
// saved | SOS | MAP (center elevated) | profile | settings
function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const tabs = [
    { routeName: 'saved',    label: '저장',   iconOn: 'bookmark' as const,          iconOff: 'bookmark-outline' as const },
    { routeName: 'sos',      label: 'SOS',    iconOn: 'radio' as const,              iconOff: 'radio-outline' as const,    isSOS: true },
    { routeName: 'map',      label: '지도',   iconOn: 'map' as const,                iconOff: 'map-outline' as const,      isCenter: true },
    { routeName: 'profile',  label: '마이',   iconOn: 'person' as const,             iconOff: 'person-outline' as const },
    { routeName: 'settings', label: '설정',   iconOn: 'settings' as const,           iconOff: 'settings-outline' as const },
  ];

  return (
    <View style={[styles.tabBar, { backgroundColor: 'rgba(255,255,255,0.94)', borderTopColor: Colors.hair, paddingBottom: insets.bottom }]}>
      {tabs.map(tab => {
        const routeIndex = state.routes.findIndex(r => r.name === tab.routeName);
        const focused    = state.index === routeIndex;
        const color      = focused ? Colors.ink1000 : Colors.text3;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: state.routes[routeIndex]?.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(tab.routeName);
          }
        };

        if (tab.isCenter) {
          return (
            <TouchableOpacity key={tab.routeName} onPress={onPress} activeOpacity={0.85}
              style={styles.centerTabWrapper}>
              <View style={[styles.centerCircle, { backgroundColor: Colors.ink1000, borderColor: Colors.bg }]}>
                <Ionicons name={focused ? tab.iconOn : tab.iconOff} size={24} color={Colors.ink25} />
              </View>
              <Text style={[styles.centerLabel, { color }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        }

        if (tab.isSOS) {
          return (
            <TouchableOpacity key={tab.routeName} onPress={onPress} activeOpacity={0.8}
              style={styles.tabItem}>
              <Ionicons name={focused ? tab.iconOn : tab.iconOff} size={18} color={color} />
              <Text style={[styles.sosLabel, { color, fontWeight: focused ? '800' : '700' }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity key={tab.routeName} onPress={onPress} activeOpacity={0.8}
            style={styles.tabItem}>
            <Ionicons name={focused ? tab.iconOn : tab.iconOff} size={20} color={color} />
            <Text style={[styles.tabLabel, { color, fontWeight: focused ? '800' : '600' }]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      initialRouteName="map"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="saved"        options={{ title: '저장한 장소' }} />
      <Tabs.Screen name="sos"          options={{ title: '긴급 SOS' }} />
      <Tabs.Screen name="map"          options={{ title: '쉬크릿 지도' }} />
      <Tabs.Screen name="profile"      options={{ title: '마이 쉬크릿' }} />
      <Tabs.Screen name="settings"     options={{ title: '설정' }} />
      {/* 기존 파일 유지 — 탭바에서는 숨김 */}
      <Tabs.Screen name="my-shhhcret"  options={{ href: null, title: '마이 쉬크릿 (구)' }} />
    </Tabs>
  );
}

const TAB_HEIGHT = 72;

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    minHeight: TAB_HEIGHT,
    paddingBottom: 4,
    borderTopWidth: 1,
    alignItems: 'stretch',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.s1,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: -0.1,
  },
  sosLabel: {
    fontSize: 9,
    letterSpacing: 1,
  },
  centerTabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0,
    gap: Space.s1,
  },
  centerCircle: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    marginTop: -14,
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  centerLabel: {
    fontSize: 10,
    letterSpacing: -0.1,
    fontWeight: '700',
  },
});
