import React from 'react';
import {
  View,
  Text,
  Image,
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
  const tagline = state.api2?.人设?.tagline || '';
  const firstImage = state.images?.[0] || null;

  // 取叙事前 1~2 句做简短总结
  const lueshi = state.api2?.叙事 || '';
  const summary = lueshi
    .split(/(?<=[。！？])/)
    .slice(0, 2)
    .join('')
    .trim();

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
        <Text style={styles.pageTitle}>分享卡</Text>

        {/* Share card */}
        <View style={styles.reportCard}>
          {/* 用户第一张截图 */}
          {firstImage ? (
            <View style={styles.imageWrap}>
              <Image source={{ uri: firstImage }} style={styles.image} resizeMode="cover" />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.85)']}
                style={styles.imageFade}
              />
            </View>
          ) : null}

          {/* 内容区 */}
          <View style={styles.cardBody}>
            {/* 标题（人设名） */}
            {personaName ? (
              <Text style={styles.personaName}>{personaName}</Text>
            ) : null}

            {/* tagline */}
            {tagline ? (
              <Text style={styles.tagline}>{tagline}</Text>
            ) : null}

            {/* 分隔线 */}
            <View style={styles.divider} />

            {/* 简短总结 */}
            {summary ? (
              <Text style={styles.summary}>{summary}</Text>
            ) : null}

            {/* 品牌水印 */}
            <Text style={styles.brand}>Magnet · 展示面磁力</Text>
          </View>
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
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    // 卡片阴影，更精致
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 4 / 5,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  cardBody: {
    padding: spacing.lg,
  },
  personaName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.accent1,
    marginBottom: 6,
  },
  tagline: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  summary: {
    fontSize: fontSize.sm,
    color: colors.sub,
    lineHeight: 24,
  },
  brand: {
    fontSize: fontSize.xs,
    color: colors.sub,
    opacity: 0.6,
    marginTop: spacing.lg,
    letterSpacing: 1,
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
