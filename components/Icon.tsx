import { Ionicons } from '@expo/vector-icons';
import React from 'react';

// Maps design icon names → Ionicons names
const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  search:        'search',
  back:          'chevron-back',
  close:         'close',
  settings:      'settings-outline',
  star:          'star',
  'star-outline':'star-outline',
  bookmark:      'bookmark-outline',
  'bookmark-fill':'bookmark',
  pin:           'location',
  list:          'list',
  map:           'map-outline',
  home:          'home-outline',
  user:          'person-outline',
  sliders:       'options-outline',
  check:         'checkmark',
  'check-circle':'checkmark-circle-outline',
  plus:          'add',
  share:         'share-social-outline',
  navigate:      'navigate-outline',
  clock:         'time-outline',
  camera:        'camera-outline',
  broadcast:     'radio-outline',
  phone:         'call-outline',
  'x-circle':    'close-circle-outline',
  edit:          'create-outline',
  image:         'image-outline',
  shield:        'shield-outline',
  wc:            'body-outline',
  drop:          'water-outline',
  wind:          'leaf-outline',
  baby:          'happy-outline',
  sparkle:       'sparkles-outline',
  shhh:          'finger-print-outline',
  more:          'ellipsis-horizontal',
  'chevron-right': 'chevron-forward',
  'chevron-down':  'chevron-down',
  location:      'locate-outline',
  lock:          'lock-closed-outline',
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 20, color }: IconProps) {
  const ionName = iconMap[name] ?? 'ellipse-outline';
  return <Ionicons name={ionName} size={size} color={color ?? 'currentColor'} />;
}
