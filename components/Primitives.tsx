import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ViewStyle, TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius } from '../constants/tokens';

// ── Chip ──────────────────────────────────────────────────────
interface ChipProps {
  active?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  iconName?: keyof typeof Ionicons.glyphMap;
  size?: 'sm' | 'md';
}
export function Chip({ active, onPress, children, iconName, size = 'md' }: ChipProps) {
  const h  = size === 'sm' ? 28 : 34;
  const px = size === 'sm' ? 10 : 14;
  const fs = size === 'sm' ? 12 : 13;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.chip, {
        height: h, paddingHorizontal: px,
        backgroundColor: active ? Colors.ink1000 : Colors.surface,
        borderColor:     active ? Colors.ink1000 : Colors.border,
      }]}
    >
      {iconName && (
        <Ionicons name={iconName} size={14} color={active ? Colors.ink25 : Colors.text} style={{ marginRight: 4 }} />
      )}
      <Text style={[styles.chipText, { fontSize: fs, color: active ? Colors.ink25 : Colors.text, fontWeight: active ? '700' : '600' }]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

// ── Stars ─────────────────────────────────────────────────────
interface StarsProps {
  value: number;
  size?: number;
  color?: string;
}
export function Stars({ value, size = 12, color = Colors.ink1000 }: StarsProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1,2,3,4,5].map(i => {
        const filled = i <= Math.round(value);
        return (
          <Ionicons
            key={i}
            name={filled ? 'star' : 'star-outline'}
            size={size}
            color={color}
            style={{ opacity: filled ? 1 : 0.25 }}
          />
        );
      })}
    </View>
  );
}

// ── Tag ───────────────────────────────────────────────────────
interface TagProps {
  children: React.ReactNode;
  tone?: 'default' | 'yellow' | 'outline';
}
export function Tag({ children, tone = 'default' }: TagProps) {
  const s = {
    default: { bg: Colors.ink100, fg: Colors.ink900 as string, border: undefined },
    yellow:  { bg: Colors.ink1000, fg: Colors.ink25, border: undefined },
    outline: { bg: 'transparent', fg: Colors.text2, border: Colors.border },
  }[tone];
  return (
    <View style={[styles.tag, {
      backgroundColor: s.bg,
      borderWidth:     s.border ? 1 : 0,
      borderColor:     s.border ?? 'transparent',
    }]}>
      <Text style={[styles.tagText, { color: s.fg }]}>{children}</Text>
    </View>
  );
}

// ── Btn ───────────────────────────────────────────────────────
interface BtnProps {
  variant?: 'primary' | 'ghost' | 'soft' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  iconName?: keyof typeof Ionicons.glyphMap;
  full?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
}
export function Btn({ variant = 'primary', size = 'md', iconName, full, onPress, children, disabled, style }: BtnProps) {
  const sizes = {
    sm: { h: 36, px: 14, fs: 13 },
    md: { h: 44, px: 18, fs: 14 },
    lg: { h: 56, px: 22, fs: 16 },
  }[size];
  const variants = {
    primary: { bg: Colors.ink1000, fg: Colors.ink25, bd: Colors.ink1000 },
    ghost:   { bg: 'transparent',  fg: Colors.text,  bd: Colors.border },
    soft:    { bg: Colors.ink50,   fg: Colors.text,  bd: 'transparent' },
    danger:  { bg: '#d92020',      fg: '#fff',       bd: '#d92020' },
  }[variant];
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[styles.btn, {
        height:            sizes.h,
        paddingHorizontal: sizes.px,
        width:             full ? '100%' : undefined,
        backgroundColor:   variants.bg,
        borderColor:       variants.bd,
        opacity:           disabled ? 0.5 : 1,
      }, style]}
    >
      {iconName && <Ionicons name={iconName} size={16} color={variants.fg} style={{ marginRight: 6 }} />}
      <Text style={[styles.btnText, { fontSize: sizes.fs, color: variants.fg }]}>{children}</Text>
    </TouchableOpacity>
  );
}

// ── IconBtn ───────────────────────────────────────────────────
interface IconBtnProps {
  iconName: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  size?: number;
  iconSize?: number;
  style?: ViewStyle;
  color?: string;
}
export function IconBtn({ iconName, onPress, size = 40, iconSize = 20, style, color }: IconBtnProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.iconBtn, { width: size, height: size }, style]}
    >
      <Ionicons name={iconName} size={iconSize} color={color ?? Colors.text} />
    </TouchableOpacity>
  );
}

// ── Avatar ────────────────────────────────────────────────────
interface AvatarProps {
  initial: string;
  size?: number;
  bg?: string;
  fg?: string;
}
export function Avatar({ initial, size = 36, bg = Colors.ink100, fg = Colors.ink900 }: AvatarProps) {
  return (
    <View style={[styles.avatar, { width: size, height: size, backgroundColor: bg }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.42, color: fg }]}>{initial}</Text>
    </View>
  );
}

// ── PaperPlaceholder ──────────────────────────────────────────
interface PaperPlaceholderProps {
  w: number | string;
  h: number;
  radius?: number;
  label?: string;
}
export function PaperPlaceholder({ w, h, radius = 14, label }: PaperPlaceholderProps) {
  return (
    <View style={{
      width: typeof w === 'number' ? w : undefined,
      alignSelf: w === '100%' ? 'stretch' : undefined,
      height: h,
      borderRadius: radius,
      backgroundColor: Colors.ink100,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {!!label && <Text style={{ fontSize: 11, color: Colors.ink500, fontWeight: '700' }}>{label}</Text>}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Radius.pill, borderWidth: 1,
  },
  chipText: { letterSpacing: -0.1 },
  tag: {
    flexDirection: 'row', alignItems: 'center',
    height: 22, paddingHorizontal: 8, borderRadius: Radius.r1,
  },
  tagText: { fontSize: 11, fontWeight: '700', letterSpacing: -0.05 },
  btn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: 12, borderWidth: 1,
  },
  btnText: { fontWeight: '700', letterSpacing: -0.1 },
  iconBtn: {
    borderRadius: Radius.pill, borderWidth: 1,
    borderColor: Colors.border, backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  avatar: {
    borderRadius: Radius.pill, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontWeight: '700', letterSpacing: -0.2 },
});
