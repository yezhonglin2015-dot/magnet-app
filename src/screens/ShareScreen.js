import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useApp } from '../context/AppContext';
import { colors, grad, spacing, fontSize, radius } from '../constants/theme';
import MeEntry from '../components/MeEntry';

export default function ShareScreen({ navigation }) {
  const { state, dispatch } = useApp();
  const cardRef = useRef(null);

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

  async function handleShare() {
    try {
      // 把分享卡这块 View 截成图片
      const uri = await captureRef(cardRef, { format: 'png', quality: 1 });
      if (await Sharing.isAvailableAsync()) {
        // 弹出系统分享面板（微信 / 小红书 / 存相册 等）
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: '分享你的展示面磁力卡',
        });
      } else {
        Alert.alert('分享不可用', '可以直接截图这张卡片发出去~');
      }
    } catch (e) {
      Alert.alert('分享失败', '可以直接截图这张卡片发出去~');
    }
  }

  function handleReset() {
    dispatch({ type: 'RESET' });
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <MeEntry navigation={navigation} />
      <View style={styles.container}>
        {/* Back */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        {/* Share card —— view-shot 截的就是这块 */}
        <View ref={cardRef} collapsable={false} style={styles.reportCard}>
          {firstImage ? (
            <View style={styles.imageWrap}>
              <Image source={{ uri: firstImage }} style={styles.image} resizeMode="cover" />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.88)']}
                style={styles.imageFade}
              />
            </View>
          ) : null}

          <View style={styles.cardBody}>
            {personaName ? <Text style={styles.personaName}>{personaName}</Text> : null}
            {tagline ? <Text style={styles.tagline} numberOfLines={2}>{tagline}</Text> : null}
            <View style={styles.divider} />
            {summary ? <Text style={styles.summary} numberOfLines={3}>{summary}</Text> : null}

            {/* 品牌行：图标 + 名 + 勾人 CTA（二维码上线后再加） */}
            <View style={styles.brandRow}>
              <Image source={require('../../assets/icon.png')} style={styles.brandLogo} />
              <View style={styles.brandTextWrap}>
                <Text style={styles.brandName}>Magnet · 展示面磁力</Text>
                <Text style={styles.brandCta}>你的展示面，在替你吸引谁？</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleShare} activeOpacity={0.85} style={styles.ctaWrapper}>
            <LinearGradient
              colors={grad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btn}
            >
              <Text style={styles.btnText}>分享 / 存图</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleReset} activeOpacity={0.7} style={styles.resetBtn}>
            <Text style={styles.resetText}>重新测一次</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
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
  // 卡片占据中间，按钮在底部，整体一屏
  reportCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  imageWrap: {
    width: '100%',
    flex: 1,
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
    height: '45%',
  },
  cardBody: {
    padding: spacing.lg,
  },
  personaName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accent1,
    marginBottom: 6,
  },
  tagline: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  summary: {
    fontSize: fontSize.sm,
    color: colors.sub,
    lineHeight: 22,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  brandLogo: {
    width: 34,
    height: 34,
    borderRadius: 8,
  },
  brandTextWrap: {
    flex: 1,
  },
  brandName: {
    fontSize: fontSize.xs,
    color: colors.text,
    fontWeight: '700',
    letterSpacing: 1,
  },
  brandCta: {
    fontSize: fontSize.xs,
    color: colors.accent1,
    fontWeight: '600',
    marginTop: 2,
  },
  actions: {
    gap: spacing.sm,
  },
  ctaWrapper: {},
  btn: {
    height: 52,
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
    height: 48,
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
