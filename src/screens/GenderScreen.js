import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { colors, spacing, fontSize, radius } from '../constants/theme';

export default function GenderScreen({ navigation }) {
  const { dispatch } = useApp();

  const handleSelect = (gender) => {
    dispatch({ type: 'SET_GENDER', payload: gender });
    navigation.navigate('Upload');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>你的展示面是？</Text>
        <Text style={styles.sub}>选你自己的性别，AI 才能对症分析</Text>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.75}
          onPress={() => handleSelect('female')}
        >
          <Text style={styles.emoji}>👨</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardLabel}>男生</Text>
            <Text style={styles.cardSub}>我是男生</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.75}
          onPress={() => handleSelect('male')}
        >
          <Text style={styles.emoji}>👩</Text>
          <View style={styles.cardText}>
            <Text style={styles.cardLabel}>女生</Text>
            <Text style={styles.cardSub}>我是女生</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  inner: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  back: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 22,
    color: colors.text,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginTop: spacing.lg,
  },
  sub: {
    fontSize: fontSize.sm,
    color: colors.sub,
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  emoji: {
    fontSize: 32,
  },
  cardText: {
    flex: 1,
  },
  cardLabel: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.text,
  },
  cardSub: {
    fontSize: fontSize.sm,
    color: colors.sub,
    marginTop: 2,
  },
});
