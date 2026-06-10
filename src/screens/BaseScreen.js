import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors, grad, spacing, fontSize, radius } from '../constants/theme';
import DimBar from '../components/DimBar';

export default function BaseScreen({ navigation }) {
  const { state } = useApp();
  const api2 = state.api2;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back arrow */}
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Persona card */}
        <View style={styles.card}>
          <Text style={styles.personaName}>{api2?.人设?.name || '—'}</Text>
          <Text style={styles.personaTagline}>{api2?.人设?.tagline || ''}</Text>
        </View>

        {/* 7 dimensions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>展示面7维</Text>
          {(api2?.维度 || []).map((dim) => (
            <DimBar key={dim.key} label={dim.key} level={dim.level} />
          ))}
        </View>

        {/* Narrative */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>展示面在说</Text>
          <Text style={styles.narrative}>{api2?.叙事 || ''}</Text>
        </View>

        {/* Plus direction */}
        <View style={styles.section}>
          <Text style={styles.plusTitle}>✨ 加分方向</Text>
          {(api2?.加 || []).map((t, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.plusBullet}>＋</Text>
              <Text style={styles.itemText}>{t}</Text>
            </View>
          ))}
        </View>

        {/* Minus direction */}
        <View style={styles.section}>
          <Text style={styles.minusTitle}>🍃 先收一收</Text>
          {(api2?.减 || []).map((t, i) => (
            <View key={i} style={styles.listItem}>
              <Text style={styles.minusBullet}>－</Text>
              <Text style={styles.itemText}>{t}</Text>
            </View>
          ))}
        </View>

        {/* Retest note */}
        {!!api2?.复测引导 && (
          <Text style={styles.retestNote}>{api2.复测引导}</Text>
        )}

        {/* CTA button */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.ctaWrapper}
          onPress={() => navigation.navigate('Target')}
        >
          <LinearGradient
            colors={grad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradButton}
          >
            <Text style={styles.gradButtonText}>选择想吸引的类型 →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  backButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  backArrow: {
    fontSize: 22,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  personaName: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.accent1,
    marginBottom: spacing.xs,
  },
  personaTagline: {
    fontSize: fontSize.sm,
    color: colors.sub,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  narrative: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 26,
  },
  plusTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.good,
    marginBottom: spacing.md,
  },
  minusTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.bad,
    marginBottom: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  plusBullet: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.good,
    marginRight: spacing.sm,
    lineHeight: 26,
  },
  minusBullet: {
    fontSize: fontSize.md,
    fontWeight: '800',
    color: colors.bad,
    marginRight: spacing.sm,
    lineHeight: 26,
  },
  itemText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 26,
  },
  retestNote: {
    fontSize: fontSize.sm,
    color: colors.sub,
    fontStyle: 'italic',
    marginBottom: spacing.lg,
  },
  ctaWrapper: {
    marginTop: spacing.sm,
  },
  gradButton: {
    height: 54,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: fontSize.lg,
  },
});
