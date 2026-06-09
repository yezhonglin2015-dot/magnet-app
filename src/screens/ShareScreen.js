import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors, grad, spacing, fontSize, radius } from '../constants/theme';

export default function ShareScreen({ navigation }) {
  const { state, dispatch } = useApp();

  const personaName = state.api2?.人设?.name || '';
  const selectedTypes = state.selectedTypes || [];
  const lueshi = state.api2?.叙事 || '';
  const quote = lueshi.length > 80 ? lueshi.slice(0, 80) + '…' : lueshi;

  function handleShare() {
    Alert.alert('截图分享', '截图这个页面，发给朋友或存到相册~');
  }

  function handleReset() {
    dispatch({ type: 'RESET' });
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        {/* Page title */}
        <Text style={styles.pageTitle}>分析报告</Text>

        {/* Report card */}
        <View style={styles.reportCard}>
          {/* Persona name */}
          {personaName ? (
            <Text style={styles.personaName}>{personaName}</Text>
          ) : null}

          {/* Selected type tags */}
          {selectedTypes.length > 0 && (
            <View style={styles.tagRow}>
              {selectedTypes.map((t, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>#{t}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Quote */}
          {quote ? (
            <Text style={styles.quote}>{quote}</Text>
          ) : null}
        </View>

        {/* Share button */}
        <TouchableOpacity onPress={handleShare} activeOpacity={0.8} style={styles.ctaWrapper}>
          <LinearGradient
            colors={grad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>分享</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Reset button */}
        <TouchableOpacity onPress={handleReset} activeOpacity={0.7} style={styles.resetBtn}>
          <Text style={styles.resetText}>重新测一次</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  backBtn: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    alignSelf: 'flex-start',
  },
  back: {
    fontSize: 22,
    color: colors.text,
  },
  pageTitle: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  reportCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  personaName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e85d8a',
    marginBottom: spacing.md,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  tag: {
    backgroundColor: '#2a2a2a',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagText: {
    fontSize: fontSize.sm,
    color: colors.sub,
  },
  quote: {
    fontSize: fontSize.sm,
    color: colors.sub,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  ctaWrapper: {
    marginBottom: spacing.md,
  },
  btn: {
    height: 54,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: fontSize.lg,
  },
  resetBtn: {
    height: 54,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetText: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: '600',
  },
});
