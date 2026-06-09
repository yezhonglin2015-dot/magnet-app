import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSize } from '../constants/theme';
import { LEVEL_W } from '../constants/config';

export default function DimBar({ label, level }) {
  const fillRatio = LEVEL_W[level] || 0.5;
  const fillPercent = (fillRatio * 100).toFixed(1) + '%';

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.trackWrap}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: fillPercent }]} />
        </View>
        <Text style={styles.levelText}>{level}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    flex: 1,
    color: colors.sub,
    fontSize: fontSize.sm,
  },
  trackWrap: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    backgroundColor: colors.accent1,
    borderRadius: 3,
  },
  levelText: {
    color: colors.sub,
    fontSize: fontSize.xs,
    width: 28,
    textAlign: 'right',
  },
});
