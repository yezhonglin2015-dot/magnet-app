import React from 'react';
import { TouchableOpacity, Image, Text, View, StyleSheet } from 'react-native';
import { colors, radius, fontSize, spacing } from '../constants/theme';

const SLOT_LABELS = ['封面', '中图', '结尾'];

export default function SlotUpload({ index, uri, onSelect }) {
  const label = SLOT_LABELS[index] || '';

  if (uri) {
    return (
      <TouchableOpacity style={styles.slot} onPress={onSelect} activeOpacity={0.85}>
        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
        <View style={styles.labelOverlay}>
          <Text style={styles.labelText}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[styles.slot, styles.emptySlot]} onPress={onSelect} activeOpacity={0.7}>
      <Text style={styles.plusText}>+</Text>
      <Text style={styles.emptyLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  slot: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  emptySlot: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  labelOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
  },
  labelText: {
    color: '#ffffff',
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  plusText: {
    color: colors.sub,
    fontSize: 28,
    lineHeight: 32,
    marginBottom: spacing.xs,
  },
  emptyLabel: {
    color: colors.sub,
    fontSize: fontSize.xs,
  },
});
