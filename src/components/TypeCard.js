import React from 'react';
import { TouchableOpacity, Image, Text, View, StyleSheet } from 'react-native';
import { TYPE_IMAGES } from '../constants/config';
import { colors, radius, fontSize } from '../constants/theme';

export default function TypeCard({ typeName, gender, selected, onPress }) {
  const imageSource = TYPE_IMAGES[gender] && TYPE_IMAGES[gender][typeName]
    ? TYPE_IMAGES[gender][typeName]
    : null;

  return (
    <TouchableOpacity
      style={[styles.card, selected ? styles.cardSelected : styles.cardUnselected]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {imageSource ? (
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}

      <View style={styles.overlay}>
        <Text style={styles.label}>{typeName}</Text>
      </View>

      {selected && <View style={styles.selectedBadge} />}
    </TouchableOpacity>
  );
}

const CARD_WIDTH = 150;
const CARD_HEIGHT = 180;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    position: 'relative',
  },
  cardSelected: {
    borderColor: colors.accent1,
  },
  cardUnselected: {
    borderColor: 'transparent',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.cardAlt,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
  },
  label: {
    color: '#ffffff',
    fontSize: fontSize.sm,
    fontWeight: '700',
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent1,
  },
});
