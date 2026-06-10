import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors, grad, spacing, fontSize, radius } from '../constants/theme';
import DimBar from '../components/DimBar';
import MeEntry from '../components/MeEntry';

export default function BasicScreen({ navigation }) {
  const { state } = useApp();
  const api1 = state.api1;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <MeEntry navigation={navigation} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Back arrow */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>展示面初诊</Text>

        {/* Dim bars */}
        {api1 && (
          <>
            <DimBar label="氛围感" level={api1.氛围感?.level || '中'} />
            <DimBar label="视觉冲击" level={api1.视觉冲击?.level || '中'} />
          </>
        )}

        <View style={styles.spacer} />

        {/* Hook card */}
        {api1 && (
          <View style={styles.hookCard}>
            <Text style={styles.hookText}>{'💬 ' + api1.钩子}</Text>
          </View>
        )}

        {/* Note */}
        <Text style={styles.note}>完整分析：7个维度 · 专属人设 · 磁力改造建议</Text>

        {/* CTA button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Paywall')}
        >
          <LinearGradient
            colors={grad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>解锁完整分析</Text>
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
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  back: {
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  backArrow: {
    fontSize: 22,
    color: colors.text,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  spacer: {
    height: spacing.lg,
  },
  hookCard: {
    backgroundColor: colors.cardAlt,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  hookText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 24,
  },
  note: {
    fontSize: fontSize.sm,
    color: colors.sub,
    marginBottom: spacing.lg,
  },
  button: {
    height: 54,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: fontSize.lg,
  },
});
