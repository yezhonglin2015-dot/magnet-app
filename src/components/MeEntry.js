import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, fontSize } from '../constants/theme';

// 右上角「我的」入口，各屏复用，绝对定位浮在内容上方。
export default function MeEntry({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <TouchableOpacity
      style={[styles.meEntry, { top: insets.top + spacing.xs }]}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('Me')}
    >
      <Text style={styles.meText}>我的</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  meEntry: {
    position: 'absolute',
    right: spacing.lg,
    zIndex: 20,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  meText: {
    fontSize: fontSize.md,
    color: colors.sub,
    fontWeight: '600',
  },
});
